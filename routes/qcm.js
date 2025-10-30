import express from 'express';
const router = express.Router();

router.post('/qcm', async (req, res) => {
  const sujet = req.body.sujet || "informatique";
  // QCM de secours : marche pour tout sujet, tout le temps
  const qcm = [
    {
      question: `Question test sur ${sujet}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option B"
    },
    {
      question: `Deuxième question sur ${sujet}`,
      options: ["Choix 1", "Choix 2", "Choix 3", "Choix 4"],
      answer: "Choix 1"
    }
  ];
  res.json({ qcm });
});

export default router;
