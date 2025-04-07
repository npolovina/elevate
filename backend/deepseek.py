import requests
import os

class DeepSeek:
    def __init__(self, api_key):
        """Initialize chatbot with DeepSeek API."""
        print("Setting up DEEPSEEK...")
        self.api_key = "sk-c03808cf0b4544d7ae15e4bed8d5fddc"
        self.deepseek_client = "https://api.deepseek.com/v1/chat/completions"  # Replace with actual DeepSeek API URL

    def get_response(self, user_input):
        """Send user input to DeepSeek API and get response."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "deepseek-chat",  # Replace with the appropriate model
            "messages": [
                {"role": "system", "content": "You are a helpful career coach."},
                {"role": "user", "content": user_input}
            ],
            "temperature": 0.7
        }

        try:
            response = requests.post(self.deepseek_client, json=payload, headers=headers)
            response.raise_for_status()  # Raise an exception for HTTP errors
            
            return response.json()["choices"][0]["message"]["content"]
        except requests.RequestException as e:
            return f"Error occurred: {e}"
        except (KeyError, IndexError) as e:
            return f"Error parsing response: {e}"

# def main():
#     # It's recommended to use environment variables for API keys
#     api_key = os.getenv('DEEPSEEK_API_KEY')
    
#     if not api_key:
#         print("Please set the DEEPSEEK_API_KEY environment variable.")
#         return

#     deepseek_client = DeepSeekClient(api_key)
    
#     # # Example usage
#     # response = deepseek_client.get_response("How do I switch careers into UX design?")
#     # print(response)

# if __name__ == "__main__":
#     main()