# Configuration Supabase pour l'Application de Vérification de Présence

## Étapes d'Installation

### 1. Créer un Projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **Project URL** et **anon public** key

### 2. Configurer la Base de Données

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Créez une nouvelle query
3. Copiez-collez le contenu du fichier `/lib/supabase.ts` (section `DATABASE_SCHEMA`)
4. Exécutez la query pour créer toutes les tables

### 3. Configurer le Storage pour les Photos Biométriques

1. Allez dans **Storage** dans le dashboard Supabase
2. Créez un nouveau bucket nommé `biometric-photos`
3. Configurez les permissions:
   ```sql
   -- Policy pour permettre aux employés d'uploader leurs photos
   CREATE POLICY "Employees can upload their photos"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'biometric-photos' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );

   -- Policy pour permettre la lecture des photos biométriques (pour vérification)
   CREATE POLICY "Service can read biometric photos"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'biometric-photos');
   ```

4. Créez un bucket `verification-photos` pour les photos de check-in
   ```sql
   CREATE POLICY "Employees can upload verification photos"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'verification-photos' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

### 4. Configurer l'Authentification

1. Allez dans **Authentication** > **Providers**
2. Activez **Email** provider
3. Configurez les paramètres d'email (optionnel: SMTP personnalisé)

### 5. Variables d'Environnement

Dans votre fichier `.env.local` (ou configuration Figma Make):

```bash
NEXT_PUBLIC_SUPABASE_URL=votre_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
```

### 6. Données de Test (Optionnel)

Pour tester l'application, vous pouvez insérer des données de test:

```sql
-- Créer un site de test
INSERT INTO sites (name, address, city, latitude, longitude, radius)
VALUES ('Site Alpha', '123 Rue de Test', 'Paris', 48.8566, 2.3522, 100);

-- Créer un utilisateur superviseur (après inscription via l'app)
-- Les utilisateurs seront créés automatiquement via le flux d'inscription
```

## Schéma de la Base de Données

### Tables Principales

- **profiles**: Informations utilisateurs (extends auth.users)
- **sites**: Sites géographiques
- **pairs**: Binômes d'employés
- **check_ins**: Vérifications périodiques
- **biometric_data**: Données biométriques (encodages faciaux)
- **sessions**: Sessions de travail
- **ai_alerts**: Alertes IA
- **system_settings**: Paramètres système

### Sécurité (RLS)

Toutes les tables ont Row Level Security (RLS) activée:
- Les employés peuvent uniquement voir/modifier leurs propres données
- Les superviseurs peuvent voir les données de leurs sites
- Les administrateurs ont accès complet

## Fonctionnalités Supabase Utilisées

- **Auth**: Authentification des utilisateurs
- **Database**: PostgreSQL avec RLS
- **Storage**: Stockage des photos biométriques
- **Realtime** (optionnel): Monitoring en temps réel pour les superviseurs

## Migrations Futures

Pour ajouter de nouvelles fonctionnalités, créez des migrations dans:
`/supabase/migrations/`

## Support

Pour toute question sur la configuration Supabase:
- Documentation: https://supabase.com/docs
- Support: https://supabase.com/support
