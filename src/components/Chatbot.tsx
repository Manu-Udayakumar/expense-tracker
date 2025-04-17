// component/Chatbot.tsx
import React, { useState, useEffect, useRef } from "react";
import { Send, DollarSign, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext"; // Import useAuth

const Chatbot = () => {
  const { isAuthenticated, logout } = useAuth(); // Access auth state and logout
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { sender: "bot", text: "Welcome to Chat Assistant!" },
    { sender: "bot", text: "I can help you track expenses, transactions and revenue. Try saying things like:" },
    { sender: "bot", text: "paid a $400 of electricity bill through credit card" },
    { sender: "bot", text: "Purchased a $40 of groceries with cash" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  // Removed unused error state
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Retrieve token from storage
  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const checkForFinanceKeywords = (text: string) => {
    const financeKeywords = [
      "expense", "revenue", "rent", "profit", "balance", "category", "report",
      "net worth", "salaries", "payment methods", "users", "transactions",
      "bill", "purchase", "spending", "paid", "received", "groceries",
      "cash", "card", "credit", "debit", "bought", "spent", "invested",
      "salary", "loan", "mortgage", "insurance", "fees", "interest",
      "business expense", "equipment", "technology", "gadgets", "electronics", "laptop", "computer"
    ];
    const sqlActionKeywords = [
      "show", "list", "calculate", "fetch", "get", "display", "record",
      "add", "update", "remove", "delete", "track", "summarize", "analyze",
      "generate", "predict", "filter", "compare", "view", "withdraw",
      "deposit", "paid", "transfer", "received", "purchased", "log", "spent", "bought"
    ];

    const lowerText = text.toLowerCase();
    if (lowerText.includes("what is") || lowerText.includes("mean by")) {
      return false;
    }

    return (
      financeKeywords.some((keyword) => lowerText.includes(keyword)) &&
      sqlActionKeywords.some((action) => lowerText.includes(action))
    );
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (!isAuthenticated) {
      setChat((prev) => [...prev, { sender: "bot", text: "Please log in to use this feature." }]);
      return;
    }

    const userMessage = { sender: "user", text: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);
    // Removed unused error state reset

    try {
      const isFinanceQuery = checkForFinanceKeywords(message);
      const apiUrl = isFinanceQuery
        ? "http://localhost:5000/api/nlp-to-sql"
        : "http://localhost:5000/api/chatbot";

      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const requestBody = { prompt: message.trim() };
      console.log("Request Payload:", requestBody);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Add the token here
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorResponse = await response.json();
        if (response.status === 403 || response.status === 401) {
          logout(); // Log out if token is invalid or expired
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(`Request failed: ${errorResponse.error || "Unknown error"}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      let botReply = "";
      if (isFinanceQuery) {
        botReply = data.success ? "✅ Successful operation" : "❌ Unsuccessful operation";
      } else {
        if (data.success && typeof data.message === "string") {
          botReply = data.message;
        } else {
          throw new Error("Invalid response format from server");
        }
      }

      setChat((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      let errorMessage = "Sorry, something went wrong. Please try again.";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "⏳ Request timed out. Please try again.";
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      // Removed unused error state update
      setChat((prev) => [...prev, { sender: "bot", text: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
              <button
                onClick={handleSendMessage}
                disabled={isTyping}
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;