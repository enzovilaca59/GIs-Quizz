import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { text: "Bonjour ! Je suis votre assistant IA. Demandez-moi un QCM sur un sujet en informatique !", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qcmMode, setQcmMode] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, qcmMode]);

  // Gestion du minuteur
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  const startTimer = () => {
    setTimer(0);
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    return timer;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPersonalizedResult = (score, totalQuestions, timeTaken) => {
    const percentage = (score / totalQuestions) * 100;
    const averageTimePerQuestion = timeTaken / totalQuestions;

    if (percentage >= 80 && averageTimePerQuestion <= 15) {
      return `🏆 Excellent ! Vous maîtrisez parfaitement le sujet avec ${score}/${totalQuestions} en seulement ${formatTime(timeTaken)}. Rapidité et précision au rendez-vous !`;
    } else if (percentage >= 80 && averageTimePerQuestion > 15) {
      return `📚 Très bon score de ${score}/${totalQuestions} en ${formatTime(timeTaken)} ! Vous avez pris le temps de réfléchir, et ça paie.`;
    } else if (percentage >= 60 && averageTimePerQuestion <= 10) {
      return `⚡ Rapide mais attention ! ${score}/${totalQuestions} en ${formatTime(timeTaken)}. Votre rapidité est impressionnante, mais relisez bien les questions.`;
    } else if (percentage >= 60 && averageTimePerQuestion > 10) {
      return `👍 Bon travail ! ${score}/${totalQuestions} en ${formatTime(timeTaken)}. Vous progressez bien, continuez comme ça !`;
    } else if (percentage < 60 && averageTimePerQuestion <= 10) {
      return `🚀 Trop vite ! ${score}/${totalQuestions} en ${formatTime(timeTaken)}. Vous êtes rapide mais faites des erreurs d'inattention. Prenez votre temps !`;
    } else if (percentage < 60 && averageTimePerQuestion > 10) {
      return `📖 Continuez à apprendre ! ${score}/${totalQuestions} en ${formatTime(timeTaken)}. Le sujet mérite plus de révision, mais vous avez pris le temps de réfléchir.`;
    } else {
      return `🎯 Score : ${score}/${totalQuestions} | Temps : ${formatTime(timeTaken)}. Chaque quiz est une occasion d'apprendre !`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { text: inputMessage, isUser: true };
    setMessages(prev => [...prev, userMessage]);

    const userInput = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    console.log(`📤 Envoi de la requête pour le sujet: "${userInput}"`);

    try {
      const response = await fetch('https://gis-quizz.onrender.com/api/qcm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ sujet: userInput })
      });

      console.log(`📥 Réponse reçue (status: ${response.status})`);

      const data = await response.json();

      if (response.ok && data.qcm) {
        setMessages(prev => [...prev, {
          text: `Voici votre QCM sur "${userInput}" ! ⏱️ Le chrono est lancé...`,
          isUser: false
        }]);
        setQcmMode({
          questions: data.qcm,
          current: 0,
          score: 0,
          userAnswer: null,
          done: false
        });
        startTimer(); // Démarre le minuteur
      } else if (data.error) {
        setMessages(prev => [...prev, {
          text: data.error,
          isUser: false
        }]);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error) {
      console.error('❌ Erreur frontend:', error);
      setMessages(prev => [...prev, {
        text: "Désolé, une erreur s'est produite. Assurez-vous de demander un QCM sur un sujet en informatique.",
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQcmAnswer = (option) => {
    if (qcmMode.userAnswer) return;

    const isCorrect = option === qcmMode.questions[qcmMode.current].answer;

    setQcmMode(prev => ({
      ...prev,
      userAnswer: option,
      score: isCorrect ? prev.score + 1 : prev.score
    }));

    setTimeout(() => {
      if (qcmMode.current < qcmMode.questions.length - 1) {
        setQcmMode(prev => ({
          ...prev,
          current: prev.current + 1,
          userAnswer: null
        }));
      } else {
        const finalScore = isCorrect ? qcmMode.score + 1 : qcmMode.score;
        const timeTaken = stopTimer(); // Arrête le minuteur et récupère le temps

        const resultMessage = getPersonalizedResult(
          finalScore,
          qcmMode.questions.length,
          timeTaken
        );

        setMessages(prev => [...prev, {
          text: resultMessage,
          isUser: false
        }]);
        setQcmMode(null);
      }
    }, 1200);
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
        <h2>💬 Assistant QCM IA</h2>
        <div className="api-info">
          <small>Demandez un QCM sur n'importe quel sujet en informatique</small>
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

        {qcmMode && !qcmMode.done && (
          <div className="qcm-question-container">
            <div className="qcm-header">
              <div>Question {qcmMode.current + 1}/{qcmMode.questions.length}</div>
              <div className="timer">⏱️ {formatTime(timer)}</div>
            </div>
            <h3 className="qcm-question">{qcmMode.questions[qcmMode.current].question}</h3>
            <div className="qcm-options">
              {qcmMode.questions[qcmMode.current].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQcmAnswer(option)}
                  disabled={!!qcmMode.userAnswer}
                  className={`qcm-option ${
                    qcmMode.userAnswer === option
                      ? option === qcmMode.questions[qcmMode.current].answer
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {qcmMode.userAnswer && (
              <div className={`feedback ${qcmMode.userAnswer === qcmMode.questions[qcmMode.current].answer ? 'correct' : 'incorrect'}`}>
                {qcmMode.userAnswer === qcmMode.questions[qcmMode.current].answer
                  ? `✅ Bonne réponse ! ${qcmMode.questions[qcmMode.current].explanation || ''}`
                  : `❌ Mauvaise réponse. La bonne réponse était : ${qcmMode.questions[qcmMode.current].answer}. ${qcmMode.questions[qcmMode.current].explanation || ''}`
                }
              </div>
            )}
          </div>
        )}

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
            placeholder="Demandez un QCM (ex: QCM sur Python, JavaScript, Réseaux...)"
            rows="1"
            disabled={isLoading || qcmMode}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || qcmMode}
            className="send-button"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = `
.chat-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 1);
  overflow: hidden;
  height: 800px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background-color: #3181C7;
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
  background-image: url('https://i.postimg.cc/DwJYsqFc/version-finale-V2-askip.png');
  background-size: cover;
  background-position: center;
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
  background: #3181C7;
  color: white;
  border-radius: 18px 18px 5px 18px;
}

.ai-message .message-content {
  background: white;
  color: #000000ff;
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

.qcm-question-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin: 10px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in;
}

.qcm-header {
  color: #667eea;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 0.9em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timer {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  color: #666;
}

.qcm-question {
  color: #333;
  font-size: 1.1em;
  margin-bottom: 16px;
}

.qcm-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.qcm-option {
  background: #f0f0f0;
  border: 2px solid transparent;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1em;
  text-align: left;
}

.qcm-option:hover:not(:disabled) {
  background: #e0e0e0;
  transform: translateX(4px);
}

.qcm-option:disabled {
  cursor: not-allowed;
}

.qcm-option.correct {
  background: #67e883;
  border-color: #4caf50;
  color: white;
}

.qcm-option.incorrect {
  background: #eb5e65;
  border-color: #f44336;
  color: white;
}

.feedback {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
}

.feedback.correct {
  background: #e8f5e9;
  color: #2e7d32;
}

.feedback.incorrect {
  background: #ffebee;
  color: #c62828;
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
  background: #667eea;
  border-top: 1px solid #3181C7;
}

.input-wrapper {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.input-wrapper textarea {
  flex: 1;
  border: 2px solid #F9C74F;
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

.input-wrapper textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.send-button {
  background: #F9C74F;
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
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 600px) {
  .chat-container {
    height: 100vh;
    border-radius: 0;
  }

  .message-content {
    max-width: 85%;
  }

  .qcm-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
`;

const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ChatInterface;
