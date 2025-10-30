import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      text: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider ?",
      isUser: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { text: inputMessage, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const aiMessage = { text: data.text, isUser: false };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Erreur du serveur');
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = { 
        // 🟢 MODIFIÉ : Message d'erreur adapté
        text: "Désolé, une erreur s'est produite avec Perplexity AI.", 
        isUser: false 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        {/* 🟢 MODIFIÉ : Titre adapté */}
        <h2>💬 Chat avec Perplexity AI</h2>
        <div className="api-info">
          {/* 🟢 MODIFIÉ : Information sur l'API */}
          <small>Utilise l'API Perplexity AI</small>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-avatar">
              {message.isUser ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message ici..."
            rows="1"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles intégrés pour une simplicité maximale
const styles = `
.chat-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
}

.chat-header h2 {
  margin: 0 0 5px 0;
  font-size: 1.4em;
}

.api-info small {
  opacity: 0.8;
  font-size: 0.8em;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

.message {
  display: flex;
  margin-bottom: 15px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.user-message {
  justify-content: flex-end;
}

.user-message .message-content {
  background: #667eea;
  color: white;
  border-radius: 18px 18px 5px 18px;
}

.ai-message .message-content {
  background: white;
  color: #333;
  border-radius: 18px 18px 18px 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.message-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  font-size: 1.2em;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  line-height: 1.4;
  word-wrap: break-word;
}

.loading {
  display: flex;
  align-items: center;
  min-height: 20px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-10px); opacity: 1; }
}

.input-container {
  padding: 20px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.input-wrapper {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.input-wrapper textarea {
  flex: 1;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  padding: 12px 16px;
  font-size: 14px;
  resize: none;
  max-height: 100px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.input-wrapper textarea:focus {
  outline: none;
  border-color: #667eea;
}

.send-button {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  cursor: pointer;
  font-size: 1.2em;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover:not(:disabled) {
  background: #5a6fd8;
  transform: scale(1.05);
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 600px) {
  .chat-container {
    height: 100vh;
    border-radius: 0;
  }
  
  .message-content {
    max-width: 85%;
  }
}
`;

// Injection des styles
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ChatInterface;