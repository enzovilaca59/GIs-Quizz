import express from 'express';
const router = express.Router();

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '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';
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const NOMBRE_QUESTIONS = 10;

router.post('/qcm', async (req, res) => {
  const sujet = req.body.sujet?.trim();

  // Validation stricte du sujet
  if (!sujet || sujet === '') {
    return res.status(400).json({
      qcm: null,
      error: "Veuillez fournir un sujet valide."
    });
  }

  console.log(`\n🔍 Nouvelle requête QCM pour le sujet: "${sujet}"`);

  try {
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
        temperature: 0.8,  // Augmente la variabilité
        top_p: 1.0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur API Perplexity (${response.status}):`, errorText);
      throw new Error(`Erreur API Perplexity: ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Réponse API invalide (pas de choices)');
    }

    let qcmText = data.choices[0].message.content.trim();

    console.log(`📄 Réponse brute Perplexity (${qcmText.length} caractères):`, qcmText.substring(0, 150));

    // Nettoyage des balises markdown
    qcmText = qcmText.replace(/``````\n?/g, '').trim();

    // Parse le JSON
    const parsedData = JSON.parse(qcmText);

    // Vérifie le format success/error
    if (parsedData.success === false) {
      console.log(`⚠️ Sujet hors informatique: "${sujet}"`);
      return res.json({
        qcm: null,
        error: parsedData.message
      });
    }

    // Vérifie que questions existe et est un tableau
    if (!parsedData.questions || !Array.isArray(parsedData.questions) || parsedData.questions.length === 0) {
      throw new Error('Format de réponse invalide : pas de tableau questions valide');
    }

    console.log(`✅ QCM généré avec succès: ${parsedData.questions.length} questions pour "${sujet}"`);

    // Important : renvoie une nouvelle réponse à chaque fois
    return res.json({ qcm: parsedData.questions });

  } catch (error) {
    console.error(`❌ Erreur génération QCM pour "${sujet}":`, error.message);

    return res.status(500).json({
      qcm: null,
      error: "Une erreur s'est produite lors de la génération du QCM. Veuillez réessayer avec un sujet lié à l'informatique."
    });
  }
});

export default router;
