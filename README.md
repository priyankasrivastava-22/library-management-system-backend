# Library Management System - Backend

*This is the backend service for the Library Management System (LMS), built using Node.js, Express, and MySQL.*
*It handles authentication, book management, transactions (issue/return), user management, and system operations through REST APIs.*

---

## 1. Features

### Authentication
- User Registration
- User Login
- JWT-based authentication

### Book Management
- Add books
- Fetch books
- Delete books
- Section & category mapping

### Transactions
- Issue books
- Return books
- Track issued books
- Fine calculation (₹5/day for late return)

### User Management
- View users
- Role-based logic (admin/user)

### System APIs
- Dashboard stats
- Complaints & feedback

---

## 2. Tech Stack

- Node.js
- Express.js
- MySQL (mysql2)
- JWT (Authentication)
- REST API

---

## 3. Project Structure (Actual)

```
library-management-system-backend/
├── config/                 # Database connection setup
├── controllers/
├── routes/
├── app.js                  # Main server file
├── package.json
├── package-lock.json
├── .env                    # Environment variables (ignored in Git)
└── .gitignore
```

---



## 4. Setup Instructions

### 4.1. Install dependencies
```bash
npm install
```

### 4.2. Create `.env` file

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=lms_db

JWT_SECRET=your_secret_key
```

---

### 4.3. Start server
```bash
npm start
```


### 4️.4. Server runs on
```
http://localhost:5000
```

---

## 5. API Endpoints (Sample)

#### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

#### Books
- `GET /api/books`
- `POST /api/books`
- `DELETE /api/books/:id`

#### Transactions
- `POST /api/transactions/issue`
- `POST /api/transactions/return`

#### Users
- `GET /api/users`

---

##  6. Business Logic

- Max **5 books per user**
- Return date = **7 days from issue**
- Fine = **₹5/day after due date**
- Duplicate book issue prevented

---

## 7.  Authentication

- JWT-based authentication
- Token generated on login
- Stored on frontend (localStorage)

---

## 8. Important Notes

- `.env` file is not included in the repository (security reasons)
- Make sure MySQL server is running
- Database `lms_db` should be created before running

---

## 9. Future Enhancements

- Role-based access middleware
- Docker containerization
- CI/CD pipeline (Jenkins)
- Deployment on cloud (AWS/Azure)

---

## 10. Author

Priyanka Srivastava  
MCA Student | Software Engineer | DevOps Enthusiast

---

##  11. License
MIT License
```