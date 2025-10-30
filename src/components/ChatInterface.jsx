import React, { useState } from "react";

export default function ChatInterface() {
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);

  // Récupération dynamique du QCM
  const fetchQCM = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/qcm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sujet: subject })
      });
      const data = await response.json();

      // le backend retourne { qcm: [...] }
      setQuestions(data.qcm);
      setCurrent(0);
      setScore(0);
      setDone(false);
    } catch (err) {
      alert("Erreur lors de la récupération du QCM : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Interaction QCM
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
    }, 900);
  };

  // Remise à zéro
  const resetAll = () => {
    setQuestions([]);
    setSubject("");
    setScore(0);
    setDone(false);
    setCurrent(0);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>🧠 QCM IA interactif</h2>
      </div>

      <div className="messages-container">
        {!questions.length ? (
          <>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Sujet du QCM (ex : Python, réseau, React…)"
              style={{ fontSize: 18, padding: 8, borderRadius: 8, marginRight: 8 }}
            />
            <button onClick={fetchQCM} disabled={!subject || loading} className="send-button">
              {loading ? "Chargement…" : "Générer le QCM"}
            </button>
          </>
        ) : !done ? (
          <div>
            <h3>{questions[current].question}</h3>
            {questions[current].options.map(option => (
              <button
                key={option}
                onClick={() => !userAnswer && handleAnswer(option)}
                className="send-button qcm-button"
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
              <div style={{ marginTop: 12 }}>
                {userAnswer === questions[current].answer
                  ? "✅ Bonne réponse !"
                  : <>❌ Mauvaise réponse. <br />La bonne réponse était : <b>{questions[current].answer}</b></>
                }
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2>Quiz terminé !</h2>
            <p>Score : <strong>{score}</strong> / {questions.length}</p>
            <button onClick={resetAll} className="send-button" style={{ marginTop: 16 }}>Recommencer</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Ton CSS intégré (modulaire si besoin)
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
.send-button {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 12px;
  min-width: 45px;
  cursor: pointer;
  font-size: 1em;
  margin-left: 4px;
  transition: all 0.3s;
}
.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
@media (max-width: 600px) {
  .chat-container {
    height: 100vh;
    border-radius: 0;
  }
  .messages-container { padding: 8px; }
}
`;
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
