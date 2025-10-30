import express from 'express';
const router = express.Router();

// Utilise la même clé API Perplexity que ton backend existant
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || "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";

router.post('/qcm', async (req, res) => {
  const sujet = req.body.sujet || "informatique";
  
  try {
    // Appel à l'API Perplexity pour générer le QCM
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant qui génère des QCM en informatique. Tu dois UNIQUEMENT répondre avec un tableau JSON valide, sans texte supplémentaire.'
          },
          {
            role: 'user',
            content: `Génère un QCM de 5 questions sur le sujet "${sujet}". 
Format JSON strict :
[
  {
    "question": "...",
    "options": ["option1", "option2", "option3", "option4"],
    "answer": "la bonne réponse exacte"
  }
]
Retourne UNIQUEMENT le tableau JSON, rien d'autre.`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    // Parse la réponse de Perplexity
    let qcmText = data.choices[0].message.content.trim();
    
    // Nettoie le texte pour extraire le JSON
    qcmText = qcmText.replace(/``````/g, '').trim();
    
    // Parse le JSON
    const qcm = JSON.parse(qcmText);
    
    res.json({ qcm });
    
  } catch (error) {
    console.error('Erreur génération QCM Perplexity:', error);
    
    // Fallback en cas d'erreur
    const qcmFallback = [
      {
        question: `Question de base sur ${sujet}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: "Option B"
      },
      {
        question: `Autre question sur ${sujet}`,
        options: ["Choix 1", "Choix 2", "Choix 3", "Choix 4"],
        answer: "Choix 1"
      }
    ];
    
    res.json({ qcm: qcmFallback });
  }
});

export default router;
