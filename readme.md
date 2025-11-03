# GI's Quizz - Application de Quiz Pédagogique

Une application web interactive de quiz utilisant React pour le frontend et Express.js pour le backend, avec l'intégration de l'API Perplexity pour la génération de questions.

## Membres du Groupe

- Lemaitre Gabriel: Chef de Projet
- Vilaca Enzo: Développeur
- Mujavonic Melissa: Designeuse et responsable UX/UI 

## 🚀 Fonctionnalités

- Interface utilisateur interactive avec React
- Génération automatique de QCM sur les bases de données
- Backend API Restful avec Express.js
- Intégration de l'API Perplexity pour la génération de contenu
- Questions à choix multiples (QCM) avec 4 options par question

## 🛠️ Technologies Utilisées

- Frontend:
  - React 18
  - Vite
  - React DOM
  
- Backend:
  - Node.js
  - Express.js
  - CORS
  - dotenv

## Points forts et limites

- Interface Intuitive grace au language React
- Génération dynamique de QCM avec API Perplexity
- Architecture claire (frontend/backend séparés)
## Limites / axes d’amélioration

- Améliorer la gestion des erreurs API
- Implémenter une authentification utilisateur

## 📦 Installation

1. Clonez le repository:
```bash
git clone [url-du-repository]
```

2. Installez les dépendances:
```bash
npm install
```

## 🚦 Démarrage

1. Lancez le serveur de développement frontend:
```bash
npm run dev
```

2. Dans un autre terminal, démarrez le serveur backend:
```bash
npm run server
```

Le frontend sera accessible à l'adresse `http://localhost:5173` (ou le port indiqué par Vite)
Le serveur backend démarrera sur le port 3001 par défaut.

## 📁 Structure du Projet

```
GIs-Quizz/
├── public/                # Fichiers statiques
├── routes/               
│   └── qcm.js            # Routes pour les QCM
├── src/
│   ├── components/
│   │   └── ChatInterface.jsx  # Interface de chat
│   ├── App.jsx           # Composant principal
│   ├── App.css           # Styles principaux
│   ├── index.jsx         # Point d'entrée
│   └── index.css         # Styles globaux
├── server.js             # Serveur Express
├── vite.config.js        # Configuration Vite
└── package.json          # Dépendances et scripts
```

## 📄 Scripts Disponibles

- `npm run dev`: Lance le serveur de développement frontend
- `npm run build`: Construit l'application pour la production
- `npm run preview`: Prévisualise la version de production
- `npm run server`: Démarre le serveur backend

## 📸 Captures d’écran
![Page d’accueil du quiz](./Acceuil.png)
![Interface de question](./Question.png)

## 📝 Licence

Ce projet est sous licence MIT.