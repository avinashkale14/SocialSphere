# 🌐 SocialSphere

**SocialSphere** is a full-stack social media web application where users can create profiles, share posts, upload stories, like and comment on posts, follow users, explore content, and receive notifications.

The project was built using React.js, Node.js, Express.js, MySQL, JWT authentication, REST APIs, file uploads, responsive UI, and dark mode.

---

## ✨ Features

### 👤 Authentication
- User registration
- Login and logout
- JWT-based authentication
- Protected routes

### 📝 Posts
- Create, edit and delete posts
- Upload images and videos
- Like and unlike posts
- Add and delete comments
- Share post links

### 📖 Stories
- Create and upload stories
- View active stories
- Story views
- View story viewers
- Delete stories

### 👥 Social Features
- Follow and unfollow users
- View followers and following
- User profiles
- Profile and cover image updates
- Notifications
- Explore content
- Trending content

### 🌙 UI & Experience
- Light and dark mode
- Responsive design
- Desktop, tablet and mobile support

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- React Query
- SCSS
- Material UI
- Axios

### Backend
- Node.js
- Express.js
- REST API
- JWT
- bcrypt
- Multer
- CORS

### Database
- MySQL

### Tools
- VS Code
- Git
- GitHub
- Thunder Client
- XAMPP
- Nodemon

---

## 🏗️ Project Structure

```text
SocialSphere/
│
├── api/
│   ├── controllers/
│   ├── routes/
│   ├── connect.js
│   └── index.js
│
├── public/
│   ├── upload/
│   ├── favicon.png
│   ├── index.html
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   ├── comments/
│   │   ├── leftbar/
│   │   ├── navbar/
│   │   ├── posts/
│   │   ├── rightbar/
│   │   ├── share/
│   │   └── stories/
│   │
│   ├── context/
│   ├── pages/
│   │   ├── home/
│   │   ├── login/
│   │   ├── notifications/
│   │   ├── profile/
│   │   └── register/
│   │
│   ├── utils/
│   ├── App.jsx
│   ├── axios.js
│   ├── index.js
│   └── style.scss
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/avinashkale14/SocialSphere.git
```

### 2. Navigate to the project

```bash
cd SocialSphere
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Install backend dependencies

```bash
cd api
npm install
```

### 5. Setup MySQL

Start **Apache** and **MySQL** from XAMPP.

Open phpMyAdmin and create a database named:

```text
social
```

Configure the database connection in:

```text
api/connect.js
```

### 6. Start the backend

```bash
npm start
```

Backend:

```text
http://localhost:8800
```

### 7. Start the frontend

Open another terminal in the project root:

```bash
npm start
```

Frontend:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

For production, database credentials and JWT secrets should be stored in environment variables.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=social

JWT_SECRET=your_secret_key
```

Never commit `.env` files to GitHub.

---

## 🚀 Production Build

Create a production build using:

```bash
npm run build
```

The production files will be generated in:

```text
build/
```

---

## 👨‍💻 Developer

### Avinash Kale

**Bachelor of Computer Science**

Full Stack Developer

GitHub:  
https://github.com/avinashkale14

SocialSphere Repository:  
https://github.com/avinashkale14/SocialSphere

---

## 📄 License

This project was developed for educational, portfolio, and learning purposes.