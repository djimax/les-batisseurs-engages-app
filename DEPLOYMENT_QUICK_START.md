# 🚀 Déploiement Gratuit en 5 Minutes

## ⚡ Résumé Ultra-Rapide

Votre application **Les Bâtisseurs Engagés** peut être en ligne **gratuitement** en 5 minutes !

### Coût Total : **0€ par mois** ✅

---

## 📋 Les 5 Étapes

### 1️⃣ Créer une Base de Données Gratuite (2 min)

Allez sur [TiDB Cloud Free](https://tidbcloud.com/free-tier) :
- Cliquez sur **"Sign Up"**
- Remplissez le formulaire
- Créez un cluster **Serverless** (gratuit)
- Copiez la chaîne de connexion

### 2️⃣ Créer un Compte Vercel (1 min)

Allez sur [Vercel](https://vercel.com) :
- Cliquez sur **"Sign Up"**
- Choisissez **"Continue with GitHub"**
- Autorisez Vercel

### 3️⃣ Importer le Projet (1 min)

Dans Vercel :
- Cliquez sur **"Add New"** → **"Project"**
- Cherchez `djimax/les-batisseurs-engages-app`
- Cliquez sur **"Import"**

### 4️⃣ Ajouter les Variables d'Environnement (1 min)

Dans Vercel (Settings → Environment Variables) :
- Ajoutez `DATABASE_URL` = votre chaîne TiDB
- Ajoutez `NODE_ENV` = `production`
- Cliquez sur **"Save"**

### 5️⃣ Redéployer (1 min)

- Allez dans **"Deployments"**
- Cliquez sur **"Redeploy"**
- Attendez que ça finisse

---

## ✅ C'est Fait !

Votre application est maintenant **en ligne** ! 🎉

Accédez-la via votre URL Vercel (ex: `https://les-batisseurs-engages.vercel.app`)

---

## 🔑 Identifiants de Test

- **Email** : `admin@batisseurs-engages.fr`
- **Mot de passe** : `Admin123!`

---

## 📖 Guide Détaillé

Pour un guide complet avec captures d'écran, consultez [DEPLOYMENT_GUIDE_FR.md](./DEPLOYMENT_GUIDE_FR.md)

---

## 💡 Questions Fréquentes

**Q : Combien ça coûte ?**
A : 0€ par mois. Vercel et TiDB Cloud offrent des plans gratuits illimités pour les associations.

**Q : Combien de membres puis-je gérer ?**
A : Jusqu'à 10 000+ membres avec le plan gratuit.

**Q : Que se passe-t-il si mon association grandit ?**
A : Vous pouvez passer à des plans payants, mais le gratuit suffit pour la plupart des associations.

**Q : Mes données sont-elles sécurisées ?**
A : Oui ! HTTPS gratuit, base de données sécurisée, sauvegardes automatiques.

---

## 🆘 Problèmes ?

1. Vérifiez que `DATABASE_URL` est correctement configurée
2. Consultez les logs Vercel (Deployments → Logs)
3. Relancez le déploiement (Redeploy)

---

**Besoin d'aide ?** Consultez la [documentation complète](./DEPLOYMENT_GUIDE_FR.md)

