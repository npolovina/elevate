# backend/cache.py
import hashlib
import json
import time
from typing import Dict, Any, Optional, Union
import logging

logger = logging.getLogger("cache")

class ResponseCache:
    """Simple in-memory cache for API responses to improve performance and reduce costs."""
    
    def __init__(self, ttl: int = 3600, max_size: int = 100, enabled: bool = True):
        """Initialize the response cache.
        
        Args:
            ttl: Time-to-live in seconds for cache entries.
            max_size: Maximum number of entries in the cache.
            enabled: Whether caching is enabled.
        """
        self.ttl = ttl
        self.max_size = max_size
        self.enabled = enabled
        self.cache: Dict[str, Dict[str, Any]] = {}
        
        logger.info(f"Initialized response cache (enabled={enabled}, ttl={ttl}s, max_size={max_size})")
    
    def _generate_key(self, data: Dict[str, Any]) -> str:
        """Generate a cache key from request data.
        
        Args:
            data: Request data to generate key from.
            
        Returns:
            String key for the cache.
        """
        # Sort the dictionary to ensure consistent keys
        serialized = json.dumps(data, sort_keys=True)
        return hashlib.md5(serialized.encode()).hexdigest()
    
    def get(self, request_data: Dict[str, Any]) -> Optional[str]:
        """Get a response from the cache.
        
        Args:
            request_data: The request data to look up.
            
        Returns:
            Cached response or None if not found or expired.
        """
        if not self.enabled:
            return None
            
        key = self._generate_key(request_data)
        
        if key in self.cache:
            entry = self.cache[key]
            current_time = time.time()
            
            # Check if entry is expired
            if current_time - entry["timestamp"] <= self.ttl:
                logger.debug(f"Cache hit for key: {key[:8]}...")
                return entry["response"]
            else:
                # Remove expired entry
                logger.debug(f"Cache entry expired for key: {key[:8]}...")
                del self.cache[key]
                
        return None
    
    def set(self, request_data: Dict[str, Any], response: str) -> None:
        """Store a response in the cache.
        
        Args:
            request_data: The request data to use as the key.
            response: The response to cache.
        """
        if not self.enabled:
            return
            
        key = self._generate_key(request_data)
        
        # If cache is full, remove oldest entry
        if len(self.cache) >= self.max_size:
            oldest_key = min(self.cache.keys(), key=lambda k: self.cache[k]["timestamp"])
            del self.cache[oldest_key]
            logger.debug(f"Cache full, removed oldest entry: {oldest_key[:8]}...")
        
        self.cache[key] = {
            "response": response,
            "timestamp": time.time()
        }
        
        logger.debug(f"Added response to cache with key: {key[:8]}...")
    
    def clear(self) -> None:
        """Clear all entries from the cache."""
        self.cache.clear()
        logger.info("Cache cleared")
    
    def get_stats(self) -> Dict[str, Union[int, float]]:
        """Get cache statistics.
        
        Returns:
            Dictionary with cache statistics.
        """
        current_time = time.time()
        active_entries = sum(1 for entry in self.cache.values() 
                             if current_time - entry["timestamp"] <= self.ttl)
        
        return {
            "total_entries": len(self.cache),
            "active_entries": active_entries,
            "expired_entries": len(self.cache) - active_entries,
            "max_size": self.max_size,
            "ttl": self.ttl,
            "enabled": self.enabled
        }


# Create a global cache instance
from config import settings

# Initialize cache with settings
response_cache = ResponseCache(
    ttl=settings.AI_RESPONSE_CACHE_TTL if settings else 3600,
    enabled=settings.AI_RESPONSE_CACHE_ENABLED if settings else False
)