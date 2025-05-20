# CLI Chatbot

This is a Node.js-based chatbot application that uses Google's Generative AI (Gemini model) to provide conversational responses. The chatbot interacts with users via the command line and streams responses in real-time.

## Features

- Uses the Gemini 1.5 Flash model from Google's Generative AI.
- Streams responses for a real-time conversational experience.
- Maintains conversation history for context-aware responses.
- Interactive command-line interface.

## Prerequisites

- Node.js (v16 or higher)
- A valid Google API key with access to the Generative AI service.

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory:
   ```bash
   cd chatbot
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Create a .env file in the root directory and add the following environment variables:
   ```bash
   GOOGLE_API_KEY=your_google_api_key
   LANGSMITH_TRACING=true
   LANGSMITH_API_KEY=your_langsmith_api_key
   LANGSMITH_PROJECT=your_langsmith_project
   ```

## Usage

To start the chatbot, run the following command in your terminal:

```bash
node index.js
```

You will be prompted to enter your message. Type your message and press Enter to receive a response from the chatbot.
You can continue the conversation by typing additional messages. To exit the chatbot, type `exit` or `quit`.

## Example Conversation

```
User: Hello
Chatbot: Hi there! How can I assist you today?
User: What is the weather like today?
Chatbot: The weather today is sunny with a high of 75°F. Do you need any specific information about the weather?
User: No, that's all. Thank you!
Chatbot: You're welcome! If you have any other questions, feel free to ask. Have a great day!
```

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes. We welcome contributions of all kinds, including bug fixes, new features, and improvements to the documentation.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google Generative AI](https://cloud.google.com/generative-ai/docs)
- [Node.js](https://nodejs.org/)
- [Langsmith](https://www.langsmith.com/)
