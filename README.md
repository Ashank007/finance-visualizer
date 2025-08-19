# 💸 Finance Visualizer

A modern personal expense tracker built with React + TypeScript (frontend) and Express + MongoDB (backend).
It helps users add, view, and analyze transactions with a clean dashboard UI, category charts, and monthly spending trends.


## 🚀 Features

- 📊 Dashboard with charts (category-wise & monthly trends)

- 📝 Transaction Management (Add, View, List)

- ⚡ REST API with Express + MongoDB

- 🎨 Modern UI with Tailwind CSS

- 🐳 Dockerized Setup for easy deployment

- 🔗 Fully integrated using docker-compose (Frontend + Backend + MongoDB)

## 🛠️ Tech Stack

- Frontend → React, TypeScript, Tailwind CSS, Vite

- Backend → Node.js, Express.js, MongoDB

- Database → MongoDB

- Deployment → Docker & docker-compose

## 📂 Folder Structure
```
├── api/                  # Backend (Express + MongoDB)
│   ├── config/           # DB connection
│   ├── controllers/      # Business logic
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── index.js          # Entry point
│   └── Dockerfile
├── client/               # Frontend (React + TS + Vite)
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Different pages (Dashboard, Charts, Transactions)
│   │   └── main.tsx
│   ├── index.html
│   └── Dockerfile
├── docker-compose.yaml   # Runs frontend + backend + MongoDB
└── README.md
```
## 1) 🐳 Run with Docker
#### 1️⃣ Clone the repo
```
git clone https://github.com/Ashank007/finance-visualizer.git
cd finance-visualizer
```
#### 2️⃣ Start all services (frontend + backend + db)
```
docker-compose up --build
```
#### 3️⃣ Access the app

- 🌐 Frontend → http://localhost:5173

- ⚙️ Backend API → http://localhost:3001/api

- 🗄️ MongoDB → mongodb://localhost:27017/finance

## 2) 🚀 Running Without Docker

#### 1️⃣ Backend (API)
```
cd api
npm install
npm start
```
By default backend will be on:
👉 http://localhost:3001

#### 2️⃣ Frontend (Client)
```
cd client
npm install
npm run dev
```
By default frontend will be on:
👉 http://localhost:5173

#### 3️⃣ MongoDB Setup
Install MongoDB locally and create a new database (e.g. expense_db).
Inside the api/ folder, create a .env file and add the following:
```
MONGO_URI=mongodb://localhost:27017/expense_db
```

## ⚡ API Routes

```
Method	Endpoint	            Description
POST	/api/transactions	    Add a new transaction
GET	    /api/transactions	    Get all transactions
DELETE	/api/transactions/:id   Delete a Transaction
```
## 🤝 Contributing

- Fork this repo

- Create a feature branch (feature/awesome-feature)

- Commit & push your changes

- Open a Pull Request 🚀

## 📝 License

This project is licensed under the MIT License.
