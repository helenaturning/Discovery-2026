# Architecture de l'Application

## 🏗️ Vue d'Ensemble

Cette application suit une architecture React moderne avec séparation claire des responsabilités :

```
┌──────────────────────────────────────────────────────┐
│                  Figma Make App                       │
│                                                        │
│  ┌────────────────────────────────────────────────┐  │
│  │            User Interface (React)               │  │
│  │  • Employee Dashboard                           │  │
│  │  • Supervisor Dashboard                         │  │
│  │  • Admin Dashboard                              │  │
│  └────────┬────────────────────────┬────────────────┘  │
│           │                        │                   │
│  ┌────────▼──────────┐    ┌───────▼──────────┐       │
│  │   Auth Context     │    │  Language Context │       │
│  │  (Mock / Supabase) │    │    (i18n FR/EN)   │       │
│  └────────┬──────────┘    └──────────────────┘       │
│           │                                            │
│  ┌────────▼──────────────────────────────────────┐   │
│  │           Supabase Services                    │   │
│  │  • Sites Service                               │   │
│  │  • Pairs Service                               │   │
│  │  • Check-ins Service                           │   │
│  │  • Alerts Service                              │   │
│  │  • Users Service                               │   │
│  └────────┬──────────────────────────────────────┘   │
│           │                                            │
└───────────┼────────────────────────────────────────────┘
            │
    ┌───────▼────────┐
    │    Supabase    │
    │  • PostgreSQL  │
    │  • Auth        │
    │  • Storage     │
    │  • Realtime    │
    └────────────────┘
```

## 📁 Structure des Dossiers

```
/
├── components/              # Composants React
│   ├── Employee*.tsx       # Parcours employé
│   │   ├── EmployeeHome.tsx
│   │   ├── EmployeeMap.tsx
│   │   ├── EmployeeSummary.tsx
│   │   └── EmployeeRegistration.tsx
│   │
│   ├── Supervisor*.tsx     # Parcours superviseur
│   │   ├── SupervisorDashboard.tsx
│   │   ├── SupervisorSites.tsx
│   │   ├── SupervisorPairs.tsx
│   │   └── SupervisorAlerts.tsx
│   │
│   ├── Admin*.tsx          # Parcours admin
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminSiteManagement.tsx
│   │   ├── AdminPairManagement.tsx
│   │   ├── UserManagement.tsx
│   │   └── SystemSettings.tsx
│   │
│   ├── shared/             # Composants partagés
│   │   ├── Login.tsx
│   │   ├── RoleSelection.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── MobileNav.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── LocationConsentDialog.tsx
│   │
│   └── ui/                 # Composants UI réutilisables
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ... (shadcn/ui)
│
├── contexts/               # React Contexts
│   ├── AuthContext.tsx            # Auth avec données mockées
│   ├── SupabaseAuthContext.tsx    # Auth avec Supabase
│   └── LanguageContext.tsx        # Internationalisation
│
├── services/               # Services API
│   └── supabaseService.ts         # CRUD Supabase
│
├── hooks/                  # React Hooks custom
│   └── useSupabaseAuth.ts         # Hook d'authentification
│
├── lib/                    # Librairies externes
│   └── supabase.ts               # Client Supabase + Schéma
│
├── config/                 # Configuration
│   └── app.ts                    # Feature flags & constantes
│
├── utils/                  # Utilitaires
│   └── aiService.ts              # Service IA (mock)
│
├── types/                  # Types TypeScript
│   └── index.ts                  # Types globaux
│
└── styles/                 # Styles CSS
    └── globals.css               # Styles Tailwind + custom
```

## 🔄 Flux de Données

### 1. Authentification (Mock)

```
User Input (Login/Register)
    ↓
AuthContext (contexts/AuthContext.tsx)
    ↓
Local State (useState)
    ↓
Components re-render with user data
```

### 2. Authentification (Supabase)

```
User Input (Login/Register)
    ↓
SupabaseAuthContext (contexts/SupabaseAuthContext.tsx)
    ↓
useSupabaseAuth Hook (hooks/useSupabaseAuth.ts)
    ↓
Supabase Client (lib/supabase.ts)
    ↓
Supabase Auth API
    ↓
User Profile from Database (profiles table)
    ↓
Components re-render with authenticated user
```

### 3. CRUD Operations

```
User Action (Create/Update/Delete Site)
    ↓
Component Event Handler
    ↓
Context Method (addSite/updateSite/deleteSite)
    ↓
Supabase Service (services/supabaseService.ts)
    ↓
Supabase Database
    ↓
Local State Update
    ↓
Component Re-render with updated data
```

### 4. File Upload (Biometric Photo)

```
User selects file
    ↓
Component handles file input
    ↓
Convert to base64 / File object
    ↓
useSupabaseAuth.uploadBiometricPhoto()
    ↓
Supabase Storage API
    ↓
Returns public URL
    ↓
Store URL in biometric_data table
```

## 🎭 Rôles et Permissions

### Employee (Employé)

**Accès:**
- ✅ Son propre dashboard
- ✅ Carte de son site assigné
- ✅ Ses propres check-ins
- ✅ Son résumé journalier
- ✅ Son profil

**Restrictions:**
- ❌ Pas d'accès aux autres employés
- ❌ Pas de gestion de sites
- ❌ Pas de gestion de binômes

**Navigation:** Home | Map | Summary | Profile

### Supervisor (Superviseur)

**Accès:**
- ✅ Dashboard avec KPIs de ses sites
- ✅ Gérer les sites dont il est responsable
- ✅ Gérer les binômes de ses sites
- ✅ Voir les alertes de ses sites
- ✅ Voir les employés de ses sites

**Restrictions:**
- ❌ Pas d'accès aux autres superviseurs
- ❌ Pas de modification des paramètres système
- ❌ Pas de gestion des utilisateurs globale

**Navigation:** Dashboard | Sites | Binômes | Alerts | Profile

### Admin (Administrateur)

**Accès:**
- ✅ Vue globale de l'organisation
- ✅ Gérer TOUS les utilisateurs
- ✅ Gérer TOUS les sites
- ✅ Gérer TOUS les binômes
- ✅ Modifier les paramètres système
- ✅ Voir toutes les alertes

**Restrictions:**
- ❌ Aucune (accès complet)

**Navigation:** Dashboard | Users | Sites | Binômes | Settings | Profile

## 🔐 Sécurité (RLS - Row Level Security)

Les policies Supabase garantissent que :

1. **Profiles (Utilisateurs)**
   - Un utilisateur peut voir son propre profil
   - Les superviseurs peuvent voir les employés de leurs sites
   - Les admins peuvent voir tous les profils

2. **Sites**
   - Lecture : Tout le monde peut voir les sites
   - Création/Modification : Superviseurs et admins uniquement
   - Suppression : Admins uniquement

3. **Pairs (Binômes)**
   - Lecture : Employés voient leur binôme, superviseurs et admins tous
   - Création/Modification/Suppression : Superviseurs et admins uniquement

4. **Check-ins**
   - Création : Employés uniquement (leurs propres check-ins)
   - Lecture : Employé voit les siens, superviseurs et admins tous

5. **Biometric Data**
   - Lecture/Écriture : Employé voit les siennes, admins tous
   - Utilisation : Service backend pour vérification

6. **Alerts**
   - Création : Système automatique
   - Lecture : Superviseurs et admins
   - Résolution : Superviseurs et admins

7. **System Settings**
   - Lecture/Modification : Admins uniquement

## 🎨 Design System

### Couleurs

```typescript
// Primaires
primary: #0ea5e9      // Bleu (actions principales)
success: #10b981      // Vert (présent, validé)
warning: #f59e0b      // Orange (pause, attention)
danger: #ef4444       // Rouge (absent, erreur)
purple: #8b5cf6       // Violet (superviseur)

// Neutres
background: #f8fafc   // Fond général
card: #ffffff         // Cartes
muted: #64748b        // Texte secondaire
border: #e2e8f0       // Bordures
```

### Composants UI (shadcn/ui)

Tous les composants UI suivent le design system shadcn/ui :
- Accessibles (ARIA)
- Responsive
- Personnalisables via Tailwind
- Dark mode ready

### Layout Mobile

- **Max Width:** 390px (iPhone 14)
- **Header:** Sticky, 56px height
- **Content:** Scrollable, padding 16px
- **Navigation:** Fixed bottom, 64px height
- **Total viewport:** ~844px (iPhone 14 height)

## 🌐 Internationalisation (i18n)

Le système i18n est géré par `LanguageContext` :

```typescript
// Utilisation dans un composant
const { t, language, setLanguage } = useLanguage();

// Traduction
<h1>{t('welcome.title')}</h1>

// Changement de langue
<Button onClick={() => setLanguage('en')}>EN</Button>
```

**Langues supportées :** FR (Français), EN (English)

**Ajout d'une langue :**
1. Modifier `contexts/LanguageContext.tsx`
2. Ajouter les traductions dans l'objet `translations`
3. Ajouter le code langue dans le type `Language`

## 🧪 Testing (Recommandé pour Production)

L'application n'inclut pas de tests par défaut. Pour production :

```bash
# Unit tests (Jest + React Testing Library)
npm test

# E2E tests (Playwright / Cypress)
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Performance

### Optimisations Actuelles
- ✅ React hooks optimisés (useMemo, useCallback)
- ✅ Lazy loading des composants (possible à ajouter)
- ✅ Images optimisées (Supabase CDN)
- ✅ CSS en Tailwind (tree-shaking automatique)

### Optimisations Possibles
- [ ] Code splitting par rôle
- [ ] Service Worker pour offline
- [ ] Caching Supabase queries
- [ ] Infinite scroll pour listes longues
- [ ] Virtualisation des listes

## 📊 Monitoring (Production)

Pour production, ajouter :

1. **Error Tracking:** Sentry / Rollbar
2. **Analytics:** Google Analytics / Plausible
3. **Performance:** Vercel Analytics / Lighthouse CI
4. **Logs:** Logtail / Datadog

## 🔄 CI/CD (Production)

Pipeline recommandé :

```yaml
1. Lint (ESLint)
2. Type Check (TypeScript)
3. Tests (Jest)
4. Build (Vite/Next.js)
5. Deploy (Vercel / Netlify)
```

## 📝 Maintenance

### Mises à Jour Régulières
- React & dependencies (npm audit fix)
- Supabase client
- Tailwind CSS
- shadcn/ui components

### Backups Supabase
- Automatic daily backups (Supabase Pro)
- Export manuel mensuel
- Point-in-time recovery (7 jours)

## 🎓 Ressources

- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org
- **Tailwind CSS:** https://tailwindcss.com
- **Supabase:** https://supabase.com/docs
- **shadcn/ui:** https://ui.shadcn.com

---

**Version:** 1.0.0  
**Dernière mise à jour:** Janvier 2025
