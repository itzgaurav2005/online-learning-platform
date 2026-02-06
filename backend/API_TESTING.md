# API Testing Guide

## Using Postman or Thunder Client

### 1. Authentication Flow

#### Register Student
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Alice Student",
  "email": "alice@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

#### Register Instructor
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Bob Instructor",
  "email": "bob@example.com",
  "password": "password123",
  "role": "INSTRUCTOR"
}
```

#### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "bob@example.com",
  "password": "password123"
}
```

**Save the token from response!**

#### Get Current User
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### 2. Course Management (Instructor)

#### Create Course
```
POST http://localhost:5000/api/courses
Authorization: Bearer INSTRUCTOR_TOKEN
Content-Type: application/json

{
  "title": "Python for Beginners",
  "description": "Learn Python programming from scratch with hands-on projects"
}
```

#### Get My Courses
```
GET http://localhost:5000/api/courses/instructor/my-courses
Authorization: Bearer INSTRUCTOR_TOKEN
```

#### Update Course
```
PUT http://localhost:5000/api/courses/1
Authorization: Bearer INSTRUCTOR_TOKEN
Content-Type: application/json

{
  "isPublished": true
}
```

---

### 3. Module & Lesson Creation (Instructor)

#### Create Module
```
POST http://localhost:5000/api/courses/1/modules
Authorization: Bearer INSTRUCTOR_TOKEN
Content-Type: application/json

{
  "title": "Python Basics",
  "orderIndex": 0
}
```

#### Create Video Lesson
```
POST http://localhost:5000/api/modules/1/lessons
Authorization: Bearer INSTRUCTOR_TOKEN
Content-Type: application/json

{
  "title": "Variables and Data Types",
  "contentType": "VIDEO",
  "videoUrl": "https://www.youtube.com/watch?v=example",
  "duration": 20,
  "orderIndex": 0
}
```

#### Create Text Lesson
```
POST http://localhost:5000/api/modules/1/lessons
Authorization: Bearer INSTRUCTOR_TOKEN
Content-Type: application/json

{
  "title": "Python Setup Guide",
  "contentType": "TEXT",
  "textContent": "# Installing Python\n\n1. Download from python.org\n2. Run installer...",
  "duration": 10,
  "orderIndex": 1
}
```

---

### 4. Student Flow

#### Browse Courses (No auth needed)
```
GET http://localhost:5000/api/courses?page=1&limit=10
```

#### Search Courses
```
GET http://localhost:5000/api/courses?search=python
```

#### Get Course Details
```
GET http://localhost:5000/api/courses/1
```

#### Enroll in Course
```
POST http://localhost:5000/api/courses/1/enroll
Authorization: Bearer STUDENT_TOKEN
```

#### Get My Enrollments
```
GET http://localhost:5000/api/users/me/enrollments
Authorization: Bearer STUDENT_TOKEN
```

#### Get Course Progress
```
GET http://localhost:5000/api/courses/1/progress
Authorization: Bearer STUDENT_TOKEN
```

#### Mark Lesson Complete
```
POST http://localhost:5000/api/lessons/1/complete
Authorization: Bearer STUDENT_TOKEN
```

#### Add Review
```
POST http://localhost:5000/api/courses/1/reviews
Authorization: Bearer STUDENT_TOKEN
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent course! Very well structured and easy to follow."
}
```

#### Get Course Reviews
```
GET http://localhost:5000/api/courses/1/reviews?page=1&limit=10
```

---

### 5. Admin Operations

#### Get All Users
```
GET http://localhost:5000/api/admin/users?page=1&limit=20
Authorization: Bearer ADMIN_TOKEN
```

#### Get All Courses (including unpublished)
```
GET http://localhost:5000/api/admin/courses?isApproved=false
Authorization: Bearer ADMIN_TOKEN
```

#### Approve Course
```
PUT http://localhost:5000/api/admin/courses/1/approve
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "isApproved": true
}
```

#### Platform Analytics
```
GET http://localhost:5000/api/admin/analytics
Authorization: Bearer ADMIN_TOKEN
```

#### Delete User
```
DELETE http://localhost:5000/api/admin/users/5
Authorization: Bearer ADMIN_TOKEN
```

---

## Common Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10-20)

### Filtering
- `search` - Search term for courses
- `role` - Filter users by role
- `isApproved` - Filter courses by approval status
- `isPublished` - Filter courses by publish status

---

## Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message here",
  "details": [ ... ] // validation errors if any
}
```

### Pagination Response
```json
{
  "items": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

---

## Testing Workflow

1. **Register** 3 users (Student, Instructor, Admin)
2. **Login** as Instructor
3. **Create** a course with modules and lessons
4. **Publish** the course
5. **Login** as Admin
6. **Approve** the course
7. **Login** as Student
8. **Enroll** in the course
9. **Complete** lessons and track progress
10. **Add** a review
11. **Check** analytics as Admin

---

## HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
