require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const readline = require('readline');

// Initialize the Gemini model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// System prompt template
const systemPrompt = 'You are a helpful assistant with a friendly tone. Provide concise and accurate answers.';

// Initialize chat session
const chat = model.startChat({
  history: [],
});

// Set up readline for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to create a conversational chain with streaming
async function conversationalChain({ input, history }) {
  try {
    // Format the prompt with history and new input
    const historyText = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const fullPrompt = `${systemPrompt}\n\n${historyText}\n\nUser: ${input}`;

    // Stream the response
    const streamResult = await chat.sendMessageStream(fullPrompt);
    let fullResponse = '';

    // Check if streamResult is iterable
    if (streamResult.stream && Symbol.asyncIterator in streamResult.stream) {
      process.stdout.write('Bot: ');
      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        process.stdout.write(chunkText); // Print chunk without newline
        fullResponse += chunkText;
      }
      process.stdout.write('\n'); // Newline after streaming completes
    } else {
      // Fallback for non-iterable stream
      console.warn('Streaming not supported or stream is not iterable, falling back to non-streaming.');
      const result = await chat.sendMessage(fullPrompt);
      fullResponse = await result.response.text();
      process.stdout.write('Bot: ' + fullResponse + '\n');
    }

    // Update history
    history.push({ role: 'user', content: input });
    history.push({ role: 'assistant', content: fullResponse });

    return { response: fullResponse, history };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Interactive chat loop
async function startChat() {
  let history = [];
  console.log('Chatbot started! Type "exit" to quit.');

  const askQuestion = async () => {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        rl.close();
        return;
      }

      const { response, history: updatedHistory } = await conversationalChain({ input, history });
      history = updatedHistory;
      askQuestion();
    });
  };

  askQuestion();
}

startChat();