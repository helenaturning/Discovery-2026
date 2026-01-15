# 🚀 Guide de Démarrage Rapide

Bienvenue dans l'application de vérification de présence biométrique !

## ✅ L'Application est Prête à Utiliser

**Bonne nouvelle !** L'application fonctionne immédiatement avec des **données de test mockées**. Vous pouvez :

1. ✅ Tester tous les parcours (Employé, Superviseur, Admin)
2. ✅ Explorer toutes les fonctionnalités
3. ✅ Voir le design et l'interface
4. ✅ **Sans configuration requise !**

## 🎮 Tester l'Application (Mode Mock)

### Option 1 : Créer un Nouveau Compte

1. Cliquez sur "S'inscrire"
2. Sélectionnez un rôle (Employé / Superviseur / Administrateur)
3. Remplissez le formulaire
4. Connectez-vous avec vos identifiants

### Option 2 : Utiliser un Compte de Test

**Employé :**
- Email: `jean.dupont@company.com`
- Mot de passe: `password`

**Superviseur :**
- Email: `pierre.bernard@company.com`
- Mot de passe: `password`

## 🌟 Prochaines Étapes (Optionnel)

### Voulez-vous Persister les Données ?

Si vous voulez que les données soient sauvegardées (au lieu de réinitialiser à chaque rechargement), vous pouvez activer Supabase :

1. 📖 Lisez `/FIGMA_SUPABASE_GUIDE.md`
2. 🔧 Configurez Supabase (gratuit)
3. ✨ Vos données seront persistées !

**Pas obligatoire** - L'app fonctionne parfaitement en mode mock pour la démo.

## 📱 Fonctionnalités Disponibles

### Pour les Employés
- ✅ Démarrer/Terminer la journée
- ✅ Vérifications périodiques (facial ou question)
- ✅ Voir sa position et celle du binôme sur la carte
- ✅ Résumé de journée avec scoring

### Pour les Superviseurs
- ✅ Dashboard avec KPIs temps réel
- ✅ Gérer les sites
- ✅ Gérer les binômes
- ✅ Traiter les alertes IA

### Pour les Administrateurs
- ✅ Vue globale de l'organisation
- ✅ Gérer tous les utilisateurs
- ✅ Gérer tous les sites et binômes
- ✅ Paramètres système

## 🎨 Navigation

**Mobile-first design** optimisé pour iPhone 14 (390px)

- **Header** : Nom utilisateur + Langue (FR/EN)
- **Content** : Vue principale scrollable
- **Bottom Nav** : Navigation rapide entre sections

## 💡 Conseils

1. **Changez la langue** : Cliquez sur FR/EN dans le header
2. **Testez les rôles** : Déconnectez-vous et reconnectez-vous avec un autre rôle
3. **Upload de photos** : Sélectionnez n'importe quelle image (pas de caméra dans Figma)

## 🔄 Basculer entre Mock et Supabase

Dans `/config/app.ts` :

```typescript
// Mode Mock (par défaut)
export const USE_SUPABASE = false;

// Mode Supabase (après configuration)
export const USE_SUPABASE = true;
```

## 📚 Documentation Complète

- **README.md** : Vue d'ensemble de l'application
- **ARCHITECTURE.md** : Architecture technique détaillée
- **SUPABASE_SETUP.md** : Configuration Supabase pas-à-pas
- **FIGMA_SUPABASE_GUIDE.md** : Guide simplifié Figma Make

## 🎯 Ce qui est Inclus

### ✅ Fonctionnel
- Authentification (mock ou Supabase)
- Gestion de sessions
- Vérifications périodiques
- Géolocalisation (simulation)
- Upload de photos
- Alertes IA
- Bilingue FR/EN

### 🎨 Design
- Mobile-first responsive
- Dark mode ready
- Animations modernes
- Palette de couleurs professionnelle
- Composants UI shadcn/ui

### 🔒 Sécurité
- Row Level Security (Supabase)
- Consentements explicites
- Arrêt automatique hors horaires
- RGPD compliant

## ❓ Questions Fréquentes

### L'app marche-t-elle sans Supabase ?
**Oui !** Elle utilise des données mockées par défaut.

### Puis-je déployer cette app ?
**Oui !** Sur Vercel, Netlify, ou n'importe quelle plateforme React.

### Les données mockées sont-elles réalistes ?
**Oui !** Vous avez des employés, sites, binômes, alertes... tout est là.

### Comment activer la reconnaissance faciale ?
C'est mockée pour l'instant. Pour du vrai, intégrez un service comme AWS Rekognition ou Azure Face API.

## 🎉 Amusez-vous !

L'application est **prête à l'emploi**. Testez, explorez, et amusez-vous !

Si vous avez des questions, consultez la documentation complète.

---

**Version** : 1.0.0  
**Créé avec** : React + TypeScript + Tailwind CSS + Supabase
