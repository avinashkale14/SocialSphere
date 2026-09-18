# 🌐 SocialSphere

**SocialSphere** is a full-stack social media web application built with **React.js, Node.js, Express.js, MySQL, JWT, Cloudinary, and SCSS**.

Users can create profiles, share posts and stories, follow users, like and comment on posts, search users, explore content, and receive notifications.

---

## 🚀 Live Demo

🌐 **Frontend:** https://socialsphere-web.vercel.app/

🔗 **Backend API:** https://socialsphere-1b6c.onrender.com/

---

## ✨ Features

- 👤 User registration, login & logout
- 🔐 JWT authentication & protected routes
- 📝 Create, edit & delete posts
- ❤️ Like & unlike posts
- 💬 Add & delete comments
- 📖 Create, view & delete stories
- 👁️ Story views & viewers
- 👥 Follow & unfollow users
- 🔔 Notifications & activities
- 🔍 Search users
- 📈 Trending content
- 👤 User profiles
- 🖼️ Profile & cover images
- ☁️ Cloudinary image & video uploads
- 🌙 Light & dark mode
- 📱 Responsive desktop, tablet & mobile UI

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- React Query
- Axios
- SCSS
- Material UI

### Backend
- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt
- Multer
- CORS
- Cookie Parser

### Database & Storage
- MySQL
- Railway
- Cloudinary

### Deployment
- Vercel — Frontend
- Render — Backend
- Railway — Database
- Cloudinary — Media Storage

### Tools
- VS Code
- Git & GitHub
- Thunder Client
- XAMPP
- Nodemon

---

## 🏗️ Project Structure

~~~text
SocialSphere/
│
├── api/
│   ├── controllers/
│   ├── routes/
│   ├── connect.js
│   ├── index.js
│   └── package.json
│
├── public/
│   ├── upload/
│   │   └── .gitkeep
│   ├── favicon.png
│   └── index.html
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
├── .vercelignore
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
~~~

---

## ⚙️ Installation

### Clone Repository

~~~bash
git clone https://github.com/avinashkale14/SocialSphere.git
cd SocialSphere
~~~

### Install Frontend Dependencies

~~~bash
npm install
~~~

### Install Backend Dependencies

~~~bash
cd api
npm install
~~~

---

## 🔐 Environment Variables

Create a `.env` file inside the `api` folder:

~~~env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=social

JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
~~~

**Never commit `.env` files, database passwords, JWT secrets, or Cloudinary secrets to GitHub.**

---

## 🗄️ Database Setup

1. Open XAMPP.
2. Start **Apache** and **MySQL**.
3. Open phpMyAdmin.
4. Create the required MySQL database.
5. Configure the database credentials in `.env`.

---

## ▶️ Run the Project

### Backend

~~~bash
cd api
npm start
~~~

Local backend:

~~~text
http://localhost:8800
~~~

Production backend:

~~~text
https://socialsphere-1b6c.onrender.com/
~~~

### Frontend

Open another terminal in the project root:

~~~bash
npm start
~~~

Local frontend:

~~~text
http://localhost:3000
~~~

---

## ☁️ Cloudinary

SocialSphere uses **Cloudinary** for secure image and video storage.

Uploaded media is stored in Cloudinary instead of the GitHub repository.

This keeps user-uploaded files separate from the project source code.

---

## 🚀 Deployment

~~~text
Frontend  → Vercel
Backend   → Render
Database  → Railway
Media     → Cloudinary
~~~

The React frontend communicates with the production Express API through Vercel routing.

---

## 🔒 Security

- JWT authentication
- HTTP-only authentication cookies
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Environment variables for secrets
- No database credentials in source code
- No uploaded media committed to GitHub

---

## 📱 Responsive Design

SocialSphere is designed for:

- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

The responsive interface includes navigation, profiles, posts, stories, search, notifications, and dark mode.

---

## 🧪 Testing

The application was tested for:

- Authentication
- Posts
- Likes
- Comments
- Stories
- Notifications
- Profiles
- Search
- Media uploads
- Dark mode
- Responsive layouts
- Production deployment

API testing was performed using **Thunder Client**.

---

## 📦 Production Build

Create an optimized production build using:

~~~bash
npm run build
~~~

The production files are generated inside:

~~~text
build/
~~~

---

## 🔗 Repository

GitHub:

https://github.com/avinashkale14/SocialSphere

---

## 👨‍💻 Developer

### Avinash Kale

**Bachelor of Computer Science**  
**Full Stack Developer**

GitHub:  
https://github.com/avinashkale14

---

## 📄 License

This project was developed for **educational, portfolio, and learning purposes**.

---

⭐ **If you like SocialSphere, feel free to star the repository!**
