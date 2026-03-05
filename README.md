# FamVault

FamVault is a **secure digital vault for families** to store, manage, and share important documents safely in one place.

The platform allows users to upload sensitive files such as identity documents, certificates, and financial records while ensuring **security through AES encryption and protected authentication mechanisms**.

---

# 🚀 Features

* Secure user authentication (Register / Login / Logout)
* Email verification system
* AES encrypted document storage
* Secure document upload and management
* Cloud-based storage using Cloudinary
* Mobile responsive UI
* Protected routes using JWT authentication
* Family-based document sharing
* Dashboard to manage uploaded files

---

#  Security Features

* AES encryption for file protection
* JWT-based authentication
* Secure API communication
* Protected backend routes
* Environment-based secrets management

---

# 🛠 Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

## Backend

* Node.js
* Express.js
* MongoDB

## Storage & Security

* Cloudinary (file storage)
* AES Encryption
* JWT Authentication

---

#  Project Structure

```
FamVault
│
├── frontend
│   ├── components
│   ├── pages
│   ├── context
│   └── assets
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── middlewares
│   ├── models
│   └── config
│
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```
git clone https://github.com/aman8676/FamVault.git
```

Move to the project directory

```
cd FamVault
```

---

## Backend Setup

```
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

#  Environment Variables

Create a `.env` file in the backend folder.

Example:

```
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

---

# 📱 Responsive Design

FamVault is fully **mobile responsive**, allowing users to manage and access documents from smartphones, tablets, and desktops.

---

# ☁️ Cloud Storage

Files uploaded by users are securely stored using **Cloudinary**, ensuring reliable cloud storage and fast access.

---

#  Future Improvements

* Subscription-based pricing model
* File access permissions
* Document expiry reminders
* Activity logs
* Advanced encryption layer
* Mobile application

---


