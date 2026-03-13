# Renyou Shop Project

## 📌 Description
Renyou Shop est une application **full-stack e-commerce** en cours de développement.  
Le projet combine un **frontend React/Vite/TailwindCSS** et un **backend Express/MongoDB**.  
Objectif : fournir une plateforme moderne et performante pour la gestion et la vente de produits en ligne.

## 🚧 Statut du projet
⚠️ Le projet est actuellement **en cours de développement (Sprint 1)**.  
Certaines fonctionnalités sont encore en phase de configuration et de test.

## 🛠️ Technologies utilisées
- **Frontend** : React, Vite, TailwindCSS  
- **Backend** : Node.js, Express, MongoDB  
- **Outils DevOps** : Git, ESLint, Prettier, CI/CD (à venir)

## 📂 Structure du projet
Renyou-Shop-Project-/
│── backend/        → API Express.js + MongoDB (Mongoose)
│   ├── server.js   → Point d’entrée du backend
│   ├── src/
│   │   ├── controllers/ → Logique métier (produits, auth, etc.)
│   │   ├── models/      → Schémas Mongoose (User, Product, etc.)
│   │   └── routes/      → Définition des endpoints REST
│
│── frontend/       → Interface utilisateur React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/  → Navbar, Footer, ProductCard, etc.
│   │   ├── pages/       → Shop, Routine, Auth, Admin
│   │   └── App.jsx      → Router principal
│   ├── vite.config.js   → Configuration Vite
│   └── tailwind.config.js → Configuration TailwindCSS
│
│── ml-service/     → Service Flask pour recommandations & chatbot
│   ├── app.py      → Endpoints /ml/recommend et /ml/chat
│   └── data/       → Dataset produits nettoyé
│
│── postman/        → Collections API pour tests et documentation
│── .gitignore      → Exclusion des fichiers inutiles (node_modules, .env, etc.)
│── package.json    → Dépendances globales
│── README.md       → Documentation du projet
