# JWT Authentication Setup Guide

## 📋 What We've Implemented

This scalable JWT authentication system includes:

### 1. **Two-Token System** (Access + Refresh)
   - **Access Token** (15 min expiry) - Used for API requests
   - **Refresh Token** (7 days expiry) - Used to get new access token

### 2. **Secure Password Handling**
   - Passwords hashed using bcryptjs
   - Never stored in plain text
   - Passwords removed from JSON responses

### 3. **Protected Routes**
   - JWT middleware verifies tokens
   - User info attached to request object
   - Works with both headers and cookies

### 4. **Database Integration**
   - User model with email/password
   - Refresh tokens stored in DB
   - Automatic token cleanup on logout

### 5. **Error Handling**
   - Comprehensive validation
   - Clear error messages
   - HTTP status codes

---

## 🚀 Installation Steps

### Step 1: Install bcryptjs
```bash
npm install bcryptjs
```

### Step 2: Update Your .env File
```bash
# Copy .env.example to .env and fill in your values
cp .env.example .env
```

Then edit `.env` and add:
```
MONGODB_URI=mongodb://localhost:27017/todo-app
ACCESS_TOKEN_SECRET=your_super_secret_access_key_min_32_chars
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_min_32_chars
```

### Step 3: Update package.json Scripts
Add this to your `package.json`:
```json
"scripts": {
  "dev": "nodemon app.js",
  "start": "node app.js"
}
```

---

## 📡 API Endpoints

### Authentication Routes (`/auth/*`)

#### 1. **POST /auth/signup** - Register new user
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "email": "user@example.com",
      "createdAt": "..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 2. **POST /auth/login** - Login user
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

#### 3. **POST /auth/refresh-token** - Get new access token
```bash
curl -X POST http://localhost:3000/auth/refresh-token \
  -H "Cookie: refreshToken=<your_refresh_token>"
```

#### 4. **POST /auth/logout** - Logout user (Protected)
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer <your_access_token>"
```

### Protected Routes
All routes under `/api/*` are protected and require JWT:

```bash
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer <your_access_token>"
```

---

## 🔐 Security Features

### 1. **Password Requirements**
- Minimum 6 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number

### 2. **Token Storage**
- Access token in response (use in Authorization header)
- Refresh token in httpOnly cookie (secure, not accessible from JS)

### 3. **Protected Routes**
- JWT middleware validates every protected request
- Invalid/expired tokens return 401 Unauthorized
- User info attached to `req.user` in controllers

### 4. **Logout**
- Refresh token cleared from database
- Cookie cleared from client
- User must login again for new tokens

---

## 📝 Usage in Controllers

### Accessing User Info in Protected Routes
```javascript
const getUserTodos = (req, res) => {
  // req.user contains { userId, email }
  const userId = req.user.userId;
  
  // Query todos for this user
  Todo.find({ userId }, (err, todos) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, data: todos });
  });
};
```

---

## 🛡️ Scalability Features

1. **Separation of Concerns**
   - Controllers: Business logic
   - Middleware: Cross-cutting concerns
   - Utils: Reusable functions
   - Routes: API definitions
   - Models: Data schemas
   - Validators: Input validation

2. **Modular Architecture**
   - Easy to add new routes
   - Easy to add new protected endpoints
   - Easy to modify JWT expiry
   - Easy to change token secrets

3. **Environment Configuration**
   - Secrets in .env (not hardcoded)
   - Different configs per environment
   - Easy CI/CD integration

4. **Database Integration**
   - User model with refresh tokens
   - Logout clears tokens
   - Easy to add user properties
   - Indexed email for fast lookups

---

## 🐛 Troubleshooting

### "bcryptjs not found"
```bash
npm install bcryptjs
```

### "Module not found" errors
Make sure all files are created in correct folders:
- `models/User.js`
- `utils/jwt.js`
- `middlewares/authMiddleware.js`
- `controllers/authController.js`
- `routes/auth.js`

### "Invalid token" errors
- Check token format: `Bearer <token>`
- Verify token hasn't expired
- Check JWT secrets in .env match

### MongoDB connection fails
- Verify MONGODB_URI in .env
- Make sure MongoDB is running
- Check connection string format

---

## 🔄 Next Steps

1. ✅ Install dependencies
2. ✅ Update .env with your secrets
3. ✅ Test signup endpoint
4. ✅ Test login endpoint
5. ✅ Use token for protected routes
6. ✅ Test token refresh
7. ✅ Test logout

---

## 📚 Project Structure
```
node-js-playlist/
├── app.js                          # Main application
├── package.json
├── .env                           # Environment variables
├── models/
│   └── User.js                    # User schema & methods
├── controllers/
│   ├── authController.js          # Auth logic (signup, login, logout)
│   └── todoController.js          # Todo logic
├── middlewares/
│   ├── authMiddleware.js          # JWT verification
│   └── validate.js                # Validation error handler
├── utils/
│   └── jwt.js                     # Token generation/verification
├── validators/
│   └── authValidator.js           # Input validation rules
├── routes/
│   └── auth.js                    # Auth routes
├── public/
│   └── assets/
└── views/
    └── todo.ejs
```

---

Happy coding! 🎉
