# LearnHub Frontend - Next.js

Beautiful, modern frontend for the LearnHub online learning platform built with Next.js 14, React, and Tailwind CSS.

## 🚀 Features

### User Interface
- ✅ Beautiful gradient-based design with modern animations
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Role-based dashboards (Student, Instructor, Admin)
- ✅ Course browsing with search and pagination
- ✅ Progress tracking visualizations
- ✅ Review and rating system
- ✅ Authentication with protected routes

### Pages Included
- **Public Pages**
  - Homepage with hero section
  - Course listing with search
  - Course detail page
  - Login & Register

- **Student Dashboard**
  - Enrolled courses overview
  - Progress tracking
  - Course learning interface

- **Instructor Dashboard** (to be implemented)
  - Create/manage courses
  - View enrolled students
  - Course analytics

- **Admin Dashboard** (to be implemented)
  - Approve courses
  - Manage users
  - Platform analytics

## 📋 Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:5000`
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Accent**: Pink (#f093fb)
- **Success**: Green
- **Warning**: Yellow
- **Danger**: Red

### Typography
- **Display Font**: Cal Sans (for headings)
- **Body Font**: Inter (for content)

### Components
- Gradient backgrounds
- Glass morphism effects
- Card hover animations
- Progress bars
- Star ratings
- Badges

## 📂 Project Structure

```
frontend/
├── pages/
│   ├── index.js                     # Homepage
│   ├── login.js                     # Login page
│   ├── register.js                  # Registration
│   ├── courses/
│   │   ├── index.js                 # Course listing
│   │   └── [id].js                  # Course detail
│   └── dashboard/
│       ├── student/
│       │   ├── index.js             # Student dashboard
│       │   └── courses/[id].js      # Course learning
│       ├── instructor/
│       │   └── index.js             # Instructor dashboard
│       └── admin/
│           └── index.js             # Admin dashboard
├── components/
│   ├── Layout.js                    # Main layout wrapper
│   └── Navbar.js                    # Navigation bar
├── context/
│   └── AuthContext.js               # Authentication state
├── lib/
│   └── api.js                       # Axios API client
├── styles/
│   └── globals.css                  # Global styles
└── public/                          # Static assets
```

## 🔐 Authentication Flow

1. User logs in via `/login`
2. JWT token stored in cookies
3. `AuthContext` manages user state
4. Protected routes check authentication
5. Auto-redirect to login if not authenticated

## 🎯 Key Components

### AuthProvider
Manages authentication state across the app:
- `user` - Current user object
- `loading` - Auth check loading state
- `login()` - Login function
- `register()` - Registration function
- `logout()` - Logout function

### API Client
Axios instance with interceptors:
- Automatically adds JWT token to requests
- Handles 401 errors (redirects to login)
- Base URL configured from environment

### Layout Component
Wraps all pages with:
- Navigation bar
- Responsive container
- SEO meta tags

## 🌐 API Integration

### Endpoints Used

**Auth**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

**Courses**
- `GET /courses` - List courses (with search/pagination)
- `GET /courses/:id` - Course details
- `POST /courses/:id/enroll` - Enroll in course

**Student**
- `GET /users/me/enrollments` - My enrolled courses
- `GET /courses/:id/progress` - Course progress
- `POST /lessons/:id/complete` - Mark lesson complete

## 🎨 Styling

### Tailwind CSS
Custom configuration with:
- Extended color palette
- Custom animations
- Responsive breakpoints

### Custom Classes
```css
.gradient-bg          // Gradient background
.gradient-text        // Gradient text
.glass                // Glass morphism
.card-hover           // Card hover effect
.btn-primary          // Primary button
.btn-secondary        // Secondary button
.spinner              // Loading spinner
.progress-bar         // Progress bar
.badge                // Badge styles
```

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All components are fully responsive with mobile-first approach.

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Set in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` - Your backend API URL

### Build Settings
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

## ✨ Key Features Implementation

### Progress Tracking
```javascript
// Show progress bar
<div className="progress-bar">
  <div 
    className="progress-fill" 
    style={{ width: `${percentage}%` }}
  />
</div>
```

### Protected Routes
```javascript
// Check auth in useEffect
useEffect(() => {
  if (!user) {
    router.push('/login');
  } else if (user.role !== 'STUDENT') {
    router.push('/');
  }
}, [user]);
```

### API Calls with Error Handling
```javascript
try {
  const { data } = await apiClient.get('/courses');
  setCourses(data.courses);
} catch (error) {
  console.error('Error:', error);
  setError(error.response?.data?.error || 'An error occurred');
}
```

## 🎓 User Roles

### Student
- Browse and search courses
- Enroll in courses
- Track learning progress
- Leave reviews

### Instructor
- Create courses
- Manage modules and lessons
- View enrolled students
- Publish courses

### Admin
- Approve/reject courses
- Manage users
- View platform analytics
- Moderate content

## 🐛 Troubleshooting

### Issue: "Network Error"
**Solution:** Ensure backend is running on `http://localhost:5000`

### Issue: "Cannot read property 'user' of undefined"
**Solution:** Make sure page is wrapped with `AuthProvider`

### Issue: "Styles not loading"
**Solution:** Run `npm install` and restart dev server

### Issue: "JWT token not being sent"
**Solution:** Check `withCredentials: true` in API client

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Axios](https://axios-http.com/docs/intro)

## 🎯 TODO / Future Enhancements

- [ ] Instructor dashboard
- [ ] Admin dashboard  
- [ ] Course creation form
- [ ] Video player integration
- [ ] Real-time notifications
- [ ] Dark mode toggle
- [ ] Course certificates
- [ ] Payment integration
- [ ] Social sharing
- [ ] Wishlist feature

## 🤝 Contributing

This is a portfolio project. Feel free to fork and modify!

## 📄 License

MIT

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**
