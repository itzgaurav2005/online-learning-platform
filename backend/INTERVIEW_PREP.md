# 🎓 Online Learning Platform - Complete Project Overview

## 📋 Project Summary

A production-ready, full-stack online learning platform built with Node.js, Express, MySQL, and Prisma. Features complete role-based access control, course management, progress tracking, and review systems.

**Perfect for:** Full-stack developer interviews, portfolio projects, or learning system design

---

## 🎯 What You've Built

### Core Features
✅ **Authentication System** - JWT-based with bcrypt password hashing
✅ **Role-Based Access Control** - Student, Instructor, Admin roles
✅ **Course Management** - Full CRUD with modules and lessons
✅ **Enrollment System** - Students can browse and enroll in courses
✅ **Progress Tracking** - Lesson-by-lesson completion tracking
✅ **Reviews & Ratings** - 5-star rating system with comments
✅ **Admin Moderation** - Course approval and user management
✅ **Search & Pagination** - Efficient data browsing
✅ **Analytics Dashboard** - Platform statistics for admins

### Technical Implementation
- **Backend:** Node.js + Express.js
- **Database:** MySQL with Prisma ORM
- **Auth:** JWT (JSON Web Tokens) with HTTP-only cookies
- **Validation:** express-validator
- **Security:** bcrypt, CORS, rate limiting
- **API Design:** RESTful with clear resource naming

---

## 📂 Project Structure

```
learning-platform/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Complete database schema
│   ├── middleware/
│   │   ├── auth.js                # JWT auth & RBAC
│   │   └── validate.js            # Input validation
│   ├── routes/
│   │   ├── auth.js                # Registration, login, logout
│   │   ├── courses.js             # Course CRUD operations
│   │   ├── modules.js             # Module & lesson management
│   │   ├── enrollment.js          # Course enrollment
│   │   ├── progress.js            # Progress tracking
│   │   ├── reviews.js             # Reviews & ratings
│   │   └── admin.js               # Admin operations
│   ├── server.js                  # Express configuration
│   ├── package.json
│   ├── .env.example
│   ├── README.md                  # Setup documentation
│   ├── API_TESTING.md             # Complete API guide
│   └── .gitignore
├── ARCHITECTURE.md                # System design document
├── SETUP_GUIDE.md                 # Quick start guide
└── INTERVIEW_PREP.md              # This file!
```

---

## 🗄️ Database Schema

### Tables & Relations

**Users Table**
- id, name, email, password_hash, role, timestamps
- Role: STUDENT | INSTRUCTOR | ADMIN

**Courses Table**
- id, title, description, instructor_id, is_published, is_approved, timestamps
- **Relation:** instructor_id → users.id

**Modules Table**
- id, course_id, title, order_index, timestamp
- **Relation:** course_id → courses.id

**Lessons Table**
- id, module_id, title, content_type, video_url, text_content, duration, order_index
- Content Type: VIDEO | TEXT
- **Relation:** module_id → modules.id

**Enrollments Table**
- id, user_id, course_id, enrolled_at
- **Composite Unique:** (user_id, course_id)
- **Relations:** user_id → users.id, course_id → courses.id

**Progress Table**
- id, user_id, lesson_id, completed, completed_at
- **Composite Unique:** (user_id, lesson_id)
- **Relations:** user_id → users.id, lesson_id → lessons.id

**Reviews Table**
- id, user_id, course_id, rating (1-5), comment, timestamp
- **Composite Unique:** (user_id, course_id)
- **Relations:** user_id → users.id, course_id → courses.id

---

## 🔐 Security Implementation

### 1. Password Security
- **Hashing:** bcrypt with 10 salt rounds
- **Storage:** Only hashed passwords in database
- **Never exposed** in API responses

### 2. Authentication
- **JWT Tokens:** Signed with HS256
- **Storage:** HTTP-only cookies (XSS protection)
- **Expiration:** 7 days default
- **Verification:** On every protected route

### 3. Authorization
- **Middleware:** `authorize(...roles)`
- **Granular control:** Per-route role checking
- **Ownership verification:** Users can only modify their own resources

### 4. Input Validation
- **express-validator:** All inputs sanitized
- **Type checking:** Proper data types enforced
- **SQL Injection prevention:** Prisma parameterized queries

### 5. Rate Limiting
- **100 requests per 15 minutes** per IP
- **Prevents:** Brute force attacks, API abuse

---

## 🚀 API Endpoints Summary

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user (Protected)

### Courses (Mixed Access)
- `GET /api/courses` - Browse courses (Public)
- `GET /api/courses/:id` - Course details (Public)
- `POST /api/courses` - Create course (Instructor)
- `PUT /api/courses/:id` - Update course (Instructor/Admin)
- `DELETE /api/courses/:id` - Delete course (Instructor/Admin)

### Student Features (Protected)
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/users/me/enrollments` - My enrollments
- `POST /api/lessons/:id/complete` - Mark lesson complete
- `GET /api/courses/:id/progress` - View progress
- `POST /api/courses/:id/reviews` - Add review

### Instructor Features (Protected)
- `POST /api/courses/:id/modules` - Create module
- `POST /api/modules/:id/lessons` - Create lesson
- `GET /api/courses/instructor/my-courses` - My courses
- `GET /api/courses/:id/students` - Enrolled students

### Admin Features (Protected)
- `GET /api/admin/users` - List all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/courses` - All courses (including unpublished)
- `PUT /api/admin/courses/:id/approve` - Approve/reject course
- `GET /api/admin/analytics` - Platform statistics

---

## 💡 Key Design Decisions

### Why MySQL?
- **Relational data:** Complex relationships between entities
- **ACID compliance:** Data integrity guaranteed
- **Mature ecosystem:** Well-tested, reliable
- **Perfect for:** Structured data with relationships

### Why Prisma ORM?
- **Type safety:** TypeScript-like safety in JavaScript
- **Auto-generated types:** Less boilerplate
- **Migration management:** Version controlled schema changes
- **Developer experience:** Intuitive API, great documentation

### Why JWT?
- **Stateless:** No server-side session storage needed
- **Scalable:** Works well in distributed systems
- **Portable:** Can be used across multiple services
- **Secure:** When properly implemented with HTTP-only cookies

### Why Express?
- **Minimalist:** Only what you need
- **Flexible:** Easy to structure as needed
- **Mature ecosystem:** Thousands of middleware packages
- **Interview-friendly:** Widely known and expected

---

## 🎤 Interview Talking Points

### System Design Questions

**Q: Walk me through your database schema.**

"I designed a normalized relational schema with 7 core tables. Users can have multiple roles - Student, Instructor, or Admin. Courses have a hierarchical structure: Course → Modules → Lessons. The many-to-many relationship between users and courses is handled through the Enrollments table. Progress tracking is granular at the lesson level, allowing detailed analytics. All foreign keys are properly indexed for query performance."

**Q: How does authentication work?**

"I use JWT tokens for authentication. When users login, I hash their password with bcrypt and verify it. If valid, I generate a JWT token containing their user ID and return it both in the response and set it as an HTTP-only cookie. For subsequent requests, the authenticate middleware extracts the token, verifies the signature, and attaches the user object to the request. This approach is stateless and scalable."

**Q: Explain your authorization strategy.**

"I implemented role-based access control using middleware. After authentication, the authorize middleware checks if the user's role matches the required permissions for that route. For example, only Instructors can create courses, only Students can enroll, and only Admins can approve courses or delete users. Additionally, I verify ownership - instructors can only modify their own courses unless they're admins."

**Q: How do you track student progress?**

"Progress tracking is implemented at the lesson level. When a student completes a lesson, a record is created in the Progress table with user_id, lesson_id, and completion status. To calculate overall course progress, I count completed lessons versus total lessons in all modules. This granular approach allows for detailed analytics and the ability to resume exactly where the student left off."

**Q: How would you scale this system?**

"Several strategies:
1. **Caching:** Add Redis for frequently accessed data like course listings
2. **Database:** Implement read replicas for queries, keep writes on primary
3. **CDN:** Serve static assets and video content from a CDN
4. **Load Balancing:** Horizontal scaling with multiple Node instances
5. **Message Queue:** Handle email notifications and heavy processing async
6. **Microservices:** Split into auth, courses, payments as separate services
7. **Database:** Shard by user ID or geographic region for global scale"

### Code Walkthrough Questions

**Q: Show me how you implemented authentication middleware.**

"The authenticate middleware extracts the JWT from cookies or Authorization header, verifies it using our secret key, fetches the user from the database, and attaches it to the request object. If verification fails at any point, it returns a 401 Unauthorized. This middleware is applied to all protected routes before the controller logic runs."

**Q: How do you handle validation?**

"I use express-validator for input validation. Each route defines validation rules using middleware - for example, checking email format, password length, or ensuring rating is between 1-5. The validate middleware then checks if any validation errors occurred and returns a 400 Bad Request with details if so. This prevents invalid data from reaching the database."

**Q: Walk through the enrollment workflow.**

"When a student enrolls:
1. First, I verify the course exists and is both published and approved
2. Check if the user is already enrolled to prevent duplicates
3. Create an enrollment record with user_id and course_id
4. The database enforces a unique constraint on this combination
5. Return success with the enrollment details
The foreign key constraints ensure data integrity - if a course is deleted, all related enrollments are automatically removed via cascade delete."

---

## 🧪 Testing Scenarios

### Basic Flow Test
1. Register Student, Instructor, and Admin users
2. Login as Instructor and create a course
3. Add modules and lessons to the course
4. Publish the course
5. Login as Admin and approve the course
6. Login as Student and enroll
7. Complete lessons and verify progress
8. Add a review
9. Check admin analytics

### Edge Cases to Test
- Enroll in same course twice (should fail)
- Non-enrolled student accessing course content
- Instructor modifying another instructor's course
- Student trying to access admin routes
- Invalid JWT token
- Expired JWT token
- Missing required fields
- SQL injection attempts (Prisma should prevent)
- XSS attempts in course descriptions
- Review course without enrollment

---

## 📊 Performance Considerations

### Database Optimization
✅ Foreign key indexes on all relations
✅ Unique constraints on (user_id, course_id), (user_id, lesson_id)
✅ Cascade deletes for data cleanup
✅ Selective field queries (not SELECT *)

### API Optimization
✅ Pagination on all list endpoints
✅ Rate limiting to prevent abuse
✅ Gzip compression (via Express)
✅ CORS configured for specific origins

### Future Optimizations
- Add Redis caching for course listings
- Implement database connection pooling
- Add full-text search indexes
- Lazy load lesson content
- Optimize N+1 queries with Prisma includes

---

## 🚀 Setup Instructions

### Quick Start
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Test the API
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"STUDENT"}'
```

---

## 🎯 Demo Script for Interviews

### 1. Introduction (1 min)
"I built a full-stack online learning platform with role-based access control. It supports three user types - Students, Instructors, and Admins - each with specific permissions. The platform allows instructors to create structured courses, students to enroll and track their progress, and admins to moderate content."

### 2. Architecture Overview (2 min)
"The backend is built with Node.js and Express, using MySQL for the database with Prisma as the ORM. I implemented JWT authentication, role-based authorization middleware, and RESTful API design. The database schema is normalized with proper relationships and indexes."

### 3. Live Demo (3 min)
"Let me show you the key workflows:
1. I'll register and login as an instructor
2. Create a course with modules and lessons
3. Publish it
4. Then as admin, approve the course
5. As a student, enroll and complete lessons
6. Track progress and leave a review
7. Finally, view the analytics dashboard"

### 4. Code Walkthrough (2 min)
"Here's the authentication middleware showing JWT verification and user attachment. And here's the authorization middleware that checks role-based permissions. The Prisma schema shows our relational database design with proper foreign keys and indexes."

### 5. Scaling Discussion (2 min)
"To scale this, I'd add Redis caching, implement database read replicas, use a CDN for static content, add horizontal scaling with load balancers, and potentially move to microservices architecture for the different domains."

---

## 📚 Additional Resources

### Files to Review
1. **SETUP_GUIDE.md** - Quick setup instructions
2. **API_TESTING.md** - Complete API documentation with examples
3. **ARCHITECTURE.md** - Detailed system design
4. **README.md** - Full project documentation

### Study Topics
- REST API design principles
- JWT authentication
- RBAC (Role-Based Access Control)
- Database normalization
- SQL relationships and joins
- ORM vs raw SQL
- Middleware patterns in Express
- Security best practices

---

## ✅ Checklist Before Interview

- [ ] Can explain the database schema clearly
- [ ] Understand JWT authentication flow
- [ ] Know how RBAC middleware works
- [ ] Can walk through the enrollment workflow
- [ ] Understand progress tracking implementation
- [ ] Know why each technology was chosen
- [ ] Can discuss scaling strategies
- [ ] Have tested all endpoints
- [ ] Can demo the project live
- [ ] Prepared for "what would you do differently" questions

---

## 🎓 Common Interview Questions & Answers

**Q: What would you do differently if you built this again?**

"I'd add comprehensive unit and integration tests from the start. I'd implement a caching layer earlier. I'd also consider using TypeScript for better type safety throughout the application. Additionally, I'd implement soft deletes instead of hard deletes for better data retention and potential recovery."

**Q: How do you handle errors?**

"I have a centralized error handling middleware that catches all errors. Validation errors return 400 with details, authentication failures return 401, authorization failures return 403, and database errors are logged and return 500 with a generic message to avoid exposing internals."

**Q: Why not use NoSQL?**

"While NoSQL would work for some parts, this domain has complex relationships that are naturally relational. Students enroll in courses, courses have modules, modules have lessons - these relationships are easier to manage and query with SQL. Plus, we need ACID guarantees for enrollments and progress tracking."

---

## 🌟 You're Ready!

You now have a complete, production-ready learning platform that demonstrates:
- ✅ Full-stack development skills
- ✅ Database design expertise
- ✅ Security best practices
- ✅ RESTful API design
- ✅ Authentication & Authorization
- ✅ System architecture understanding

**Good luck with your interview!** 🚀
