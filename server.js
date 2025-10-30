import express from 'express';
import cors from 'cors';
// :red_circle: SUPPRIMÉ : import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

import qcmRouter from './routes/qcm.js'; // EXTENSION .js 
app.use('/api', qcmRouter);


const PERPLEXITY_API_KEY = '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'; // À remplacer par votre clé Perplexity
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // :green_circle: NOUVEAU : Appel à l'API Perplexity
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
          { "role": "user", "content": "Génère un QCM sur le thème des bases de données en informatique, niveau intermédiaire. Le QCM doit comporter 5 questions et 4 propositions par question, dont une correcte." }
       ],
      "max_tokens": 500
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API Perplexity: ${response.status}`);
    }

    const data = await response.json();
    
    // :green_circle: NOUVEAU : Structure de réponse différente pour Perplexity
    res.json({ text: data.choices[0].message.content });
    
  } catch (error) {
    console.error('Erreur Perplexity AI:', error);
    // :green_circle: MODIFIÉ : Message d'erreur adapté
    res.status(500).json({ error: 'Erreur avec Perplexity AI: ' + error.message });
  }
});

app.listen(3001, () => {
  console.log(':white_check_mark: Serveur backend démarré sur http://localhost:3001');
});