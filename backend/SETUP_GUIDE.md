# 🚀 Quick Setup Guide

Follow these steps to get your Learning Platform running!

## Prerequisites Check

✅ Node.js installed? Run: `node --version` (need v18+)
✅ MySQL installed? Run: `mysql --version` (need v8.0+)
✅ npm installed? Run: `npm --version`

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

Expected output: Dependencies installed successfully

### 2. Setup MySQL Database

```bash
# Option A: Using MySQL Command Line
mysql -u root -p
# Enter your MySQL password
CREATE DATABASE learning_platform;
exit;

# Option B: Using MySQL Workbench
# Just create a new database named "learning_platform"
```

### 3. Configure Environment

```bash
# Copy the example file
cp .env.example .env

# Edit .env file with your details:
# - Replace MySQL username and password
# - Change JWT_SECRET to a secure random string
```

Your `.env` should look like:
```
DATABASE_URL="mysql://root:yourpassword@localhost:3306/learning_platform"
JWT_SECRET="your-super-secret-key-min-32-chars-long"
JWT_EXPIRE="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### 4. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create tables
npx prisma migrate dev --name init

# (Optional) View database
npx prisma studio
```

You should see tables created in your database!

### 5. Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# OR Production mode
npm start
```

You should see:
```
Server running on port 5000
Environment: development
```

### 6. Test the API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/health

# Should return: {"status":"OK","timestamp":"..."}
```

## 🎯 Create Your First Users

### Create an Instructor

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Instructor",
    "email": "instructor@example.com",
    "password": "password123",
    "role": "INSTRUCTOR"
  }'
```

### Create a Student

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Student",
    "email": "student@example.com",
    "password": "password123",
    "role": "STUDENT"
  }'
```

### Create an Admin

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "ADMIN"
  }'
```

Save the tokens returned!

## 🧪 Quick Test Workflow

### 1. Login as Instructor

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "instructor@example.com",
    "password": "password123"
  }'
```

**Copy the token!**

### 2. Create a Course

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_INSTRUCTOR_TOKEN" \
  -d '{
    "title": "Web Development Fundamentals",
    "description": "Learn HTML, CSS, and JavaScript from scratch"
  }'
```

### 3. Add a Module

```bash
curl -X POST http://localhost:5000/api/courses/1/modules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_INSTRUCTOR_TOKEN" \
  -d '{
    "title": "Introduction to HTML",
    "orderIndex": 0
  }'
```

### 4. Add a Lesson

```bash
curl -X POST http://localhost:5000/api/modules/1/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_INSTRUCTOR_TOKEN" \
  -d '{
    "title": "HTML Basics and Tags",
    "contentType": "VIDEO",
    "videoUrl": "https://youtube.com/watch?v=example",
    "duration": 15,
    "orderIndex": 0
  }'
```

### 5. Publish the Course

```bash
curl -X PUT http://localhost:5000/api/courses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_INSTRUCTOR_TOKEN" \
  -d '{"isPublished": true}'
```

### 6. Approve Course (as Admin)

```bash
# First login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Then approve
curl -X PUT http://localhost:5000/api/admin/courses/1/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"isApproved": true}'
```

### 7. Enroll as Student

```bash
# Login as student
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'

# Enroll
curl -X POST http://localhost:5000/api/courses/1/enroll \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### 8. Complete a Lesson

```bash
curl -X POST http://localhost:5000/api/lessons/1/complete \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### 9. Add a Review

```bash
curl -X POST http://localhost:5000/api/courses/1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -d '{
    "rating": 5,
    "comment": "Excellent course!"
  }'
```

## 🛠️ Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
1. Check MySQL is running: `mysql -u root -p`
2. Verify DATABASE_URL in .env
3. Ensure database exists: `SHOW DATABASES;`

### Issue: "Prisma Client is not generated"
**Solution:**
```bash
npx prisma generate
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Change PORT in .env to 5001 or kill process on 5000
lsof -ti:5000 | xargs kill -9
```

### Issue: "JWT must be provided"
**Solution:**
- Ensure you're sending the token in Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN_HERE`

## 📚 Next Steps

1. ✅ Read `API_TESTING.md` for complete API documentation
2. ✅ Read `ARCHITECTURE.md` to understand the system design
3. ✅ Use Postman/Thunder Client for easier API testing
4. ✅ Open Prisma Studio to visualize your data: `npx prisma studio`
5. ✅ Build a frontend using Next.js, React, or Vue

## 🎓 For Interviews

Practice explaining:
1. The database schema and relationships
2. How authentication works (JWT + HTTP-only cookies)
3. Role-based authorization implementation
4. The course enrollment workflow
5. Progress tracking mechanism
6. Why you chose each technology

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review `API_TESTING.md` for all endpoints
- Study `ARCHITECTURE.md` for system design

## ✨ Success!

If you can:
- Create users ✅
- Login and get tokens ✅
- Create courses ✅
- Enroll students ✅
- Track progress ✅

**You're ready to demo this project!** 🎉

---

**Pro Tip:** Use Postman Collections to save all your API requests with tokens for easy testing!
