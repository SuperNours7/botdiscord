# 🎵 Bot Discord de Musique — Radio of Gwadien

## 📌 Description

Ce projet est un **bot Discord musical** développé en JavaScript avec **Node.js**, qui permet de jouer des musiques depuis **YouTube** dans un salon vocal. Il dispose d'une interface utilisateur enrichie avec **embeds** et **boutons interactifs**, ainsi que de commandes slash intuitives.

Il utilise :

* **Discord.js** (v14) pour les interactions Discord
* **DisTube** pour la lecture musicale
* **@distube/yt-dlp** pour le support YouTube
* **FFmpeg** pour le traitement audio

---

## 🚀 Fonctionnalités principales

### 🎧 Commandes slash disponibles :

* `/play [url/nom]` — joue une musique (ou playlist)
* `/skip` — passe au morceau suivant
* `/back` — revient au morceau précédent
* `/pause` — met en pause
* `/resume` — reprend la lecture
* `/stop` — arrête la lecture et vide la file
* `/shuffle` — mélange la file d’attente
* `/loop` — change le mode de boucle (off / 1 morceau / file complète)
* `/queue` — affiche la file d’attente actuelle dans un embed élégant

### 📦 Embeds enrichis

* Affichage automatique de la musique en cours avec : miniature, titre, durée, chaîne, utilisateur
* Affichage de la file d’attente avec les 10 prochaines musiques à venir

### 🎛️ Boutons interactifs

Lorsqu’une musique est jouée, un embed avec **6 boutons** apparaît :

| Ligne 1          | Ligne 2    |
| ---------------- | ---------- |
| ⏮️ Back          | 🔀 Shuffle |
| ⏸️/▶️ Pause/Play | 🔁 Loop    |
| ⏭️ Skip          | ⏹️ Stop    |

Chaque bouton agit immédiatement sans avoir à taper une commande.

---

## ⚙️ Installation

1. **Cloner le projet**

```bash
git clone https://github.com/SuperNours7/botdiscord
cd discord-music-bot
```

2. **Installer les dépendances**


```bash
npm install discord.js distube @distube/yt-dlp ffmpeg-static dotenv @discordjs/opus

```

3. **Installer FFmpeg**
   Télécharger (si vous n'avez pas le fichier) FFmpeg depuis [https://www.gyan.dev/ffmpeg/builds/](https://www.gyan.dev/ffmpeg/builds/) (version release), puis :

* Extraire dans le dossier `ffmpeg/` avec le chemin `ffmpeg/bin/ffmpeg.exe`

5. **Démarrer le bot**

```bash
node index.js
```

---

## 🧪 Déploiement des commandes slash

Les commandes slash se déploient automatiquement au démarrage du bot grâce à :

```js
REST().put(Routes.applicationCommands(CLIENT_ID), {...})
```

---

## 🔗 Liens de démonstration et de test

* 💬 Serveur Discord de test : [https://discord.gg/3zsCCGzuDr](https://discord.gg/3zsCCGzuDr)
* 🎥 Vidéo de démonstration : [https://youtu.be/VIDEO-DEMO](https://youtu.be/VIDEO-DEMO)

---

## 💡 Notes complémentaires

* Le bot fonctionne uniquement avec **YouTube** (Spotify désactivé volontairement)
* Le bouton ⏸️/▶️ est contextuel (pause ou play selon l’état)
* Le système de boucle alterne entre : désactivé / boucle sur une musique / boucle sur la file
* Gestion des erreurs : messages clairs et interactions sécurisées

---

## 🙋‍♂️ Auteur

Développé par **SuperNours7** dans le cadre de l’épreuve E6 du BTS SIO option SLAM.

> Projet personnel pour démontrer les compétences en développement d’application, API, gestion d’événements et interface utilisateur.
