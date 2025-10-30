import express from 'express';
import cors from 'cors';
import { marked } from 'marked'; // Ajoute cette ligne

const app = express();

app.use(cors());
app.use(express.json());

const PERPLEXITY_API_KEY = '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';
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        "model": "sonar",
        "messages": [
          { "role": "system", "content": "Tu es un assistant pédagogique expert en informatique." },
          { "role": "user", "content": `Génère un QCM sur le thème : ${message}. Le QCM doit comporter 5 questions et 4 propositions par question. À chaque question attends la réponse de l'utilisateur et resume en ligne la notion abordé.` }
        ],
        "max_tokens": 500
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API Perplexity: ${response.status}`);
    }

    const data = await response.json();

    // Conversion du markdown vers HTML avant l'envoi au client
    const markdownResponse = data.choices[0].message.content;
    const htmlResponse = marked.parse(markdownResponse);

    res.json({ text: htmlResponse });
  } catch (error) {
    console.error('Erreur Perplexity AI:', error);
    res.status(500).json({ error: 'Erreur avec Perplexity AI: ' + error.message });
  }
});

app.listen(3001, () => {
  console.log(':white_check_mark: Serveur backend démarré sur http://localhost:3001');
});
