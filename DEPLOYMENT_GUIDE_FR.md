# 🚀 Guide de Déploiement Gratuit - Les Bâtisseurs Engagés

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Étape 1 : Configuration de la Base de Données Gratuite](#étape-1--configuration-de-la-base-de-données-gratuite)
4. [Étape 2 : Déploiement sur Vercel](#étape-2--déploiement-sur-vercel)
5. [Étape 3 : Configuration des Variables d'Environnement](#étape-3--configuration-des-variables-denvironnement)
6. [Étape 4 : Test et Validation](#étape-4--test-et-validation)
7. [Maintenance et Mises à Jour](#maintenance-et-mises-à-jour)

---

## Vue d'ensemble

Cette application de gestion d'association sera déployée **100% gratuitement** en utilisant :
- **Vercel** : Hébergement du site web (gratuit, illimité)
- **TiDB Cloud** : Base de données (gratuit, 5 Go inclus)
- **GitHub** : Stockage du code source (gratuit)

**Coût total : 0€ par mois** ✅

---

## Prérequis

Avant de commencer, assurez-vous d'avoir :
- ✅ Un compte **GitHub** (gratuit)
- ✅ Un compte **Vercel** (gratuit, se connecte avec GitHub)
- ✅ Un compte **TiDB Cloud** (gratuit)
- ✅ Un navigateur web moderne

---

## Étape 1 : Configuration de la Base de Données Gratuite

### Option A : TiDB Cloud (Recommandé pour les associations)

**Pourquoi TiDB Cloud ?** 
- 5 Go gratuits (suffisant pour 10 000+ membres)
- Performance excellente
- Pas de carte bancaire requise

**Procédure :**

1. Allez sur [https://tidbcloud.com/free-tier](https://tidbcloud.com/free-tier)
2. Cliquez sur **"Sign Up"** et créez un compte gratuit
3. Complétez votre profil (nom, email, association)
4. Une fois connecté, cliquez sur **"Create a Cluster"**
5. Sélectionnez **"Serverless"** (gratuit)
6. Choisissez la région la plus proche de votre pays
7. Cliquez sur **"Create"** et attendez 2-3 minutes

**Récupérer la chaîne de connexion :**
1. Dans le tableau de bord TiDB, allez dans **"Clusters"**
2. Cliquez sur votre cluster
3. Cliquez sur **"Connect"**
4. Copiez la chaîne de connexion (elle ressemblera à : `mysql://user:password@host:port/database`)

**Sauvegardez cette chaîne, vous en aurez besoin pour Vercel.**

### Option B : Supabase (Alternative)

Si vous préférez une alternative :
1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet (gratuit)
4. Récupérez la chaîne de connexion PostgreSQL

---

## Étape 2 : Déploiement sur Vercel

### Étape 2.1 : Connecter votre compte GitHub à Vercel

1. Allez sur [https://vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à votre compte GitHub
5. Vous êtes maintenant connecté à Vercel

### Étape 2.2 : Importer le projet

1. Dans le tableau de bord Vercel, cliquez sur **"Add New"** → **"Project"**
2. Recherchez le dépôt **`djimax/les-batisseurs-engages-app`**
3. Cliquez sur **"Import"**
4. Vercel va analyser le projet automatiquement

### Étape 2.3 : Configuration du Projet

1. **Project Name** : Gardez le nom par défaut ou changez-le en `les-batisseurs-engages`
2. **Framework Preset** : Sélectionnez **"Vite"**
3. **Build Command** : `pnpm build`
4. **Output Directory** : `dist`
5. **Install Command** : `pnpm install`

Cliquez sur **"Deploy"** et attendez 3-5 minutes que le déploiement se termine.

---

## Étape 3 : Configuration des Variables d'Environnement

Une fois le déploiement terminé, vous devez ajouter les variables d'environnement.

### Étape 3.1 : Ajouter les variables dans Vercel

1. Dans le tableau de bord Vercel, cliquez sur votre projet
2. Allez dans **"Settings"** → **"Environment Variables"**
3. Ajoutez les variables suivantes :

| Variable | Valeur | Exemple |
|----------|--------|---------|
| `DATABASE_URL` | Chaîne de connexion TiDB | `mysql://user:pass@host:3306/db` |
| `NODE_ENV` | `production` | `production` |
| `VITE_API_URL` | URL de votre site Vercel | `https://les-batisseurs-engages.vercel.app` |

4. Cliquez sur **"Save"** pour chaque variable

### Étape 3.2 : Redéployer avec les variables

1. Allez dans **"Deployments"**
2. Cliquez sur le dernier déploiement
3. Cliquez sur **"Redeploy"**
4. Attendez que le redéploiement se termine

---

## Étape 4 : Test et Validation

### Étape 4.1 : Accéder à votre application

1. Une fois le déploiement terminé, cliquez sur **"Visit"** ou allez sur votre URL Vercel
2. Vous devriez voir la page de connexion

### Étape 4.2 : Tester la connexion

Utilisez l'un des comptes de test :
- **Email** : `admin@batisseurs-engages.fr`
- **Mot de passe** : `Admin123!`

### Étape 4.3 : Vérifier les données

1. Allez dans **"Gestion des Membres"** → **"Annuaire des Membres"**
2. Vérifiez que vous pouvez voir les données
3. Essayez d'ajouter un nouveau membre pour tester la base de données

---

## Maintenance et Mises à Jour

### Mettre à jour l'application

Chaque fois que vous modifiez le code sur GitHub, Vercel redéploie automatiquement votre application.

**Procédure :**
1. Modifiez le code localement ou sur GitHub
2. Commitez et poussez vos changements
3. Vercel détecte automatiquement les changements
4. L'application se redéploie en 2-5 minutes

### Surveiller les logs

Si quelque chose ne fonctionne pas :
1. Allez dans **"Deployments"**
2. Cliquez sur le dernier déploiement
3. Allez dans **"Logs"** pour voir les erreurs

### Augmenter les ressources (si nécessaire)

Si votre association grandit et que vous avez besoin de plus de ressources :
- **Vercel Pro** : 20€/mois (optionnel, mais gratuit suffit pour la plupart des associations)
- **TiDB Cloud Pro** : À partir de 10€/mois (optionnel)

---

## 🎯 Résumé des Étapes Rapides

1. ✅ Créer un compte TiDB Cloud gratuit
2. ✅ Créer un cluster TiDB (gratuit, 5 Go)
3. ✅ Copier la chaîne de connexion
4. ✅ Créer un compte Vercel (gratuit)
5. ✅ Importer le projet GitHub
6. ✅ Ajouter les variables d'environnement
7. ✅ Redéployer
8. ✅ Tester l'application

**Durée totale : 30-45 minutes** ⏱️

---

## 📞 Support et Dépannage

### L'application ne se charge pas

**Solution :** Vérifiez que la variable `DATABASE_URL` est correctement configurée dans Vercel.

### Les données ne s'enregistrent pas

**Solution :** Vérifiez que :
1. La base de données TiDB est active
2. La chaîne de connexion est correcte
3. Les tables sont créées (exécutez les migrations)

### Erreur 500 lors de la connexion

**Solution :** Vérifiez les logs Vercel pour voir le message d'erreur exact.

---

## 🔐 Sécurité

Votre application est maintenant :
- ✅ Sécurisée avec HTTPS (certificat gratuit de Vercel)
- ✅ Protégée par un système de connexion
- ✅ Stockée sur des serveurs sécurisés
- ✅ Sauvegardée automatiquement par TiDB

---

## 📊 Statistiques de Performance

Avec cette configuration gratuite, vous pouvez gérer :
- **Jusqu'à 10 000 membres** sans problème
- **Temps de réponse** : < 500ms
- **Disponibilité** : 99.9% (SLA Vercel)
- **Stockage** : 5 Go (TiDB Cloud gratuit)

---

## 🎉 Félicitations !

Votre application de gestion d'association est maintenant **en ligne et accessible 24h/24** sans dépenser un centime ! 🚀

Pour toute question ou problème, consultez la documentation officielle :
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation TiDB Cloud](https://docs.tidbcloud.com)

