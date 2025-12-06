# 🕸️ Sociograph v1.3

**Sociograph** est un outil interactif de visualisation de graphes sociaux (sociogrammes). Il permet de cartographier les affinités au sein d'un groupe, de visualiser les connexions et d'organiser automatiquement les individus grâce à un moteur physique intelligent.

🔗 **Démo en ligne :** [ https://joyxt.github.io/Sociograph/]
*(Exemple : https://joyxt.github.io/Sociograph/)*

<img width="1440" height="875" alt="image" src="https://github.com/user-attachments/assets/df9588a9-4069-477b-baf1-ab2b5e5f3668" />


## ✨ Nouvelles Fonctionnalités (v1.3)

* **🟦 Sélection Multiple (Nouveau)** : Basculez en mode "Sélection" pour encadrer plusieurs individus et les déplacer en groupe.
* **🖱️ Navigation Intuitive** : Choisissez entre le mode "Panoramique" (pour bouger la carte) et le mode "Sélection" (pour agir sur les boîtes).
* **🖱️ Navigation Intuitive** : CTRL roulette pour zoomer et dezoomer.
* **⚛️ Physique Améliorée** : L'algorithme d'organisation regroupe désormais les individus connectés de manière plus compacte.

## 🚀 Fonctionnalités Principales

* **Import Rapide** : Chargez une liste de noms depuis un simple fichier texte (`.txt`).
* **Connexions Drag & Drop** : Reliez les personnes en tirant un trait du point rouge (sortie) vers le point vert (entrée).
* **Gestion de la Saturation** :
    * **Visuel** : Un halo rouge apparaît automatiquement autour d'une personne recevant 5 connexions ou plus.
    * **Physique** : Les liens vers une personne saturée deviennent plus courts pour visualiser la pression sociale.
* **Sauvegarde Complète** : Exportez/Importez vos travaux au format `.sog` (JSON) pour ne rien perdre.

---

## 📖 Guide d'Utilisation

### 1. Démarrer un projet
* Cliquez sur **"Importer Liste (.txt)"**.
* Sélectionnez un fichier texte contenant une liste de noms (un nom par ligne).
    * *Un fichier exemple `Liste_NomPrenom.txt` est fourni à la racine de ce dépôt pour tester.*

### 2. Modes de Navigation (Nouveau !)
En haut à droite du panneau de contrôle, un bouton permet de changer d'outil :

* ✋ **Mode Panoramique (Hand)** :
    * Cliquez et glissez sur le fond blanc pour vous déplacer dans le sociogramme.
    * Utilisez la molette + CTRL pour zoomer/dézoomer.
* ↖️ **Mode Sélection (Cursor)** :
    * Cliquez et glissez sur le fond pour dessiner un **rectangle bleu**.
    * Toutes les boîtes touchées sont sélectionnées.
    * Déplacez l'une des boîtes pour bouger tout le groupe sélectionné en même temps.

### 3. Créer des liens
* Cherchez le **point rouge** à droite d'une boîte (Émetteur).
* Maintenez le clic et glissez vers le **point vert** à gauche d'une autre boîte (Récepteur).
* Pour supprimer un lien : Cliquez dessus (il devient noir) et appuyez sur la touche `Suppr` (ou `Backspace`).

### 4. Organiser (Auto-Layout)
* Si le graphe est désordonné, cliquez sur **"Organiser (Physique)"**.
* Les boîtes s'animeront pour trouver leur place optimale : les groupes connectés se rapprochent, les isolés s'écartent.

---
💻 Technologies
Ce projet utilise des technologies modernes pour assurer performance et fluidité :

React : Interface utilisateur.

React Flow : Moteur de rendu des nœuds et des liens.

D3-Force : Algorithme de simulation physique pour l'agencement.

Zustand : Gestion d'état global ultra-rapide.

Vite : Outil de build et serveur de développement.

TailwindCSS : Design et mise en page.

Lucide React : Icônes vectorielles.

Auteur : [JoyXt]

## 🛠️ Installation (Pour les développeurs)

Si vous souhaitez installer le projet sur votre machine pour le modifier :

### Prérequis
* [Node.js](https://nodejs.org/) (Version LTS recommandée).

### Installation
```bash
# 1. Cloner le dépôt
git clone [https://github.com/Joyxt/Sociograph.git](https://github.com/Joyxt/Sociograph.git)

# 2. Aller dans le dossier
cd Sociograph

# 3. Installer les dépendances (React, Vite, D3...)
npm install
