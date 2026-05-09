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
| Log Shift + Analytics | ✅ Done | Export CSV, edit, delete, training mode |
| Supabase sync shifts | ✅ Done | Cloud sync + migration auto localStorage |
| Training mode toggle | ✅ Done | 45 NIS/h, tips cachés, toggle sur LogShift |
| Edit & delete shift | ✅ Done | Pencil pour éditer, double-tap pour supprimer |
| iOS responsive fix | ✅ Done | date/time inputs overflow corrigé |
| Cartes Vins | ✅ Done | Générales pour l'instant — à updater avec la vraie carte Soho |
| Design 2026 | ✅ Done | Redesign complet mai 2026 |
| Auth Supabase | ✅ Done | |
| Quiz generator custom | 🔄 Partiel | Catégories choisissables |
| Vraie carte des vins Soho | ⏳ À faire | Elie va l'ajouter quand il l'aura |
| Mode hors-ligne (PWA) | ⏳ À faire | |
| Multi-tenant (restaurants) | 🔮 Future | Pour la version commerciale B2B |
| Manager dashboard | 🔮 Future | Confiance, quiz scores, progression équipe |
| Invite flow (staff) | 🔮 Future | Manager crée restaurant, invite par SMS/email |

---

## ⚙️ Infos techniques

- **Repo GitHub :** `https://github.com/Elieswier/soho-mate.git`
- **Déploiement :** Lovable ("Publish your app")
- **Supabase project :** `pyqxitcvirwafmlhdeyp` (eu-north-1)
- **Données shifts :** synchro Supabase cloud (+ cache localStorage `sh_shifts`)
- **Hook central :** `src/hooks/useShifts.ts` — addShift / updateShift / deleteShift + migration auto

### Table Supabase `shifts` (déjà créée + RLS activée)
```
id bigint PK | user_id uuid FK | date text | day_of_week text
areas text[] | type text | types text[] | start_time text | end_time text
hours_worked numeric | base_pay int | tips int | total int
covers int | confidence int | notes text | created_at timestamptz
```
- RLS policy : `auth.uid() = user_id` (chaque user voit uniquement ses shifts)
- Migration auto : si remote vide + local rempli → push localStorage → Supabase au premier login

### LocalStorage keys
| Clé | Type | Usage |
|-----|------|-------|
| `sh_shifts` | Shift[] | Cache local des shifts |
| `sh_hourly_rate` | number | Taux horaire (défaut 50) |
| `sh_training_mode` | boolean | Mode formation (défaut true) |
| `sh_xp` | number | Points XP |
| `sh_streak` | number | Streak quotidien |

### Mode formation (Training Mode)
- Toggle sur LogShift : ON = 45 NIS/h, tips cachés ; OFF = taux normal + tips visibles
- `TRAINING_RATE = 45` hardcodé dans LogShift.tsx

---

## 📝 Décisions de design importantes

- Pas de rounded corners partout → **rounded-2xl** sur les cards, **rounded-xl** sur les boutons et nav items
- Palette warm beige conservée (identité du restaurant)
- Pas de dark mode pour l'instant (complexité)
- Bottom nav flottant : 5 tabs (Cards, Quiz, Scripts, Log, Insights)
- Desktop : sidebar 56px avec XP widget en bas
- `main` padding-bottom augmenté pour le nav flottant

---

## 📅 Première semaine de travail (10–16 mai 2026)

**Statut :** Waiter Trainee — **45 NIS/h, pas de tips pendant la formation**

| Jour | Date | Horaires | Heures | Trainer |
|------|------|----------|--------|---------|
| Dimanche | 10/05 | 09:00–17:00 | 8h | Zoher Dalak |
| Lundi | 11/05 | 09:00–17:00 | 8h | Sofia Amelina |
| Mardi | 12/05 | 08:00–16:00 | 8h | Mohammed Motran |
| Mercredi | 13/05 | 09:00–17:00 | 8h | Mohammed Motran |
| Jeudi | 14/05 | OFF | — | — |
| Vendredi | 15/05 | OFF | — | — |
| Samedi | 16/05 | 16:00–00:00 | 8h | Zoher Dalak |

**Total semaine 1 :** 40h × 45 NIS = **1 800 NIS** (brut, sans tips)

**Événements notables :** Fashion workshop (lun), Writer's Club (mar), Hip-Hop party (jeu), Team BBQ (sam)

> Après la période de formation : passage à **50 NIS/h + tips**

---

## 🗓️ Journal des sessions

| Date | Ce qui a été fait |
|------|-------------------|
| Avant mai 2026 | Construction complète de l'app (flashcards, quiz, XP, shifts, training plan) |
| Mai 2026 | Redesign 2026 : bento grid, glassmorphism, pill nav, animations |
| 8 mai 2026 | Récupération du contexte + création de ce fichier CONTEXT.md |
| 9 mai 2026 | Audit visuel complet (Scripts, Profile, LogShift, TrainingPlan, Flashcards, Quiz) — font-black, CTAs terracotta, rounded-2xl |
| 9 mai 2026 (soir) | Supabase sync shifts (table créée + RLS), hook useShifts.ts, delete shift, training mode toggle (45 NIS/h), edit shift (pencil icon), iOS date overflow fix, todayISO timezone fix |
| 9 mai 2026 (fin) | Vision B2B discutée — 3 rapports deep research uploadés (All Gravy audit, marché, GTM). Voir section Vision Commerciale ci-dessous. |

---

---

## 🚀 Vision Commerciale — B2B SaaS Hospitality

> *Objectif : devenir le All Gravy d'Israël, puis d'Europe.*

### Positionnement cible
**"Replace the chaos layer, not your stack"** — Soho Mate se branche à côté de Tabit/7shifts/RotaCloud sans les remplacer. Zéro migration, déploiement en 1 semaine.

### Beachhead market (segment prioritaire)
Restaurants QSR / casual dining en Israël : **50–250 employés, 5–20 sites**. Score 16/20 sur la grille ICE. Raisons : pain maximal (rotation élevée, formation chaotique), budget formation existant, décision RH centralisée.

### Concurrence analysée

| Acteur | Force | Faiblesse | Pertinence Israël |
|--------|-------|-----------|-------------------|
| **All Gravy** | Traction UK/Scandinavia, 2000+ restaurants, levée fonds | Pas en Israël, pas multilingue HE | Référence produit, pas concurrent direct |
| **Connecteam** | 200M$ levés, siège Tel Aviv, 36 000 clients | Très généraliste (non-desk workers), pas hospitality-first | Concurrent local principal |
| Beekeeper | Mobile comms | Cher, pas training | Indirect |
| Harri | HCM hospitality (US) | Pas Israël | Non concurrent |

### Ce que Soho Mate a déjà (avantage rare)
- Training interactif (flashcards + quiz) ✅
- Shift tracking avec calcul salaire ✅
- Confiance auto-déclarée par shift ✅
- XP / gamification ✅
- Auth cloud (Supabase) ✅

### Ce qui manque pour le MVP commercial (les 3 couches)
1. **Multi-tenant** : colonne `restaurant_id` sur toutes les tables de contenu, admin panel pour créer un restaurant
2. **Manager dashboard** : voir confiance équipe, scores quiz, progression, shifts
3. **Invite flow** : manager crée restaurant → invite staff par SMS/email → ils s'inscrivent sur l'app brandée

### Avantage compétitif unique d'Elie
Il *est* serveur au Soho House. Il construit l'outil pour lui-même en conditions réelles. Aucun concurrent ne peut prétendre ça. → **Case study parfait pour pitcher d'autres restaurants.**

### Roadmap commerciale
- **Phase 1 (mai–août 2026) :** Utiliser pour soi au Soho House. Logger chaque shift. Documenter les résultats (tips, confiance, erreurs).
- **Phase 2 (sept–déc 2026) :** MVP multi-tenant. Pitcher 3–5 restaurants TLV. Pricing : 10–15 NIS/employé/mois.
- **Phase 3 (2027) :** Lever des fonds ou partnership stratégique (All Gravy, Connecteam). Expansion.

### Contacts stratégiques
- **Jonatan** (CEO All Gravy, UK) — à contacter pour montrer l'app + explorer partnership
- **Adam Mikics** (Manager Soho House TLV) — premier bêta-testeur potentiel

### Documents de recherche (uploadés en session)
Les 3 rapports deep research sont dans les uploads de session. À relire avant de travailler sur le business plan :
1. **All Gravy Competitive Audit** — fonctionnalités, ICP, pricing, forces/faiblesses
2. **Market Analysis** — segmentation Israël, scoring ICE par vertical, taille marché
3. **GTM Blueprint** — 20 growth experiments ICE-scorés, messaging, canaux, pricing

---

## 💬 Comment utiliser ce fichier

**Elie :** Au début de chaque nouvelle session Cowork, dis à Claude :  
> *"Lis le CONTEXT.md dans mon projet soho-mate avant de commencer."*

**Claude :** Lis ce fichier, puis demande à Elie ce qu'il veut faire aujourd'hui. Ne pas réinventer ce qui est déjà fait. Respecter les décisions de design. Challenger Elie si une idée va dans la mauvaise direction.
