import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Chatbot({ isDietMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      text: isDietMode
        ? "Hi! I'm your healthy eating assistant. What kind of nutritious meal are you looking for today?"
        : "Hey there! 👋 I'm here to help you find delicious food. What are you craving?",
      isBot: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue("");
    setIsLoading(true);

    // Add user message to UI
    const newMessages = [
      ...messages,
      { id: Date.now().toString(), role: "user", text: userText, isBot: false },
    ];
    setMessages(newMessages);

    try {
    
      const historyForApi = newMessages
        .slice(0, -1) // Exclude the just-added user message
        .map((msg) => ({
          role: msg.role || (msg.isBot ? "assistant" : "user"),
          content: msg.text,
        }));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: historyForApi,
          isDietMode,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: data.reply,
            isBot: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "Sorry, I'm having trouble connecting to my brain right now. 🧠❄️",
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-5 w-14 h-14 rounded-full shadow-2xl text-white flex items-center justify-center z-40"
        style={{
          backgroundColor: isDietMode
            ? "var(--food-green)"
            : "var(--food-red)",
        }}
      >
        <MessageCircle className="w-6 h-6" />
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sparkles className="w-4 h-4" style={{ color: "var(--food-yellow)" }} />
        </motion.div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 left-5 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div
              className="px-4 py-3 text-white flex items-center justify-between"
              style={{
                backgroundColor: isDietMode
                  ? "var(--food-green)"
                  : "var(--food-red)",
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-[600]">AI Food Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"
                    }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${message.isBot ? "bg-gray-100 text-gray-800" : "text-white"
                      }`}
                    style={{
                      backgroundColor: message.isBot
                        ? "#f3f4f6"
                        : isDietMode
                          ? "var(--food-green)"
                          : "var(--food-red)",
                    }}
                  >
                    <p className="text-[13px] whitespace-pre-line">
                      {message.text}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                    <span className="text-xs text-gray-500 animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border rounded-full outline-none focus:border-gray-400 text-[14px]"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className={`w-10 h-10 rounded-full text-white flex items-center justify-center ${isLoading ? 'opacity-50' : ''}`}
                  style={{
                    backgroundColor: isDietMode
                      ? "var(--food-green)"
                      : "var(--food-red)",
                  }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

