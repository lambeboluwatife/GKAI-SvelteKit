# 🎮 GKAI — Getting Killed & Injured (Multiplayer Logic Engine)

GKAI is a turn-based multiplayer logic game inspired by number deduction systems (similar to Mastermind-style mechanics).  
It is designed as a real-time competitive guessing system where two players attempt to deduce each other’s secret number sequence using structured feedback.

The project focuses heavily on **game logic design, backend correctness, and scalable state management**.

---

## 🧠 Core Concept

Each player generates a **hidden 4-digit number (1–9, no repetition)**.  
Players take turns guessing the opponent’s number.

After each guess, the system returns:

- **Killed** → correct digit in the correct position  
- **Injured** → correct digit in the wrong position  

The game continues until a player correctly guesses all digits in the right order.

---

## 🚀 System Architecture Overview

GKAI was designed with separation of concerns in mind:

- **Frontend:** Handles game UI, user interaction, and real-time feedback rendering  
- **Backend:** Responsible for game logic, validation, and state updates  
- **Database:** Stores users, game sessions, and move history for persistence  

This allows players to resume games and track performance over time.

---

## ⚙️ Tech Stack

**Frontend**
- Svelte
- Tailwind CSS
- State management (React Hooks)

**Backend**
- Node.js
- Express.js
- REST API architecture

**Database**
- MongoDB (Mongoose)

**Other Tools**
- JWT Authentication
- Git Version Control

---

## 🎯 Key Features

- 🎲 Fully functional turn-based multiplayer system  
- 🧮 Advanced “Killed & Injured” evaluation algorithm  
- 💾 Persistent game state (resume unfinished games)  
- 📊 Move tracking for each player per session  
- 🔐 Secure authentication system  
- ⚡ Real-time feedback after every guess  
- 🧠 Anti-cheat validation for inputs (no duplicates, correct format enforcement)

---

## 🧩 Technical Highlights

### 🧠 Core Game Logic Engine
The most critical part of GKAI is the evaluation algorithm that compares:
- Player guess vs secret number
- Position accuracy (Killed)
- Value-only accuracy (Injured)

This ensures deterministic and fair scoring across all sessions.

---

### 🗄️ Persistent Game State Design
Each game session stores:
- Players involved
- Secret numbers (hashed/secured where applicable)
- All moves history
- Game status (ongoing / completed)

This enables:
- Resume functionality
- Replay analysis
- Performance tracking

---

### 🔁 API Design Approach
Built around clean REST principles:
- `/game/start` → initializes session
- `/game/move` → processes guesses
- `/game/state/:id` → retrieves current state

---

## 📊 What I Learned

- Designing deterministic game logic systems  
- Managing real-time state transitions in multiplayer environments  
- Structuring backend systems for replayable sessions  
- Handling edge-case validation in competitive systems  
- Building scalable API-driven applications  

---

## 🚧 Future Improvements

- 🔴 Real-time multiplayer (WebSockets)
- 🏆 Leaderboard system with ranking algorithm
- 📈 Analytics dashboard (win rate, efficiency score)
- 🤖 AI opponent mode
- 🎮 Matchmaking system

---

## 🔗 Live Demo
👉 https://gkai-svelte-kit.vercel.app/

## 🔗 Repository
👉 https://github.com/lambeboluwatife/GKAI-SvelteKit
