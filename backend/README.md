# Online Learning Platform

A full-stack online learning platform with role-based access control, course management, progress tracking, and reviews.

## 🚀 Features

### User Roles
- **Student**: Browse courses, enroll, track progress, leave reviews
- **Instructor**: Create courses, manage modules/lessons, view enrolled students
- **Admin**: Approve/reject courses, manage users, platform analytics

### Core Functionality
- ✅ JWT-based authentication with HTTP-only cookies
- ✅ Role-based authorization middleware
- ✅ Complete course management (CRUD)
- ✅ Modular course structure (Modules → Lessons)
- ✅ Progress tracking per lesson
- ✅ Reviews and ratings system
- ✅ Course search and pagination
- ✅ Admin moderation and analytics
- ✅ MySQL with Prisma ORM

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```env
DATABASE_URL="mysql://username:password@localhost:3306/learning_platform"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRE="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

**Replace:**
- `username` with your MySQL username
- `password` with your MySQL password
- `learning_platform` with your desired database name

### 3. Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE learning_platform;
exit;
```

### 4. Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 5. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 🗄️ Database Schema

### Tables

1. **users** - User accounts with roles (STUDENT, INSTRUCTOR, ADMIN)
2. **courses** - Course information
3. **modules** - Course modules (sections)
4. **lessons** - Individual lessons (VIDEO or TEXT content)
5. **enrollments** - Student course enrollments
6. **progress** - Lesson completion tracking
7. **reviews** - Course ratings and reviews

### Relationships

- User → Courses (1:Many - Instructor)
- User → Enrollments (1:Many)
- User → Progress (1:Many)
- User → Reviews (1:Many)
- Course → Modules (1:Many)
- Module → Lessons (1:Many)
- Course → Enrollments (1:Many)
- Course → Reviews (1:Many)
- Lesson → Progress (1:Many)

## 📚 API Endpoints

### Authentication (`/api/auth`)
```
POST   /register          - Register new user
POST   /login             - Login user
POST   /logout            - Logout user
GET    /me                - Get current user
```

### Courses (`/api`)
```
GET    /courses                      - Get all published courses (public)
GET    /courses/:id                  - Get course details
POST   /courses                      - Create course (Instructor)
PUT    /courses/:id                  - Update course (Instructor/Admin)
DELETE /courses/:id                  - Delete course (Instructor/Admin)
GET    /courses/instructor/my-courses - Get instructor's courses
```

### Modules & Lessons (`/api`)
```
POST   /courses/:courseId/modules    - Create module
PUT    /modules/:id                  - Update module
DELETE /modules/:id                  - Delete module
POST   /modules/:moduleId/lessons    - Create lesson
PUT    /lessons/:id                  - Update lesson
DELETE /lessons/:id                  - Delete lesson
```

### Enrollment (`/api`)
```
POST   /courses/:courseId/enroll           - Enroll in course (Student)
GET    /users/me/enrollments               - Get user's enrollments
GET    /courses/:courseId/enrollment-status - Check enrollment status
GET    /courses/:courseId/students         - Get enrolled students (Instructor)
```

### Progress (`/api`)
```
POST   /lessons/:lessonId/complete    - Mark lesson complete
POST   /lessons/:lessonId/incomplete  - Mark lesson incomplete
GET    /courses/:courseId/progress    - Get course progress
```

### Reviews (`/api`)
```
POST   /courses/:courseId/reviews     - Add review (Student)
PUT    /reviews/:reviewId             - Update review
DELETE /reviews/:reviewId             - Delete review
GET    /courses/:courseId/reviews     - Get course reviews
```

### Admin (`/api/admin`)
```
GET    /users                        - Get all users
DELETE /users/:userId                - Delete user
GET    /courses                      - Get all courses (including unpublished)
PUT    /courses/:courseId/approve    - Approve/reject course
DELETE /courses/:courseId            - Delete any course
GET    /analytics                    - Platform analytics
```

## 🔐 Authentication & Authorization

### JWT Authentication
- Tokens stored in HTTP-only cookies (secure in production)
- 7-day expiration by default
- Tokens also accepted in `Authorization: Bearer <token>` header

### Role-Based Access Control (RBAC)

**Protected Routes Use:**
```javascript
authenticate                          // Verify JWT
authorize('STUDENT')                  // Student only
authorize('INSTRUCTOR', 'ADMIN')      // Instructor or Admin
```

## 🧪 Testing the API

### 1. Register Users

```bash
# Register as Student
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Student",
    "email": "student@example.com",
    "password": "password123",
    "role": "STUDENT"
  }'

# Register as Instructor
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Instructor",
    "email": "instructor@example.com",
    "password": "password123",
    "role": "INSTRUCTOR"
  }'

# Register as Admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "ADMIN"
  }'
```

**Note:** After registering the first admin, you should disable public admin registration or require admin approval.

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "instructor@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response for subsequent requests.

### 3. Create a Course (as Instructor)

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Complete Web Development Bootcamp",
    "description": "Learn full-stack web development from scratch"
  }'
```

### 4. Create Module

```bash
curl -X POST http://localhost:5000/api/courses/1/modules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Introduction to HTML",
    "orderIndex": 0
  }'
```

### 5. Create Lesson

```bash
curl -X POST http://localhost:5000/api/modules/1/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "HTML Basics",
    "contentType": "VIDEO",
    "videoUrl": "https://example.com/video.mp4",
    "duration": 15,
    "orderIndex": 0
  }'
```

## 📊 Interview Talking Points

### System Design
"I designed a scalable learning platform with clear separation of concerns using Express.js and MySQL with Prisma ORM."

### Database Design
"I implemented a normalized relational schema with proper foreign keys and indexes for optimal query performance. The many-to-many relationship between users and courses is handled through the enrollments table."

### Security
"Security is handled through bcrypt password hashing, JWT-based authentication with HTTP-only cookies, role-based authorization middleware, input validation using express-validator, and rate limiting to prevent abuse."

### Scalability Considerations
- Database indexing on foreign keys
- Pagination for large datasets
- Modular route structure for maintainability
- Environment-based configuration
- Prepared for horizontal scaling

### Business Logic
"The platform enforces business rules like students can only enroll in published and approved courses, users can only review courses they're enrolled in, and instructors can only modify their own courses unless they're admins."

## 🚧 Future Enhancements

- [ ] File upload for course thumbnails and videos
- [ ] Email notifications
- [ ] Course certificates upon completion
- [ ] Payment integration
- [ ] Live chat/discussion forums
- [ ] Video streaming with progress tracking
- [ ] Assignment submission and grading
- [ ] Course recommendations based on enrollment history
- [ ] Analytics dashboards for instructors

## 📝 Development Notes

### Prisma Commands
```bash
npx prisma studio              # Open database GUI
npx prisma migrate dev         # Create and apply migrations
npx prisma db push             # Push schema without migrations (dev only)
npx prisma generate            # Regenerate Prisma Client
npx prisma migrate reset       # Reset database (careful!)
```

### Common Issues

**Issue:** Database connection fails
**Solution:** Check DATABASE_URL in .env and ensure MySQL is running

**Issue:** Prisma Client not found
**Solution:** Run `npx prisma generate`

**Issue:** CORS errors
**Solution:** Ensure FRONTEND_URL in .env matches your frontend URL

## 📄 License

MIT

## 👤 Author

 Gaurav Pandey

---

**Made with ❤️ for learning**
