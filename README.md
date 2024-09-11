Voici un exemple de `README.md` pour ton projet. Il présente les fonctionnalités principales, les étapes d'installation, et comment utiliser l'application.

---

# Suivi de Localisation en Temps Réel avec React Native & Supabase

Cette application React Native utilise `react-native-maps` pour afficher la position actuelle de l'utilisateur sur une carte. Elle enregistre également la position de l'utilisateur dans une base de données Supabase en temps réel. De plus, l'application permet de changer le type de carte et de suivre le déplacement de l'utilisateur, traçant une ligne tous les 10 mètres parcourus.

## Fonctionnalités

- Affichage en temps réel de la position actuelle de l'utilisateur sur une carte.
- Enregistrement automatique des coordonnées dans une base de données Supabase.
- Sélecteur de type de carte (standard, satellite, terrain, hybride).
- Suivi du déplacement avec traçage du chemin après chaque 10 mètres parcourus.
- Affichage des informations de localisation (latitude, longitude, zoom).

## Prérequis

Avant de commencer, assurez-vous d'avoir installé ou configuré les éléments suivants :

- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) pour le développement d'applications React Native
- Un compte [Supabase](https://supabase.io/) et une table `locations` avec les colonnes `latitude` et `longitude`
- [Android Studio](https://developer.android.com/studio) ou un appareil physique pour tester l'application sur Android

## Installation

1. Clonez ce dépôt GitHub sur votre machine locale.

   ```bash
   git clone https://github.com/votre_nom/utilisation-de-la-localisation.git
   ```

2. Accédez au répertoire du projet.

   ```bash
   cd utilisation-de-la-localisation
   ```

3. Installez les dépendances nécessaires.

   ```bash
   npm install
   ```

4. Configurez vos variables d'environnement Supabase. Créez un fichier `.env` à la racine du projet avec les informations suivantes :

   ```bash
   SUPABASE_URL=votre_supabase_url
   SUPABASE_ANON_KEY=votre_cle_anon_supabase
   ```

5. Démarrez l'application Expo.

   ```bash
   expo start
   ```

## Utilisation

1. Lorsque vous démarrez l'application pour la première fois, vous serez invité à accorder des permissions d'accès à votre localisation.

2. Votre position actuelle sera affichée sur la carte avec un marqueur.

3. Vous pouvez choisir le type de carte (standard, satellite, terrain, hybride) via un sélecteur en haut de l'écran.

4. À chaque fois que vous vous déplacez de 10 mètres ou plus, une ligne sera tracée pour montrer votre chemin parcouru.

5. Les coordonnées de votre position actuelle seront enregistrées dans Supabase.

## Capture d'écran

![Capture d'écran de l'application](https://lien-vers-votre-image.com)

## Table `locations` dans Supabase

Assurez-vous que votre table `locations` dans Supabase est configurée de cette manière :

```sql
CREATE TABLE locations (
  id serial PRIMARY KEY,
  latitude float8 NOT NULL,
  longitude float8 NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## Technologies Utilisées

- **React Native** : Framework mobile pour construire des applications natives.
- **Expo** : Outil pour faciliter le développement React Native.
- **Supabase** : Backend as a Service pour la base de données.
- **react-native-maps** : Composant pour l'affichage des cartes et des marqueurs.
- **@react-native-picker/picker** : Pour sélectionner le type de carte.

## Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez améliorer cette application ou ajouter des fonctionnalités supplémentaires, n'hésitez pas à soumettre une pull request.

1. Fork ce projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ajout-fonctionnalité`).
3. Faites un commit (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. Poussez vos modifications (`git push origin feature/ajout-fonctionnalité`).
5. Ouvrez une Pull Request.

## License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.

---
