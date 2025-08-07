# 💬 Chat Application - MERN Stack Web Application

## 📌 Project Overview

A real-time Chat Application built using the **MERN stack** (MongoDB, Express, React, Node.js) styled with **Tailwind CSS**. It supports **user authentication**, **group chats**, and **instant messaging** with real-time updates via **Socket.IO**. Fully responsive with notifications and global state management using **Redux**.

---

## 🛠️ Technologies & Packages Used

- **MongoDB**: Flexible NoSQL database  
- **Express.js**: Web framework for Node.js  
- **Node.js**: Server-side JavaScript runtime  
- **React.js**: Frontend UI library  
- **Tailwind CSS**: Utility-first CSS framework  
- **Socket.IO**: Real-time communication  
- **JWT**: Secure authentication with JSON Web Tokens  
- **Redux**: State management  
- **React-Toastify**: Toast notifications  

---

## 🚀 Key Features

- 🔐 **User Authentication**: Register, login, logout  
- 💬 **1:1 & Group Chat**: Real-time messaging  
- 🔔 **Notifications**: Sound and visual alerts  
- 🛠️ **Admin Controls**: Add/remove users in group chats  
- 📱 **Responsive UI**: Built with Tailwind CSS  
- ⚛️ **Redux for State Management**

---

## 🧩 How to Install

### 1. 📥 Clone the Repository

```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app
```

### 2. 📦 Install Dependencies

**Frontend:**

```bash
cd frontend
npm install
```

**Backend:**

```bash
cd ../backend
npm install
```

### 3. ⚙️ Set Up Environment Variables

Create a `.env` file in both `frontend` and `backend` directories.

**Frontend `.env`:**

```env
VITE_BACKEND_URL=http://localhost:9000
```

**Backend `.env`:**

```env
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/chat-app
PORT=9000
JWT_SECRET=your-secret-key
```

---

### 4. ▶️ Run the Application

**Using concurrently:**

```bash
npx concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

**Alternatively:**

**Terminal 1 - Backend**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**

```bash
cd frontend
npm run dev
```

---

## 🌐 Open in Browser

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🙏 Thank You

Thanks for checking out this Chat App!  
If you find it useful or have suggestions, feel free to **open an issue** or **contribute**. 😊