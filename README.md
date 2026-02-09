# 🤖 AI Expense Tracker

A full-stack expense tracking app that uses AI to parse natural language input into structured expense data.

**Built by:** Chirag Goel  
**GitHub:** Link to be added
**Time to build:** ~1 hour with AI assistance  

---

## 🎥 Demo

[📹 Watch Demo Video](link-to-your-recording)

**Quick Preview:**
- Type: "uber to office 350 rupees"
- AI automatically categorizes as Transport
- Real-time expense tracking with beautiful UI

---

## ✨ Features

✅ **Natural Language Processing** - Just type expenses naturally  
✅ **AI-Powered Categorization** - Automatically sorts into 8 categories  
✅ **Real-time Updates** - Instant feedback on additions  
✅ **Persistent Storage** - SQLite database  
✅ **Beautiful UI** - Modern, polished React Native interface  
✅ **Error Handling** - Graceful handling of edge cases  
✅ **Pull-to-Refresh** - Easy data reloading  
✅ **Delete Confirmation** - Prevent accidental deletions  

---

## 🛠️ Tech Stack

### Frontend (Mobile)
- **React Native** with Expo
- **TypeScript** for type safety
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** throughout
- **SQLite** with better-sqlite3
- **Groq API** for AI parsing (llama-3.3-70b-versatile)

### Architecture
- RESTful API design
- Clean separation of concerns
- Service-layer pattern
- Type-safe database operations

---

## 🚀 Quick Start

### Prerequisites
```bash
node --version  # v18+ required
npm --version   # v9+ required
```

### 1. Clone Repository
```bash
git clone GithubUrl
cd ai-expense-tracker
```

### 2. Get Free Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up (completely free, no credit card)
3. Create API Key
4. Copy the key (starts with `gsk_...`)

### 3. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables

cp .env.example .env
# Edit .env and add your Groq API key:
# GROQ_API_KEY=gsk_your_actual_key_here

# Start backend server
npm start
```

**You should see:**

🚀 Server running on http://localhost:3000
✅ Database initialized

### 4. Setup Mobile App

Open a **new terminal**:
```bash
cd mobile

# Install dependencies
npm install

# Start Expo
npm start
```

## 🤖 AI Prompt Design


- Parses natural language into structured JSON
- Categorizes into 8 predefined categories
- Temperature: 0.1 for consistency
- Validates all outputs

- Categories: 
    🍔 Food & Dining | 🚗 Transport | 🛒 Shopping | 📺 Entertainment 📄 Bills & Utilities | 💊 Health | ✈️ Travel | 📦 Other

## 📁 Structure

```bash
ai-expense-tracker/
├── backend/src/     # API: routes, services, database
│   └── .env        # Groq API key here
└── mobile/src/     # UI: screens, components, services
```

## 🎯 Development
Time Breakdown: Setup (10m) • Database (10m) • AI Service (15m) • API (10m) • Mobile UI (20m) • Testing (10m)
AI Assistance: ~70% (boilerplate, types, components, error handling)
Key Learnings: Specific prompts work best, request error handling upfront, iterate fast


## 📧 Contact
Chirag Goel • GitHub: @chiraggoelcg

## 📜 License
MIT

Built with Claude AI in under 1 hour 🚀