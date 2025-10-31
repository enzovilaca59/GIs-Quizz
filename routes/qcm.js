import express from 'express';
const router = express.Router();

// Ta clé API Perplexity
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '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';
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// 🔥 VARIABLE : Change le nombre de questions ici
const NOMBRE_QUESTIONS = 10;

router.post('/qcm', async (req, res) => {
  const sujet = req.body.sujet || "informatique";

  try {
    // Appel à l'API Perplexity
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant spécialisé dans la génération de QCM exclusivement en informatique. Tu dois vérifier que le sujet concerne l'informatique avant de générer des questions. IMPORTANT : Ta réponse doit être UNIQUEMENT un objet JSON valide, sans texte additionnel, sans balises markdown, sans commentaires."
          },
          {
            role: "user",
            content: `Analyse le sujet suivant : "${sujet}"

      ÉTAPE 1 - VALIDATION : Ce sujet concerne-t-il l'informatique (programmation, réseaux, bases de données, sécurité, systèmes d'exploitation, développement web, algorithmes, hardware, etc.) ?

      SI OUI : Génère exactement ${NOMBRE_QUESTIONS} questions au format JSON strict suivant :
      {
        "success": true,
        "questions": [
          {
            "question": "Texte de la question",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "La réponse correcte (identique à l'une des options)",
            "explanation": "Explication concise en 1-2 phrases"
          }
        ]
      }

      SI NON (sujet hors informatique) : Réponds uniquement avec ce JSON :
      {
        "success": false,
        "error": "Sujet hors informatique",
        "message": "Désolé, le sujet '${sujet}' ne concerne pas l'informatique. Je ne peux générer que des QCM portant sur la programmation, les réseaux, les bases de données, la sécurité informatique, ou d'autres domaines liés à l'informatique. Veuillez proposer un sujet informatique."
      }

      RAPPEL CRUCIAL : Réponds UNIQUEMENT avec du JSON valide dans l'un des deux formats ci-dessus, rien d'autre.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API Perplexity: ${response.status}`);
    }

    const data = await response.json();
    let qcmText = data.choices[0].message.content.trim();

    // Nettoie le texte pour extraire le JSON
    qcmText = qcmText.replace(/``````/g, '').trim();

    // Parse le JSON
    const qcm = JSON.parse(qcmText);

    // Vérifie que c'est bien un tableau
    if (!Array.isArray(qcm)) {
      throw new Error('Format de réponse invalide');
    }

    res.json({ qcm });

  } catch (error) {
    console.error('❌ Erreur génération QCM:', error);

    // Fallback en cas d'erreur
    const qcmFallback = [
      {
        question: `Question de base sur ${sujet}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: "Option B",
        explanation: "Ceci est une question de test de secours."
      },
      {
        question: `Autre question sur ${sujet}`,
        options: ["Choix 1", "Choix 2", "Choix 3", "Choix 4"],
        answer: "Choix 1",
        explanation: "Ceci est une explication de test."
      }
    ];

    res.json({ qcm: qcmFallback });
  }
});

export default router;
