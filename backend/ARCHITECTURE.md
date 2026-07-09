# Project Structure

## Backend Architecture

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── middleware/
│   ├── auth.js                # JWT authentication & authorization
│   └── validate.js            # Input validation middleware
├── routes/
│   ├── auth.js                # Authentication routes
│   ├── courses.js             # Course CRUD operations
│   ├── modules.js             # Module & Lesson management
│   ├── enrollment.js          # Course enrollment
│   ├── progress.js            # Progress tracking
│   ├── reviews.js             # Reviews & ratings
│   └── admin.js               # Admin operations
├── server.js                  # Express app configuration
├── package.json               # Dependencies
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── README.md                  # Setup documentation
└── API_TESTING.md             # API testing guide
```

## Database Tables

### Core Entities
1. **users** - User accounts
2. **courses** - Course catalog
3. **modules** - Course sections
4. **lessons** - Learning content
5. **enrollments** - User-Course relationships
6. **progress** - Lesson completion
7. **reviews** - Course ratings

### Enums
- **UserRole**: STUDENT, INSTRUCTOR, ADMIN
- **ContentType**: VIDEO, TEXT

## API Routes Summary

### Public Routes
- `GET /api/courses` - Browse courses
- `GET /api/courses/:id` - Course details
- `GET /api/courses/:id/reviews` - Course reviews

### Student Routes (Auth Required)
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/users/me/enrollments` - My enrollments
- `POST /api/lessons/:id/complete` - Mark lesson done
- `GET /api/courses/:id/progress` - View progress
- `POST /api/courses/:id/reviews` - Add review

### Instructor Routes (Auth Required)
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `POST /api/courses/:id/modules` - Add module
- `POST /api/modules/:id/lessons` - Add lesson
- `GET /api/courses/instructor/my-courses` - My courses
- `GET /api/courses/:id/students` - View students

### Admin Routes (Auth Required)
- `GET /api/admin/users` - All users
- `GET /api/admin/courses` - All courses
- `PUT /api/admin/courses/:id/approve` - Approve course
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/analytics` - Platform stats

## Middleware Flow

```
Request
  ↓
Rate Limiter (100 req/15min)
  ↓
CORS
  ↓
Body Parser
  ↓
Cookie Parser
  ↓
Route Handler
  ↓
authenticate() - Verify JWT
  ↓
authorize(roles) - Check permissions
  ↓
validate() - Input validation
  ↓
Controller Logic
  ↓
Database Query (Prisma)
  ↓
Response
```

## Security Layers

1. **Password Hashing** - bcrypt with salt rounds
2. **JWT Tokens** - Signed with secret key
3. **HTTP-Only Cookies** - XSS protection
4. **Role-Based Access** - Middleware checks
5. **Input Validation** - express-validator
6. **Rate Limiting** - Prevent abuse
7. **CORS** - Controlled origins
8. **Environment Variables** - Sensitive data protection

## Data Flow Examples

### Student Enrollment Flow
```
Student → Login → Browse Courses → View Details
    ↓
Check if already enrolled
    ↓
Create enrollment record
    ↓
Return success
```

### Progress Tracking Flow
```
Student → View enrolled course → Select lesson
    ↓
Watch/Read content
    ↓
Click "Mark Complete"
    ↓
Upsert progress record
    ↓
Update completion percentage
```

### Course Creation Flow
```
Instructor → Create Course → Add Modules → Add Lessons
    ↓
Set isPublished = true
    ↓
Admin reviews → Approve (isApproved = true)
    ↓
Course visible to students
```

## Key Design Decisions

### Why Prisma ORM?
- Type-safe database queries
- Auto-generated types
- Migration management
- Great developer experience

### Why JWT?
- Stateless authentication
- Works well with microservices
- Can be stored in cookies or headers
- Contains user info (no DB lookup needed)

### Why MySQL?
- ACID compliance
- Complex relationships well-supported
- Mature ecosystem
- Good for structured data

### Why Express?
- Minimalist and flexible
- Large ecosystem
- Easy to understand
- Perfect for REST APIs

## Performance Optimizations

1. **Database Indexes**
   - Foreign keys indexed
   - Unique constraints on email
   - Composite indexes on enrollments

2. **Pagination**
   - Limits data transfer
   - Improves query speed
   - Better UX

3. **Select Queries**
   - Only fetch needed fields
   - Reduce data transfer
   - Faster JSON serialization

4. **Cascade Deletes**
   - Database handles cleanup
   - Maintains referential integrity
   - No orphaned records
