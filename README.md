# AI-Assisted Journal System

## Overview

The **AI-Assisted Journal System** is a full-stack web application that allows users to record their personal reflections after completing immersive nature sessions such as **forest**, **ocean**, or **mountain** environments.

The system uses a **Large Language Model (LLM)** to analyze the emotional tone of journal entries and generate insights about the user's mental state over time.

This project demonstrates practical implementation of:

* RESTful API design
* Full-stack integration (React + Node.js)
* LLM-based emotion analysis
* Data modeling with MongoDB
* Insight generation from user data

---

## Features

### 1. Journal Entry Creation

Users can write a journal entry after completing a session.

Each entry contains:

* User ID
* Selected ambience (forest, ocean, mountain)
* Journal text
* Timestamp

Entries are stored securely in MongoDB.

---

### 2. Emotion Analysis using LLM

The system analyzes journal text using an **LLM** to extract:

* **Emotion** (calm, happy, stressed, reflective, etc.)
* **Keywords** from the entry
* **Summary** of the user's experience

Example output:

```json
{
  "emotion": "calm",
  "keywords": ["rain", "nature", "peace"],
  "summary": "User experienced relaxation during the forest session"
}
```

---

### 3. Journal History

Users can view all previously written entries along with their emotional analysis.

---

### 4. Insights Dashboard

The system generates insights from historical journal data, including:

* Total number of entries
* Most frequent emotion
* Most used ambience
* Recent keywords

Example output:

```json
{
  "totalEntries": 8,
  "topEmotion": "calm",
  "mostUsedAmbience": "forest",
  "recentKeywords": ["focus","nature","rain"]
}
```

These insights help visualize emotional patterns over time.

---

## Tech Stack

### Frontend

* React
* Axios
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose ODM

### LLM Integration

* Google Gemini API

### Optional Enhancements

* Redis caching
* Rate limiting
* Docker deployment

---

## Project Architecture

The application follows a **client-server architecture**.

1. The **React frontend** allows users to submit journal entries and view insights.
2. The **Node.js backend** handles API requests.
3. **MongoDB** stores journal data.
4. The **LLM service** analyzes journal text and returns emotional insights.

Flow:

```
React Frontend
      |
      v
Express API Server
      |
      |---- MongoDB Database
      |
      |---- LLM Service (Gemini)
```

---

## Folder Structure

```
ai-journal-system
│
├── backend
│
│   ├── config
│   │   └── db.js
│
│   ├── models
│   │   └── Journal.js
│
│   ├── controllers
│   │   └── journalController.js
│
│   ├── routes
│   │   └── journalRoutes.js
│
│   ├── services
│   │   └── llmService.js
│
│   ├── utils
│   │   └── cache.js
│
│   ├── middleware
│   │   └── rateLimiter.js
│
│   ├── server.js
│   └── package.json
│
├── frontend
│
│   ├── src
│   │
│   │   ├── components
│   │   │   ├── JournalForm.jsx
│   │   │   ├── JournalList.jsx
│   │   │   └── Insights.jsx
│   │
│   │   ├── api
│   │   │   └── api.js
│   │
│   │   ├── App.js
│   │   └── main.jsx
│
├── README.md
└── ARCHITECTURE.md
```

---

## API Endpoints

### Create Journal Entry

POST /api/journal

Request:

```json
{
  "userId": "123",
  "ambience": "forest",
  "text": "I felt calm today after listening to the rain."
}
```

Response:

```
Journal entry stored successfully
```

---

### Get User Journal Entries

GET /api/journal/:userId

Returns all entries written by the user.

---

### Analyze Journal Emotion

POST /api/journal/analyze

Request:

```json
{
  "text": "I felt calm today after listening to the rain"
}
```

Response:

```json
{
  "emotion": "calm",
  "keywords": ["rain","nature","peace"],
  "summary": "User experienced relaxation during the forest session"
}
```

---

### Get Insights

GET /api/journal/insights/:userId

Returns emotional insights calculated from journal history.

---

## Installation Guide

### 1. Clone the Repository

```
git clone https://github.com/yourusername/ai-journal-system.git
```

```
cd ai-journal-system
```

---

### 2. Backend Setup

```
cd backend
```

Install dependencies

```
npm install
```

Create environment file:

```
.env
```

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection
GEMINI_API_KEY=your_api_key
```

Run backend server:

```
npm start
```

Server will run at:

```
http://localhost:5000
```

---

### 3. Frontend Setup

Open another terminal.

```
cd frontend
```

Install dependencies

```
npm install
```

Run frontend

```
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## Example Workflow

1. User writes a journal entry
2. Entry is stored in MongoDB
3. User clicks "Analyze"
4. Backend sends journal text to LLM
5. Emotion, keywords, and summary are returned
6. Insights API aggregates historical data

---

## Error Handling

The backend includes:

* Validation for missing inputs
* Proper HTTP status codes
* LLM API error handling
* Database connection error handling

---

## Security Considerations

To protect sensitive journal data:

* HTTPS should be used in production
* Environment variables store API keys
* Input validation prevents malicious requests
* Rate limiting protects APIs from abuse

---

## Future Improvements

Potential enhancements include:

* User authentication with JWT
* Sentiment trend visualization graphs
* Redis caching for repeated LLM analysis
* Real-time streaming responses
* Mobile-friendly UI
* Advanced emotion analytics

---

## Evaluation Criteria Addressed

This implementation focuses on:

* Clean backend API design
* Structured code organization
* Proper LLM integration
* Efficient data modeling
* Functional frontend interface
* Clear documentation

---

## Author

Developed as part of a **Full Stack Developer internship assignment**.

The project demonstrates practical implementation of **AI-powered journaling and emotional insight generation using modern web technologies**.
