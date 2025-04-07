# backend/deepseek.py
import os
import time
import logging
import requests
from typing import Dict, Any, Optional, List, Union
from requests.exceptions import RequestException, Timeout, ConnectionError

# Import configuration and cache
from config import settings
from cache import response_cache

# Set up logging
logger = logging.getLogger("deepseek")

class DeepSeekAPIError(Exception):
    """Custom exception for DeepSeek API errors"""
    def __init__(self, message: str, status_code: Optional[int] = None, response: Optional[Dict] = None):
        self.message = message
        self.status_code = status_code
        self.response = response
        super().__init__(self.message)


class DeepSeek:
    """Client for interacting with the DeepSeek API"""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize DeepSeek client with API key.
        
        Args:
            api_key: DeepSeek API key. If not provided, will attempt to load from settings or environment.
        """
        logger.info("Initializing DeepSeek client...")
        
        # Try to get API key from various sources
        self.api_key = api_key or (settings.DEEPSEEK_API_KEY if settings else None) or os.getenv("DEEPSEEK_API_KEY")
        
        # Validate API key
        if not self.api_key:
            raise ValueError(
                "DeepSeek API key not provided. Either pass the key directly, "
                "set it in application settings, or use the DEEPSEEK_API_KEY environment variable."
            )
            
        # Check for obviously invalid API keys
        if not self.api_key.startswith("sk-"):
            logger.warning("API key doesn't follow expected format. Please verify your API key.")
        
        # Get base URL and other settings from configuration
        if settings:
            self.base_url = settings.DEEPSEEK_API_BASE_URL
            self.default_model = settings.DEEPSEEK_MODEL
            self.default_timeout = settings.DEEPSEEK_REQUEST_TIMEOUT
            self.max_retries = settings.DEEPSEEK_MAX_RETRIES
            self.request_logging = settings.AI_REQUEST_LOGGING
        else:
            self.base_url = "https://api.deepseek.com/v1"
            self.default_model = "deepseek-chat"
            self.default_timeout = 30
            self.max_retries = 3
            self.request_logging = True
        
        self.chat_endpoint = f"{self.base_url}/chat/completions"
        
        logger.info("DeepSeek client initialized successfully")
    
    def _prepare_headers(self) -> Dict[str, str]:
        """Prepare HTTP headers for API requests.
        
        Returns:
            Dictionary of HTTP headers.
        """
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": f"ElevateCareerCoach/1.0"
        }
    
    def _handle_response(self, response: requests.Response) -> Dict:
        """Handle and parse API response.
        
        Args:
            response: Response object from requests.
            
        Returns:
            Parsed response data.
            
        Raises:
            DeepSeekAPIError: If the API returns an error response.
        """
        try:
            response_data = response.json()
            
            # Check for error in response
            if response.status_code != 200:
                error_message = response_data.get("error", {}).get("message", "Unknown API error")
                raise DeepSeekAPIError(
                    message=f"API request failed: {error_message}",
                    status_code=response.status_code,
                    response=response_data
                )
                
            return response_data
            
        except ValueError:  # JSON parsing error
            raise DeepSeekAPIError(
                message=f"Failed to parse API response: {response.text}",
                status_code=response.status_code
            )
    
    def _make_request_with_retry(
        self, 
        url: str, 
        data: Dict, 
        max_retries: Optional[int] = None, 
        base_delay: float = 1.0,
        timeout: Optional[int] = None
    ) -> Dict:
        """Make API request with retry logic.
        
        Args:
            url: API endpoint URL.
            data: Request payload.
            max_retries: Maximum number of retry attempts.
            base_delay: Base delay between retries in seconds.
            timeout: Request timeout in seconds.
            
        Returns:
            Parsed API response.
            
        Raises:
            DeepSeekAPIError: If all retry attempts fail.
        """
        # Use default values if not specified
        max_retries = max_retries if max_retries is not None else self.max_retries
        timeout = timeout if timeout is not None else self.default_timeout
        
        headers = self._prepare_headers()
        
        # Check cache first if we should use it
        cached_response = response_cache.get(data)
        if cached_response:
            logger.info("Retrieved response from cache")
            return {
                "choices": [
                    {"message": {"content": cached_response}}
                ],
                "cached": True
            }
        
        for attempt in range(max_retries + 1):
            try:
                if self.request_logging:
                    logger.debug(f"Making API request to {url} (attempt {attempt + 1}/{max_retries + 1})")
                    logger.debug(f"Request payload: {data}")
                
                start_time = time.time()
                response = requests.post(
                    url, 
                    json=data, 
                    headers=headers,
                    timeout=timeout
                )
                elapsed_time = time.time() - start_time
                
                if self.request_logging:
                    logger.debug(f"Response received in {elapsed_time:.2f}s with status {response.status_code}")
                
                # Check if we hit a rate limit (assuming 429 is the rate limit status code)
                if response.status_code == 429:
                    retry_after = int(response.headers.get("Retry-After", attempt + 1))
                    logger.warning(f"Rate limit exceeded. Retrying after {retry_after} seconds.")
                    time.sleep(retry_after)
                    continue
                
                # Process the response
                response_data = self._handle_response(response)
                
                # If response was successful and we got content, cache it
                if "choices" in response_data and response_data["choices"]:
                    content = response_data["choices"][0]["message"]["content"]
                    response_cache.set(data, content)
                
                return response_data
                
            except (ConnectionError, Timeout) as e:
                # Network-related errors
                if attempt == max_retries:
                    raise DeepSeekAPIError(f"Failed to connect to DeepSeek API after {max_retries} attempts: {str(e)}")
                
                # Exponential backoff with jitter
                delay = base_delay * (2 ** attempt) * (0.5 + 0.5 * (attempt / max_retries))
                logger.warning(f"Connection error: {str(e)}. Retrying in {delay:.2f} seconds...")
                time.sleep(delay)
                
            except DeepSeekAPIError as e:
                # Don't retry if it's a client error (4xx except 429)
                if 400 <= (e.status_code or 0) < 500 and e.status_code != 429:
                    raise
                
                if attempt == max_retries:
                    raise
                
                delay = base_delay * (2 ** attempt)
                logger.warning(f"API error: {e.message}. Retrying in {delay:.2f} seconds...")
                time.sleep(delay)
                
            except Exception as e:
                # Unexpected errors
                raise DeepSeekAPIError(f"Unexpected error: {str(e)}")
        
        # This should not be reached due to the raise statements above,
        # but adding as a fallback
        raise DeepSeekAPIError("Maximum retry attempts exceeded")
    
    def get_response(
        self, 
        user_input: str, 
        system_prompt: str = "You are a helpful career coach.",
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        model: Optional[str] = None,
        timeout: Optional[int] = None,
        use_cache: bool = True
    ) -> str:
        """Send user input to DeepSeek API and get response.
        
        Args:
            user_input: User's input/question.
            system_prompt: System prompt to guide model behavior.
            temperature: Sampling temperature (0.0 to 1.0).
            max_tokens: Maximum tokens in the response.
            model: DeepSeek model to use.
            timeout: Request timeout in seconds.
            use_cache: Whether to use the response cache.
            
        Returns:
            Model's text response.
            
        Raises:
            DeepSeekAPIError: If the API request fails.
        """
        # Disable cache if requested
        original_cache_enabled = response_cache.enabled
        if not use_cache:
            response_cache.enabled = False
        
        try:
            model = model or self.default_model
            logger.info(f"Sending request to DeepSeek API (model: {model})")
            
            # Validate inputs
            if not user_input or not user_input.strip():
                raise ValueError("User input cannot be empty")
            
            if not 0 <= temperature <= 1:
                logger.warning(f"Temperature {temperature} is outside recommended range [0.0, 1.0]")
            
            # Prepare payload
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_input}
                ],
                "temperature": temperature
            }
            
            # Add optional parameters
            if max_tokens is not None:
                payload["max_tokens"] = max_tokens
            
            # Make the API request
            response_data = self._make_request_with_retry(
                url=self.chat_endpoint,
                data=payload,
                timeout=timeout
            )
            
            # Check if this was a cached response
            if response_data.get("cached", False):
                return response_data["choices"][0]["message"]["content"]
            
            # Validate and extract content from response
            if not response_data.get("choices"):
                raise DeepSeekAPIError(
                    "Invalid API response format, 'choices' field missing",
                    response=response_data
                )
                
            try:
                content = response_data["choices"][0]["message"]["content"]
                logger.info("Successfully received response from DeepSeek API")
                return content
            except (KeyError, IndexError) as e:
                raise DeepSeekAPIError(
                    f"Error extracting content from response: {str(e)}",
                    response=response_data
                )
                
        except ValueError as e:
            # Input validation errors
            error_msg = f"Invalid input: {str(e)}"
            logger.error(error_msg)
            return f"Error: {error_msg}"
            
        except DeepSeekAPIError as e:
            # API-related errors
            error_msg = f"DeepSeek API error: {e.message}"
            logger.error(error_msg)
            return f"Error occurred while processing your request. Please try again later."
            
        except Exception as e:
            # Unexpected errors
            error_msg = f"Unexpected error: {str(e)}"
            logger.error(error_msg)
            return f"An unexpected error occurred. Please try again later."
        
        finally:
            # Restore original cache setting
            response_cache.enabled = original_cache_enabled
            
    def chat(
        self, 
        messages: List[Dict[str, str]], 
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        model: Optional[str] = None,
        timeout: Optional[int] = None,
        use_cache: bool = True
    ) -> str:
        """Advanced chat method with support for conversation history.
        
        Args:
            messages: List of message objects with 'role' and 'content' keys.
            temperature: Sampling temperature (0.0 to 1.0).
            max_tokens: Maximum tokens in the response.
            model: DeepSeek model to use.
            timeout: Request timeout in seconds.
            use_cache: Whether to use the response cache.
            
        Returns:
            Model's text response.
            
        Raises:
            DeepSeekAPIError: If the API request fails.
        """
        # Disable cache if requested
        original_cache_enabled = response_cache.enabled
        if not use_cache:
            response_cache.enabled = False
            
        try:
            model = model or self.default_model
            logger.info(f"Sending chat request to DeepSeek API (model: {model})")
            
            # Validate messages
            if not messages or not isinstance(messages, list):
                raise ValueError("Messages must be a non-empty list")
                
            for msg in messages:
                if not isinstance(msg, dict) or "role" not in msg or "content" not in msg:
                    raise ValueError("Each message must be a dict with 'role' and 'content' keys")
                
                if msg["role"] not in ["system", "user", "assistant"]:
                    raise ValueError(f"Invalid role: {msg['role']}. Must be 'system', 'user', or 'assistant'")
            
            # Prepare payload
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature
            }
            
            # Add optional parameters
            if max_tokens is not None:
                payload["max_tokens"] = max_tokens
            
            # Make the API request
            response_data = self._make_request_with_retry(
                url=self.chat_endpoint,
                data=payload,
                timeout=timeout
            )
            
            # Check if this was a cached response
            if response_data.get("cached", False):
                return response_data["choices"][0]["message"]["content"]
            
            # Validate and extract content from response
            if not response_data.get("choices"):
                raise DeepSeekAPIError(
                    "Invalid API response format, 'choices' field missing",
                    response=response_data
                )
                
            try:
                content = response_data["choices"][0]["message"]["content"]
                logger.info("Successfully received response from DeepSeek API")
                return content
            except (KeyError, IndexError) as e:
                raise DeepSeekAPIError(
                    f"Error extracting content from response: {str(e)}",
                    response=response_data
                )
                
        except ValueError as e:
            # Input validation errors
            error_msg = f"Invalid input: {str(e)}"
            logger.error(error_msg)
            return f"Error: {error_msg}"
            
        except DeepSeekAPIError as e:
            # API-related errors
            error_msg = f"DeepSeek API error: {e.message}"
            logger.error(error_msg)
            return f"Error occurred while processing your request. Please try again later."
            
        except Exception as e:
            # Unexpected errors
            error_msg = f"Unexpected error: {str(e)}"
            logger.error(error_msg)
            return f"An unexpected error occurred. Please try again later."
            
        finally:
            # Restore original cache setting
            response_cache.enabled = original_cache_enabled