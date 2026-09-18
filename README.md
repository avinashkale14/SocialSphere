# 🌐 SocialSphere

**SocialSphere** is a full-stack social media web application where users can create profiles, share posts, upload stories, like and comment on posts, follow users, explore content, search for people, and receive notifications.

The project is built using **React.js, Node.js, Express.js, MySQL, JWT authentication, REST APIs, Cloudinary, and SCSS** with a responsive interface and dark mode support.

---

## 🚀 Live Demo

🌐 Frontend: https://socialsphere-web.vercel.app/

🔗 Backend API: https://socialsphere-1b6c.onrender.com/

---

## ✨ Features

### 👤 Authentication
- User registration
- User login and logout
- JWT-based authentication
- Protected routes
- Secure password hashing with bcrypt

### 📝 Posts
- Create posts
- Edit posts
- Delete posts
- Upload images and videos
- Like and unlike posts
- Add comments
- Delete comments
- Share post links
- View personal posts

### 📖 Stories
- Create and upload stories
- View active stories
- Story viewer
- Story view tracking
- View story viewers
- Delete stories

### 👥 Social Features
- Follow and unfollow users
- View followers and following
- User profiles
- Update profile information
- Profile and cover image support
- Search users
- Explore content
- Trending content
- Notifications
- Latest activities

### 🌙 UI & User Experience
- Light mode
- Dark mode
- Responsive design
- Desktop support
- Tablet support
- Mobile support
- Responsive navbar
- Responsive profile layout

### ☁️ Media Uploads
- Cloudinary image uploads
- Cloudinary video uploads
- Secure cloud-based media storage
- No user-uploaded media stored in the GitHub repository

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

### Database

- MySQL
- Railway MySQL

### Media Storage

- Cloudinary

### Development Tools

- VS Code
- Git
- GitHub
- Thunder Client
- XAMPP
- Nodemon

### Deployment

- Vercel — Frontend
- Render — Backend
- Railway — MySQL Database
- Cloudinary — Media Storage

---

## 🏗️ Project Structure

```text
SocialSphere/
│
├── api/
│   ├── controllers/
│   │   ├── activity.js
│   │   ├── auth.js
│   │   ├── comment.js
│   │   ├── like.js
│   │   ├── post.js
│   │   ├── relationship.js
│   │   ├── story.js
│   │   ├── trending.js
│   │   └── user.js
│   │
│   ├── routes/
│   │   ├── activities.js
│   │   ├── auth.js
│   │   ├── comments.js
│   │   ├── likes.js
│   │   ├── posts.js
│   │   ├── relationships.js
│   │   ├── stories.js
│   │   ├── trending.js
│   │   └── users.js
│   │
│   ├── connect.js
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── public/
│   ├── upload/
│   │   └── .gitkeep
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
│   │
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

---

## 🗄️ Local Database Setup

For local development, MySQL can be run using **XAMPP**.

### 1. Start MySQL

Open XAMPP and start:

```text
Apache
MySQL
```

### 2. Create the database

Open phpMyAdmin and create a database for the project.

Example:

```text
social
```

### 3. Configure environment variables

Create an `.env` file inside the `api` folder.

Example:

```env
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
```

Do not commit `.env` files or secret credentials to GitHub.

---

## ▶️ Run the Backend

From the `api` folder:

```bash
npm start
```

The backend will run on:

```text
http://localhost:8800
```

Production backend:

```text
https://socialsphere-1b6c.onrender.com
```

---

## ▶️ Run the Frontend

Open another terminal in the project root:

```bash
npm start
```

The frontend will run on:

```text
http://localhost:3000
```

---

## ☁️ Cloudinary

SocialSphere uses **Cloudinary** for storing uploaded images and videos.

Media uploads are sent through the backend and stored securely in Cloudinary instead of being stored inside the GitHub repository.

Required environment variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Never expose the Cloudinary API secret publicly.

---

## 🔐 Environment Variables

The application uses environment variables for sensitive configuration.

Example:

```env
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
```

For production, these variables are configured through the deployment platform.

**Never commit `.env` files, database passwords, JWT secrets, or Cloudinary API secrets to GitHub.**

---

## 🚀 Deployment

### Frontend

The React frontend is deployed on **Vercel**.

Production URL:

```text
https://socialsphere-web.vercel.app/
```

### Backend

The Node.js and Express.js backend is deployed on **Render**.

Production API:

```text
https://socialsphere-1b6c.onrender.com/
```

### Database

The production MySQL database is hosted on **Railway**.

### Media Storage

Images and videos are stored using **Cloudinary**.

---

## 🔄 Production Architecture

```text
                 ┌─────────────────────────┐
                 │        User Browser     │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │     React Frontend      │
                 │        Vercel           │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │   Node.js + Express     │
                 │        Render           │
                 └───────┬─────────┬───────┘
                         │         │
              ┌──────────┘         └──────────┐
              ▼                               ▼
     ┌─────────────────┐             ┌─────────────────┐
     │   MySQL         │             │   Cloudinary    │
     │   Railway       │             │ Images / Videos │
     └─────────────────┘             └─────────────────┘
```

---

## 🧪 Testing

API endpoints can be tested using:

```text
Thunder Client
```

The application was tested across:

- Desktop
- Tablet
- Mobile
- Light mode
- Dark mode
- Authentication
- Posts
- Stories
- Likes
- Comments
- Notifications
- Profiles
- Search
- Media uploads

---

## 📦 Production Build

To create an optimized production build:

```bash
npm run build
```

The production files will be generated inside:

```text
build/
```

---

## 🔗 Repository

GitHub:

https://github.com/avinashkale14/SocialSphere

---

## 👨‍💻 Developer

### Avinash Kale

**Bachelor of Computer Science**

Full Stack Developer

GitHub:

https://github.com/avinashkale14

SocialSphere:

https://github.com/avinashkale14/SocialSphere

---

## 📄 License

This project was developed for educational, portfolio, and learning purposes.
