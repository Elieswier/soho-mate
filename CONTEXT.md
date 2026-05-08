# 🧠 Soho Mate — Contexte Projet (à lire au début de chaque session)

> **Pour Claude :** Lis ce fichier en entier avant toute chose. Il contient tout le contexte du projet, la vision, les décisions prises, et l'état actuel. Ne pas supposer — lire d'abord.

---

## 👤 Qui est Elie

**Elie Swierczynski** (אלי סווירזינסקי)  
- Commence comme **runner/waiter au Soho House Tel Aviv-Jaffa** (Yefet Street 27, Jaffa)
- Date de début : **samedi 10 mai 2026**
- Manager : **Adam Mikics**
- Salaire : **50 NIS/heure + tips**
- Background : marketing/tech (pas dev) — travaille avec Claude pour construire l'app
- Email : swierczynski.elie@gmail.com

---

## 🏠 C'est quoi Soho Mate

Une **web app de formation et de suivi de shifts** construite avec **React + Supabase**, déployée sur **Lovable** (`soho-mate.lovable.app`), liée à **GitHub**.

Conçue initialement pour Elie lui-même — pour apprendre le menu, tracker ses shifts, et exceller dans son job.

**Stack :** React, TypeScript, Tailwind CSS, Supabase, shadcn/ui, Recharts, React Router v6, Vite

---

## ✅ Ce qui est déjà construit

### Flashcards
- 57 cartes : menu complet, Soho Story, Soho TLV, service floor
- Modes : The Menu / The House / Wine / The Floor / Full House
- Système de rating : Again / Almost / Got it
- XP gagné selon la performance
- Flip animé, swipe tactile, multi-langue (EN / FR / HE)

### Quiz
- 75 questions en 4 catégories : menu, allergènes, soho-story, wine
- Mode personnalisable (choix de catégories)
- Difficulté 1-3 avec XP différencié
- Résultats avec copy rotatif (ex: "Adam will be impressed")

### Scripts
- Scripts de service standards (upsell, accueil, etc.)

### Log Shift
- Log date, horaires, zone (Indoor/Pool/Garden), type (Lunch/Dinner/Event)
- Calcul auto salaire : heures × 50 NIS + tips
- Niveau de confiance (1-10)
- Export CSV

### Insights
- Stats : total gagné, tip moyen, nombre de shifts
- Meilleur jour, meilleure zone
- Charts : earnings par jour, par zone, trend confiance (Recharts)
- Onglet Training Plan

### Training Plan ("The RunWay")
- Plan sur 7 jours avec drills quotidiens
- Connecté aux flashcards et quiz
- Progression trackée localement

### Système XP & Gamification
- XP différencié par difficulté de carte
- Rangs progressifs
- Streak quotidien 🔥
- Daily bonus
- Achievements (Card Master, etc.)
- Flash "+XP" animé

### Auth
- Login Supabase

### Design System
- Police : DM Sans (body) + Cormorant Garamond (titres serif)
- Palette warm beige : bg `#FAF8F5`, surface `#F0EAE0`, text `#1A1A1A`, muted `#6B6560`
- Accent : `#C4A882` (or chaud)
- **Redesign 2026 appliqué** (mai 2026) :
  - Bottom nav flottant glassmorphique (pill avec backdrop-blur)
  - Sidebar avec pill active state + XP widget carte arrondie
  - Header mobile glassmorphique
  - Bento grid avec shadows + hover lift + rounded-2xl
  - Animations spring (cubic-bezier 0.16,1,0.3,1)
  - Progress bars dégradées (or → noir)

---

## 🎯 Vision long terme

> *"Devenir le All Gravy d'Israël — puis l'Europe."*

**Phase 1 :** Utiliser l'app pour soi-même au Soho House. Exceller. Documenter.  
**Phase 2 :** Avoir un MVP + Case Study au Soho House.  
**Phase 3 :** Pitcher à d'autres restaurants TLV, puis Israël.  
**Phase 4 :** Lever des fonds ou rejoindre un acteur existant (ex: All Gravy).

**Insight marché :** En Israël, chaque jour un nouveau waiter commence sans structure. Pas de formation, juste "shadow quelqu'un". Les salaires viennent surtout des tips — donc être excellent rapporte directement. Soho Mate donne la structure qui manque.

**Compétition étudiée :** All Gravy (UK) — app RH pour l'hospitality. Elie veut contacter **Jonatan** (CEO All Gravy) pour lui montrer l'app.

**Futur produit :** Super CRM avec onboarding intégré pour employees — "le nouveau Tabit mais avec onboarding".

---

## 📋 Roadmap / État des features

| Feature | Statut | Notes |
|---------|--------|-------|
| Flashcards complètes | ✅ Done | 57 cartes |
| Quiz 75 questions | ✅ Done | 4 catégories |
| Système XP | ✅ Done | Difficulté différenciée |
| Training Plan | ✅ Done | Connecté flashcards/quiz |
| Log Shift + Analytics | ✅ Done | Export CSV |
| Cartes Vins | ✅ Done | Générales pour l'instant — à updater avec la vraie carte Soho |
| Design 2026 | ✅ Done | Redesign complet mai 2026 |
| Auth Supabase | ✅ Done | |
| Quiz generator custom | 🔄 Partiel | Idée : choisir les catégories à mixer |
| Vraie carte des vins Soho | ⏳ À faire | Elie va l'ajouter quand il l'aura |
| Mode hors-ligne | ⏳ À faire | |
| Multi-restaurant | 🔮 Future | Pour la version commerciale |

---

## ⚙️ Infos techniques

- **Repo GitHub :** lié à Lovable
- **Déploiement :** Lovable ("Publish your app")
- **Données :** stockées en localStorage (pas de sync cloud pour les shifts)
- **Supabase :** utilisé pour l'auth uniquement pour l'instant

---

## 📝 Décisions de design importantes

- Pas de rounded corners partout → **rounded-2xl** sur les cards, **rounded-xl** sur les boutons et nav items
- Palette warm beige conservée (identité du restaurant)
- Pas de dark mode pour l'instant (complexité)
- Bottom nav flottant : 5 tabs (Cards, Quiz, Scripts, Log, Insights)
- Desktop : sidebar 56px avec XP widget en bas
- `main` padding-bottom augmenté pour le nav flottant

---

## 🗓️ Journal des sessions

| Date | Ce qui a été fait |
|------|-------------------|
| Avant mai 2026 | Construction complète de l'app (flashcards, quiz, XP, shifts, training plan) |
| Mai 2026 | Redesign 2026 : bento grid, glassmorphism, pill nav, animations |
| 8 mai 2026 | Récupération du contexte + création de ce fichier CONTEXT.md |

---

## 💬 Comment utiliser ce fichier

**Elie :** Au début de chaque nouvelle session Cowork, dis à Claude :  
> *"Lis le CONTEXT.md dans mon projet soho-mate avant de commencer."*

**Claude :** Lis ce fichier, puis demande à Elie ce qu'il veut faire aujourd'hui. Ne pas réinventer ce qui est déjà fait. Respecter les décisions de design. Challenger Elie si une idée va dans la mauvaise direction.
