import express from 'express';
const router = express.Router();

router.post('/qcm', async (req, res) => {
  const sujet = req.body.sujet || "informatique";
  const qcm = [
    {
      question: `Que fait le CPU dans un système ${sujet} ?`,
      options: ["Stocke les données", "Effectue des calculs", "Affiche des images", "Connecte au réseau"],
      answer: "Effectue des calculs"
    },
    {
      question: `Quelle extension pour un fichier CSS lié au ${sujet} ?`,
      options: [".css", ".py", ".js", ".html"],
      answer: ".css"
    }
  ];
  res.json({ qcm });
});

export default router;
