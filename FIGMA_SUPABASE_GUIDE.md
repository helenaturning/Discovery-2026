# Guide : Activer Supabase dans Figma Make

## 🎯 Objectif

Ce guide vous explique comment passer des données mockées à une base de données Supabase réelle pour persister vos données.

## 📋 Prérequis

1. Un compte Supabase (gratuit sur [supabase.com](https://supabase.com))
2. Cette application déployée dans Figma Make

## 🚀 Étapes d'Activation

### Étape 1 : Créer votre Projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez:
   - **Name**: `presence-verification` (ou votre choix)
   - **Database Password**: Créez un mot de passe fort
   - **Region**: Choisissez la région la plus proche de vos utilisateurs
5. Cliquez sur "Create new project"
6. ⏱️ Attendez ~2 minutes que le projet soit créé

### Étape 2 : Configurer la Base de Données

1. Dans votre projet Supabase, allez dans **SQL Editor** (menu gauche)
2. Cliquez sur "+ New Query"
3. Ouvrez le fichier `/lib/supabase.ts` dans Figma Make
4. Copiez TOUT le contenu de la constante `DATABASE_SCHEMA` (la longue chaîne SQL)
5. Collez-le dans l'éditeur SQL de Supabase
6. Cliquez sur "Run" (ou Ctrl+Enter)
7. ✅ Vous devriez voir "Success. No rows returned"

### Étape 3 : Configurer le Storage

1. Dans Supabase, allez dans **Storage** (menu gauche)
2. Cliquez sur "Create a new bucket"
3. Créez le bucket `biometric-photos`:
   - **Name**: `biometric-photos`
   - **Public bucket**: ✅ Coché
   - Cliquez sur "Create bucket"
4. Répétez pour créer `verification-photos`
5. Pour chaque bucket, configurez les policies:
   - Cliquez sur le bucket
   - Allez dans "Policies"
   - Cliquez sur "New Policy"
   - Sélectionnez "For full customization, create a policy from scratch"
   - Politique 1 (Upload):
     ```sql
     CREATE POLICY "Employees can upload their photos"
     ON storage.objects FOR INSERT
     WITH CHECK (
       bucket_id = 'biometric-photos' AND
       auth.uid()::text = (storage.foldername(name))[1]
     );
     ```
   - Politique 2 (Read):
     ```sql
     CREATE POLICY "Service can read biometric photos"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'biometric-photos');
     ```

### Étape 4 : Récupérer vos Clés API

1. Dans Supabase, allez dans **Project Settings** (icône engrenage)
2. Allez dans **API**
3. Copiez:
   - **Project URL** (commence par `https://`)
   - **anon public** key (la clé publique, commence par `eyJ...`)

### Étape 5 : Configurer Figma Make

1. Dans Figma Make, vous aurez besoin de configurer les variables d'environnement
2. Ajoutez:
   - `NEXT_PUBLIC_SUPABASE_URL` = Votre Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Votre anon public key

### Étape 6 : Activer Supabase dans le Code

1. Ouvrez le fichier `/config/app.ts`
2. Changez:
   ```typescript
   export const USE_SUPABASE = false;
   ```
   En:
   ```typescript
   export const USE_SUPABASE = true;
   ```
3. Sauvegardez le fichier

## ✅ Vérification

1. Rechargez votre application
2. Créez un nouveau compte via le formulaire d'inscription
3. Connectez-vous avec ce compte
4. Vérifiez dans Supabase:
   - **Table Editor** > `profiles` : Votre utilisateur doit apparaître
   - **Authentication** > **Users** : Votre user doit être listé

## 🎉 C'est fait !

Votre application utilise maintenant Supabase ! Les données sont persistées et vous pouvez :
- Créer de vrais comptes utilisateurs
- Gérer des sites et binômes
- Stocker des photos biométriques
- Voir les données en temps réel dans Supabase

## 🔄 Retour aux Données Mockées

Si vous rencontrez des problèmes, vous pouvez revenir aux données mockées :
1. Ouvrez `/config/app.ts`
2. Changez `USE_SUPABASE = true` en `USE_SUPABASE = false`
3. Sauvegardez

## 📊 Explorer vos Données

Dans Supabase, vous pouvez:
- **Table Editor** : Voir/éditer vos données comme dans Excel
- **SQL Editor** : Faire des requêtes SQL personnalisées
- **Storage** : Voir les photos uploadées
- **Auth** : Gérer les utilisateurs
- **Logs** : Voir l'activité en temps réel

## 🐛 Problèmes Courants

### "Invalid API key"
→ Vérifiez que vous avez copié la bonne clé (anon public, pas service_role)

### "Table does not exist"
→ Vous n'avez pas exécuté le schéma SQL. Retournez à l'Étape 2.

### "RLS policy violation"
→ Les policies ne sont pas bien configurées. Vérifiez l'Étape 3.

### "No rows returned" lors de connexion
→ Créez un compte via le formulaire d'inscription (pas directement dans Supabase Auth)

## 🔒 Sécurité en Production

Pour une utilisation en production:
1. ✅ Activez 2FA sur votre compte Supabase
2. ✅ Configurez des backups automatiques
3. ✅ Utilisez un domaine personnalisé
4. ✅ Ajoutez monitoring et alertes
5. ✅ Configurez les limites de rate limiting
6. ✅ Passez au plan Pro pour plus de ressources

## 📞 Support

- **Documentation Supabase** : https://supabase.com/docs
- **Discord Supabase** : https://discord.supabase.com
- **Status Supabase** : https://status.supabase.com

---

**Note** : Cette configuration est pour du développement/test. Pour une production réelle avec données sensibles (biométrie), consultez un expert en sécurité.
