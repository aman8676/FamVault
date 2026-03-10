
# 🔐 FamVault

**FamVault** is a secure family document vault that allows family members to safely store, manage, and share important documents within a private family group.

The platform ensures **privacy, security, and controlled access** using **AES encryption, JWT authentication, and role-based permissions**.

FamVault helps families keep important documents like **IDs, certificates, insurance papers, and legal documents** in one centralized and secure location.

---

# 🚀 Features

### 👨‍👩‍👧‍👦 Family Management

* Create a family vault
* Add family members
* Remove family members
* Admin-controlled family access

### 📂 Document Management

* Upload important documents
* Secure document storage
* View documents within family
* Delete documents

### 🔐 Security

* **AES Encryption** for sensitive data protection
* **JWT Authentication** for secure login
* **Role-based access control**
* Only authorized family members can access documents

### ☁️ Cloud Storage

* Documents stored securely using **Cloudinary**
* Automatic deletion from cloud when documents are removed

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Cloud Storage

* Cloudinary

## Security

* AES Encryption
* JWT Authentication

---

# 📂 Project Structure

```
famVault
│
├── client                # React frontend
│
├── server
│   ├── controllers       # Business logic
│   ├── models            # MongoDB models
│   ├── routes            # API routes
│   ├── middleware        # Authentication middleware
│   ├── utils             # Encryption utilities
│   │    └── encryption.js
│   └── config
│
├── .env
├── package.json
└── README.md
```

---

# ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/famVault.git
```

### 2️⃣ Navigate to the project folder

```bash
cd famVault
```

### 3️⃣ Install dependencies

```bash
npm install
```

### 4️⃣ Run the development server

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory.

```
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

AES_SECRET_KEY=your_encryption_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# 🔐 AES Encryption

FamVault uses **AES (Advanced Encryption Standard)** to protect sensitive information.

Sensitive data is encrypted before being stored in the database and can only be decrypted by authorized users through the application.

This ensures an additional layer of **security and privacy for family documents**.

---

# 🔑 Authentication

FamVault uses **JWT (JSON Web Token)** for secure authentication.

### Workflow

1. User logs in
2. Server generates a JWT token
3. Token is returned to the client
4. Client sends the token in future requests
5. Middleware verifies the token before granting access

---

# 📌 Future Improvements

* Document version history
* Document expiry reminders
* Email notifications
* Activity logs
* Mobile responsive UI improvements
* Multi-family vault support

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

# 📄 License

This project is licensed under the **MIT License**.
