import requests

class DeepSeek:
    def __init__(self, api_key):
        """Initialize chatbot with DeepSeek API."""
        print("Setting up DEEPSEEK...")
        self.api_key = api_key
        self.deepseek_client = "https://api.deepseek.com/v1/chat/completions"  # Replace with actual DeepSeek API URL

    def get_response(self, user_input):
        """Send user input to DeepSeek API and get response."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "deepseek-chat",  # Replace with the appropriate model
            "messages": [{"role": "system", "content": "You are a helpful career coach."},
                         {"role": "user", "content": user_input}],
            "temperature": 0.7
        }

        response = requests.post(self.deepseek_client, json=payload, headers=headers)

        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        else:
            return f"Error: {response.status_code} - {response.text}"

# Example Usage
api_key = "sk-81fa49ab45e34833a68cc37fc627a53e"
chatbot = Talk2Me(api_key)
