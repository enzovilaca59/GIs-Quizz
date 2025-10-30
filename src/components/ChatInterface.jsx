import React, { useState, useRef, useEffect } from 'react';

// Exemple de récupération QCM (doit être remplacé par parsing IA réel)
const qcmExemple = [
  {
    question: "Quel est le rôle principal du CPU ?",
    options: [
      "Stocker les données",
      "Effectuer des calculs",
      "Afficher des images",
      "Connecter au réseau"
    ],
    answer: "Effectuer des calculs"
  },
  {
    question: "Quelle technologie permet de styliser une page web ?",
    options: [
      "Python",
      "CSS",
      "SQL",
      "React"
    ],
    answer: "CSS"
  }
  // Ajoute ici les autres questions dynamiques du QCM généré par l’IA
];

const ChatInterface = () => {
  // Mode QCM interactif : tu peux remplacer qcmExemple par la donnée IA parsée (format tableau JSON)
  const [questions, setQuestions] = useState(qcmExemple); // Remplacer si besoin
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);

  // Scroll vers le bas auto pour les messages (optionnel)
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [current, done]);

  // Répondre à une question
  const handleAnswer = (option) => {
    setUserAnswer(option);
    setTimeout(() => {
      if (option === questions[current].answer) setScore(s => s + 1);
      setUserAnswer(null);
      if (current < questions.length - 1) {
        setCurrent(i => i + 1);
      } else {
        setDone(true);
      }
    }, 900); // délai visual feedback
  };

  // Affichage principal
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>🧠 QCM IA interactif</h2>
        <div className="api-info">
          <small>Questions générées par Perplexity AI ou exemple</small>
        </div>
      </div>

      <div className="messages-container">
        {!done ? (
          <div>
            <h3>{questions[current].question}</h3>
            {questions[current].options.map(option => (
              <button
                key={option}
                onClick={() => !userAnswer && handleAnswer(option)}
                className={`send-button qcm-button`}
                style={{ 
                  display: "block", 
                  margin: "8px 0",
                  background: userAnswer === option 
                    ? (option === questions[current].answer ? "#67e883" : "#eb5e65")
                    : undefined
                }}
                disabled={!!userAnswer}
              >
                {option}
              </button>
            ))}
            {userAnswer && (
              <div style={{marginTop: 12}}>
                {userAnswer === questions[current].answer 
                  ? "✅ Bonne réponse !" 
                  : <>❌ Mauvaise réponse. <br/>La bonne réponse était : <b>{questions[current].answer}</b></>
                }
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2>Quiz terminé !</h2>
            <p>Score : <strong>{score}</strong> / {questions.length}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

// === Styles intégrés (identiques à la base, ne pas toucher si ton amie gère le CSS)
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
.qcm-button {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  font-size: 1em;
  width: 100%;
  cursor: pointer;
  margin: 5px 0;
  transition: background 0.3s;
}
.qcm-button:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}
.qcm-button:hover:not(:disabled) {
  background: #5a6fd8;
}
@media (max-width: 600px) {
  .chat-container {
    height: 100vh;
    border-radius: 0;
  }
}
`;

const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ChatInterface;
