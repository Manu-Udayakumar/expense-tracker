import React, { useState, useEffect, useRef } from "react";
import { Send, DollarSign, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { sender: "bot", text: "Welcome to Chat Assistant!" },
    { sender: "bot", text: "I can help you track expenses, transactions and revenue. Try saying things like:" },
    { sender: "bot", text: "paid a $400 of electricity bill through credit card" },
    { sender: "bot", text: "Purchased a $40 of groceries with cash" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Function to detect finance-related queries
  const checkForFinanceKeywords = (text: string) => {
    const financeKeywords = [ "expense", "revenue", "rent", "profit", "balance", "category", "report",
      "net worth", "salaries", "payment methods", "users", "transactions",
      "bill", "purchase", "spending", "paid", "received", "groceries",
      "cash", "card", "credit", "debit", "bought", "spent", "invested", 
      "salary", "loan", "mortgage", "insurance", "fees", "interest",
      "business expense", "equipment", "technology", "gadgets", "electronics", "laptop", "computer"];
    const sqlActionKeywords = [   "show", "list", "calculate", "fetch", "get", "display", "record",
      "add", "update", "remove", "delete", "track", "summarize", "analyze",
      "generate", "predict", "filter", "compare", "view", "withdraw",
      "deposit", "paid", "transfer", "received", "purchased", "log", "spent", "bought"];

    const lowerText = text.toLowerCase();
    if (lowerText.includes("what is") || lowerText.includes("mean by")) {
      return false;
    }

    return (
      financeKeywords.some((keyword) => lowerText.includes(keyword)) &&
      sqlActionKeywords.some((action) => lowerText.includes(action))
    );
  };

  // Function to handle message sending
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);
    setError(null);

    try {
      const isFinanceQuery = checkForFinanceKeywords(message);
      const apiUrl = isFinanceQuery ? "http://localhost:5000/api/nlp-to-sql" : "http://localhost:5000/api/chatbot";

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const requestBody = { prompt: message.trim() };
      console.log("Request Payload:", requestBody);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal, // Pass the AbortSignal to the fetch request
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorResponse = await response.json();
        console.log("Error Response:", errorResponse);
        throw new Error(`Request failed: ${errorResponse.error || "Unknown error"}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      let botReply = ""; // Store the bot's reply

      if (isFinanceQuery) {
        if (data.success) {
          botReply = "✅ Successful operation";
        } else {
          botReply = "❌ Unsuccessful operation";
        }
      } else {
        if (data.success && typeof data.message === "string") {
          botReply = data.message;
        } else {
          throw new Error("Invalid response format from server");
        }
      }

      setChat((prev) => [...prev, { sender: "bot", text: botReply }]); // Add bot reply to chat
    } catch (err) {
      let errorMessage = "Sorry, something went wrong. Please try again.";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "⏳ Request timed out. Please try again.";
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      setError(errorMessage);
       setChat((prev) => [...prev, { sender: "bot", text: errorMessage }]); // Add error to the chat.
    } finally {
      setIsTyping(false);
    }
  };

  // Function to handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
          aria-label="Open Finance Assistant"
        >
          <DollarSign className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-lg flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Finance Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-200 transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {chat.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-white shadow-sm text-gray-800 max-w-[80%] flex items-center space-x-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about finances or chat..."
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <button onClick={handleSendMessage} disabled={isTyping} className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
                <Send className="w-5 h-5" />
              </button>
            </div>
            {/* {error && <p className="text-red-500 text-sm mt-2">{error}</p>} */}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;