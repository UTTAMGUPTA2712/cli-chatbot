require("dotenv").config();
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { ChatMessageHistory } = require("langchain/memory");
const { RunnableWithMessageHistory } = require("@langchain/core/runnables");
const readline = require("readline");

// Initialize the model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
});

// Create a prompt template
const prompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "You are a helpful assistant with a dark, sarcastic and humorous reply. Provide concise and accurate answers in Hinglish."
  ),
  ["placeholder", "{history}"],
  ["human", "{input}"],
]);

// Initialize in-memory history storeChatMessageHistory
const historyStore = new Map();

// Create a chain
const chain = prompt.pipe(model).pipe(new StringOutputParser());

// Create a chain with message history
const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: async (sessionId) => {
    if (!historyStore.has(sessionId)) {
      historyStore.set(sessionId, new ChatMessageHistory());
    }
    return historyStore.get(sessionId);
  },
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

// Set up readline for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to chat with streaming
async function chatWithBot(input) {
  try {
    process.stdout.write("Bot: ");
    let fullResponse = "";
    const stream = await chainWithHistory.stream(
      { input },
      { configurable: { sessionId: "default" } }
    );
    for await (const chunk of stream) {
      process.stdout.write(chunk);
      fullResponse += chunk;
    }
    process.stdout.write("\n");
    return fullResponse;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Interactive chat loop
async function startChat() {
  console.log('Chatbot started! Type "exit" to quit.');
  const askQuestion = async () => {
    rl.question("You: ", async (input) => {
      if (input.toLowerCase() === "exit") {
        console.log("Goodbye!");
        rl.close();
        return;
      }
      await chatWithBot(input);
      askQuestion();
    });
  };
  askQuestion();
}

startChat();
