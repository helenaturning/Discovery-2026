# Application de Vérification de Présence Biométrique

Application web mobile bilingue (FR/EN) pour la vérification automatique de présence en binôme avec reconnaissance faciale IA et géolocalisation.

## 🌟 Fonctionnalités Principales

### Pour les Employés
- ✅ **Inscription avec enrôlement biométrique** : Photo + question de sécurité personnelle
- ✅ **Workflow quotidien** :
  - Consentement géolocalisation au démarrage
  - Vérifications périodiques toutes les 90 minutes
  - Choix : reconnaissance faciale OU question personnelle
  - Upload de photos (pas de caméra dans Figma)
- ✅ **Tracking temps réel** avec affichage du binôme et du site
- ✅ **Arrêt automatique hors horaires** pour respect de la vie privée

### Pour les Superviseurs
- ✅ **Dashboard en temps réel** avec KPIs
- ✅ **Gestion des sites** (création, modification, suppression)
- ✅ **Gestion des binômes** (assignation, suivi)
- ✅ **Monitoring géographique** avec Google Maps
- ✅ **Alertes IA** avec niveaux de sévérité

### Pour les Administrateurs
- ✅ **Vue globale** de toute l'organisation
- ✅ **Gestion des utilisateurs** (tous rôles)
- ✅ **Gestion des sites** (tous sites)
- ✅ **Gestion des binômes** (tous binômes)
- ✅ **Paramètres système** configurables

## 🎨 Design

- **Mobile-first** : Optimisé pour iPhone 14 (390px)
- **Style professionnel data** avec palette de couleurs cohérente:
  - Primaire: #0ea5e9 (bleu)
  - Succès: #10b981 (vert)
  - Warning: #f59e0b (orange)
  - Danger: #ef4444 (rouge)
- **États visuels clairs** : Présent, Absent, En pause, Suspendu
- **Support bilingue** : Français / Anglais

## 🛠️ Technologies

- **Frontend**: React + TypeScript + Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Maps**: Google Maps (placeholders visuels)
- **IA**: Service de reconnaissance faciale (mockée pour démo)

## 📦 Installation & Configuration

### 1. Installation des Dépendances

Les dépendances sont gérées automatiquement par Figma Make.

### 2. Configuration Supabase

#### Option A: Utiliser les Données Mockées (Par Défaut)

Dans `/config/app.ts`, définissez:
```typescript
export const USE_SUPABASE = false;
```

#### Option B: Connecter Supabase (Recommandé pour Production)

1. **Créer un projet Supabase** sur [supabase.com](https://supabase.com)

2. **Configurer la base de données** :
   - Allez dans SQL Editor
   - Copiez le schéma depuis `/lib/supabase.ts` (variable `DATABASE_SCHEMA`)
   - Exécutez la query

3. **Configurer Storage** :
   - Créez deux buckets: `biometric-photos` et `verification-photos`
   - Configurez les policies (voir `/SUPABASE_SETUP.md`)

4. **Variables d'environnement** :
   ```
   NEXT_PUBLIC_SUPABASE_URL=votre_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_key
   ```

5. **Activer Supabase** dans `/config/app.ts`:
   ```typescript
   export const USE_SUPABASE = true;
   ```

Voir `/SUPABASE_SETUP.md` pour les instructions détaillées.

## 🚀 Utilisation

### Test avec Données Mockées

1. **Login** avec un compte de test:
   - Employee: `jean.dupont@company.com` / `password`
   - Supervisor: `pierre.bernard@company.com` / `password`

2. **Inscription** : Sélectionnez un rôle et remplissez le formulaire

### Avec Supabase

1. **Créer un compte** via le formulaire d'inscription
2. **S'authentifier** avec email/password
3. Toutes les données sont persistées dans Supabase

## 📱 Parcours Utilisateur

### Employé
1. **Inscription** : Photo biométrique + question personnelle
2. **Login quotidien**
3. **Démarrer la journée** : Accepter géolocalisation
4. **Vérifications périodiques** : Toutes les 90 min
   - Photo faciale OU répondre à la question
5. **Fin de journée** : Résumé avec scoring

### Superviseur
1. **Dashboard** : Vue d'ensemble temps réel
2. **Gérer les sites** : Créer/modifier sites avec carte
3. **Gérer les binômes** : Assigner employés
4. **Traiter les alertes** : Résoudre anomalies IA

### Administrateur
1. **Dashboard global** : Métriques de l'organisation
2. **Gérer les utilisateurs** : CRUD complet
3. **Gérer les sites** : Tous les sites
4. **Paramètres système** : Configuration globale

## 🔒 Sécurité & Vie Privée

- ✅ **Row Level Security (RLS)** : Données isolées par rôle
- ✅ **Stockage chiffré** : Photos biométriques sécurisées
- ✅ **Arrêt automatique** : Pas de tracking hors horaires
- ✅ **Consentement explicite** : Géolocalisation + biométrie
- ✅ **RGPD compliant** : Gestion des données personnelles

⚠️ **Important**: Figma Make n'est pas conçu pour collecter des PII ou données sensibles. Pour une production réelle, implémentez des mesures de sécurité supplémentaires (chiffrement bout-en-bout, audits, conformité locale).

## 🗺️ Architecture

```
/
├── components/          # Composants React
│   ├── Employee*.tsx   # Parcours employé
│   ├── Supervisor*.tsx # Parcours superviseur
│   ├── Admin*.tsx      # Parcours admin
│   └── ui/             # Composants UI réutilisables
├── contexts/           # State management
│   ├── AuthContext.tsx           # Auth mockée
│   ├── SupabaseAuthContext.tsx   # Auth Supabase
│   └── LanguageContext.tsx       # i18n
├── services/           # Services API
│   └── supabaseService.ts        # CRUD Supabase
├── hooks/              # React hooks custom
│   └── useSupabaseAuth.ts        # Hook auth Supabase
├── lib/                # Librairies
│   └── supabase.ts              # Client + Schéma DB
├── config/             # Configuration
│   └── app.ts                   # Feature flags
└── utils/              # Utilitaires
    └── aiService.ts             # Service IA (mock)
```

## 🎯 Données Disponibles

### Tables Supabase
- **profiles** : Utilisateurs (employees, supervisors, admins)
- **sites** : Sites géographiques
- **pairs** : Binômes d'employés
- **sessions** : Sessions de travail
- **check_ins** : Vérifications périodiques
- **biometric_data** : Données biométriques
- **ai_alerts** : Alertes IA
- **system_settings** : Configuration système

### Storage Buckets
- **biometric-photos** : Photos d'enrôlement
- **verification-photos** : Photos de vérification

## 🌍 Internationalisation

L'application supporte FR/EN via `LanguageContext`. Ajoutez des langues dans `/contexts/LanguageContext.tsx`.

## 📊 Fonctionnalités IA

- **Reconnaissance faciale** : Vérification biométrique (mockée)
- **Détection d'anomalies** :
  - Anomalies GPS
  - Incohérences faciales
  - Patterns suspects
  - Séparation binôme
- **Scoring de fiabilité** : Calcul automatique

## 🔧 Configuration Avancée

### Paramètres Système (`/config/app.ts`)
```typescript
APP_CONFIG = {
  verificationFrequency: 90,  // minutes
  defaultSiteRadius: 100,     // meters
  aiConfidenceThreshold: 70,  // percentage
}
```

### Feature Flags
```typescript
FEATURES = {
  faceRecognition: true,
  geolocation: true,
  realTimeMonitoring: true,
  aiAlerts: true,
}
```

## 🐛 Dépannage

### "Cannot find module '@supabase/supabase-js'"
→ Supabase n'est pas activé. Utilisez `USE_SUPABASE = false` ou configurez Supabase.

### "User not authenticated"
→ Vérifiez que l'utilisateur est bien inscrit et connecté.

### "RLS policy violation"
→ Vérifiez les policies dans Supabase (voir SUPABASE_SETUP.md).

## 📄 License

Propriétaire - Tous droits réservés

## 🤝 Support

Pour toute question :
- Documentation Supabase : https://supabase.com/docs
- React : https://react.dev
- Tailwind CSS : https://tailwindcss.com

---

**Note** : Cette application est un prototype. Pour une utilisation en production, ajoutez :
- Tests unitaires et e2e
- Monitoring et analytics
- CI/CD
- Backup automatique
- Documentation API complète
- Audit de sécurité professionnel
