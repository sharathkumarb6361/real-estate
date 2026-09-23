# 🏠 EstateHub — Real Estate Management Platform

EstateHub is a full-stack **MERN (MongoDB, Express.js, React, Node.js)** real-estate management and property marketplace application.

It provides a complete workflow for property discovery, property/unit management, enquiries, site visits, bookings, wishlists, comparison, notifications, administration, agent operations, authentication, image storage, email/password recovery, analytics, and automated testing.

---

## ✨ Features

### 👤 Authentication & User Accounts

- User registration
- User login/logout
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Current-user/session endpoint
- Forgot-password flow
- Password reset flow
- Protected user routes
- Protected admin routes
- Protected agent routes
- User profile information
- Active/inactive user management

### 👥 User Roles

EstateHub supports three primary roles:

| Role | Main Capabilities |
|---|---|
| **USER** | Browse properties, wishlist, compare, enquiries, site visits, bookings, notifications |
| **AGENT** | Agent dashboard, assigned properties, units, enquiries, visits and bookings |
| **ADMIN** | Full system administration, property/unit/amenity/user/enquiry/visit/booking management and analytics |

---

# 🏡 Property Marketplace

### Property browsing

Users can:

- Browse available properties
- View property details
- Search properties
- Filter properties
- Sort properties
- Paginate property results
- View property images
- View property amenities
- View property information
- View nearby facilities
- View floor-plan information where available
- View apartment/project information

### Property search/filtering

Supported filtering includes:

- Location
- Property type
- BHK
- Minimum price
- Maximum price
- Minimum area
- Maximum area
- Bedrooms
- Bathrooms
- Parking
- Property status
- Sorting
- Pagination

### Property information

Properties can contain:

- Title
- Description
- Location
- City
- State
- Price
- Property type
- BHK
- Area
- Bedrooms
- Bathrooms
- Floor
- Total floors
- Parking
- Amenities
- Images
- Floor plan
- Possession date
- Construction year
- Property status
- Assigned agent
- Nearby facilities
- Project flag

---

# 🏢 Apartment & Unit Management

EstateHub supports individual apartment/unit management for projects.

A property can contain multiple units.

Example:

```text
Green Valley Residency
│
├── A-101
├── A-102
├── A-103
├── A-201
├── A-202
└── A-203
```

Unit information includes:

- Property
- Unit number
- Block
- Floor
- BHK
- Area
- Price
- Status
- Bedrooms
- Bathrooms
- Parking

Supported unit statuses:

```text
AVAILABLE
RESERVED
BOOKED
SOLD
```

Admins can manage units through the admin unit-management interface.

---

# 🛠️ Admin Panel

Administrators have access to dedicated management pages.

### Admin Dashboard

Provides:

- Property statistics
- User statistics
- Booking statistics
- Enquiry statistics
- Visit statistics
- Analytics
- Charts and visual reporting

### Property Management

Admins can:

- Create properties
- View properties
- Search properties
- Edit properties
- Delete properties
- Assign agents
- Manage property status
- Manage property information

### Unit Management

Admins can:

- Create units
- View units
- Edit units
- Delete units
- Manage unit availability/status
- Associate units with properties

### Amenity Management

Admins can:

- View amenities
- Create amenities
- Manage property amenities

### User Management

Admins can:

- View users
- Update users
- Delete users
- Manage user information
- Manage roles/status

### Enquiry Management

Admins can:

- View enquiries
- Update enquiry status
- Manage enquiries
- Manage enquiry assignments

### Visit Management

Admins can:

- View site visits
- Update visit status
- Manage scheduled visits

### Booking Management

Admins can:

- View bookings
- Review booking requests
- Update booking status
- Manage booking information

---

# 👨‍💼 Agent Dashboard

Agents have a dedicated dashboard and protected agent routes.

Agent functionality includes:

- Agent dashboard
- Assigned property access
- Property management access
- Unit management access
- Enquiry management
- Site-visit management
- Booking management

Agent routes include:

```text
/agent/dashboard
/agent/properties
/agent/units
/agent/enquiries
/agent/visits
/agent/bookings
```

Agent access is protected by backend and frontend role authorization.

---

# ❤️ Wishlist

Authenticated users can:

- Add properties to wishlist
- Remove properties from wishlist
- View their wishlist
- Keep wishlist data associated with their account

Wishlist APIs are user-specific so users can access their own wishlist.

---

# ⚖️ Property Comparison

Users can compare properties side-by-side.

The comparison feature helps users evaluate property information such as:

- Price
- Area
- BHK
- Bedrooms
- Bathrooms
- Property type
- Location
- Other available property attributes

---

# 📩 Enquiry Management

Users can send enquiries about properties.

An enquiry can contain:

- User
- Property
- Name
- Email
- Phone
- Message
- Status
- Assigned agent

Enquiry workflow supports status management for agents/admins.

Example workflow:

```text
NEW
  ↓
CONTACTED
  ↓
INTERESTED
  ↓
SITE_VISIT
  ↓
NEGOTIATION
  ↓
CONVERTED / CLOSED
```

Users can view their own enquiries while authorized agents/admins can manage relevant enquiries.

---

# 📅 Site Visit Management

Users can schedule property visits.

Visit information includes:

- User
- Property
- Date
- Time
- Name
- Phone
- Message
- Status
- Agent

Agents/admins can manage visit status.

Typical workflow:

```text
REQUESTED
    ↓
APPROVED
    ↓
COMPLETED
```

Visits can also be rejected, rescheduled, or cancelled according to the application's supported workflow.

---

# 📝 Booking Management

EstateHub supports property/unit booking requests.

Booking information includes:

- User
- Property
- Unit
- Booking date
- Amount
- Booking status
- Notes
- Payment status

Booking APIs allow:

- Creating booking requests
- Viewing bookings
- Admin booking management
- Booking status management

The system is structured to support apartment/unit-level booking workflows.

> Payment processing is separate from the booking record and should be connected to a verified payment gateway for production transactions.

---

# 🔔 Notifications

The backend includes a notification system.

Notifications contain:

- User
- Title
- Message
- Type
- Read/unread status
- Related record ID

Supported notification APIs include:

- Get notifications
- Mark notifications as read

Notifications can be associated with events such as enquiries, visits and bookings.

---

# 🔐 Security

EstateHub includes multiple security mechanisms:

- JWT authentication
- bcrypt password hashing
- Role-based authorization
- Protected frontend routes
- Protected backend API routes
- Express request validation
- CORS configuration
- Security response headers
- Environment-based secrets
- Authentication rate limiting
- Restricted admin/agent operations
- User-specific data access
- Backend validation for protected operations

Security-related environment variables are kept outside source code.

---

# 📧 Email & Password Recovery

The backend includes an email service and password recovery flow.

Supported functionality includes:

- Forgot password
- Reset password
- Password reset token expiry
- SMTP configuration
- Configurable sender address
- Email service abstraction

Email configuration is provided through environment variables.

---

# 🖼️ Image Storage

EstateHub includes an image-storage service.

Supported configuration includes:

```text
IMAGE_STORAGE_PROVIDER=local
```

and Cloudinary configuration:

```text
IMAGE_STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

The backend also supports:

- Image upload handling
- Local image storage
- Cloudinary configuration
- Upload directory configuration
- Maximum image-size configuration

Uploaded local images are exposed through:

```text
/uploads
```

---

# 📊 Dashboard & Analytics

The admin dashboard includes statistics and analytics endpoints.

Available analytics include:

- Property statistics
- User statistics
- Booking statistics
- Enquiry statistics
- Visit statistics
- Chart data
- Monthly activity

Dashboard APIs are protected for administrator access.

---

# 🎨 Frontend UI

The React application includes:

- Responsive layout
- Navigation bar
- Footer
- Property cards
- Property search
- Property detail pages
- Forms
- Loading states
- Error handling
- Toast notifications
- Admin pages
- Agent dashboard
- User dashboard
- Wishlist
- Compare page
- Authentication pages
- Password recovery pages
- Charts
- Responsive Tailwind CSS interface

---

# 🧪 Automated Testing

The project contains backend and frontend tests.

## Backend

The backend uses:

- Jest
- Supertest
- MongoDB Memory Server

Run:

```bash
cd server
npm test
```

Coverage:

```bash
npm run test:coverage
```

Watch mode:

```bash
npm run test:watch
```

Backend test coverage includes areas such as:

- Registration
- Password hashing
- Login
- JWT authentication
- Admin authorization
- Agent authorization
- Property CRUD
- Unit CRUD
- Wishlist isolation
- Enquiry access
- Visit access
- Booking security
- Booking amount validation
- Payment-status protection
- Unit availability
- Cross-property unit validation
- Cross-user booking access

## Frontend

The frontend uses:

- Vitest
- Testing Library
- jsdom
- Testing Library User Event
- jest-dom

Run:

```bash
cd client
npm test
```

Watch mode:

```bash
npm run test:watch
```

---

# 🧱 Technology Stack

## Frontend

- React
- React Router
- Vite
- Tailwind CSS
- Axios
- React Hook Form
- React Hot Toast
- Lucide React
- Recharts
- Vitest
- Testing Library
- Oxlint

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Express Validator
- CORS
- Multer
- Cloudinary
- Nodemailer
- Jest
- Supertest
- MongoDB Memory Server

---

# 📁 Project Structure

```text
real-estate/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── AgentRoute.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── agent/
│   │   │   ├── Home.jsx
│   │   │   ├── Properties.jsx
│   │   │   ├── PropertyDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   └── Compare.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── amenityController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── dashboardController.js
│   │   ├── enquiryController.js
│   │   ├── notificationController.js
│   │   ├── propertyController.js
│   │   ├── unitController.js
│   │   ├── userController.js
│   │   ├── visitController.js
│   │   └── wishlistController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── rateLimit.js
│   │
│   ├── models/
│   │   ├── Amenity.js
│   │   ├── Booking.js
│   │   ├── Enquiry.js
│   │   ├── Notification.js
│   │   ├── Property.js
│   │   ├── Unit.js
│   │   ├── User.js
│   │   ├── Visit.js
│   │   └── Wishlist.js
│   │
│   ├── routes/
│   │   ├── amenities.js
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── dashboard.js
│   │   ├── enquiries.js
│   │   ├── notifications.js
│   │   ├── properties.js
│   │   ├── units.js
│   │   ├── users.js
│   │   ├── visits.js
│   │   └── wishlist.js
│   │
│   ├── services/
│   │   ├── emailService.js
│   │   ├── imageStorage.js
│   │   └── notificationService.js
│   │
│   ├── seed/
│   │   └── seed.js
│   │
│   ├── tests/
│   │   └── api.test.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── jest.config.js
│
├── .env.example
├── .gitignore
├── SETUP.md
├── TESTING.md
└── README.md
```

---

# 🔗 Frontend Routes

## Public

```text
/
/properties
/properties/:id
/login
/register
/forgot-password
/reset-password
/about
/contact
/compare
```

## Authenticated User

```text
/dashboard
/wishlist
```

## Admin

```text
/admin/dashboard
/admin/properties
/admin/users
/admin/enquiries
/admin/visits
/admin/bookings
/admin/units
/admin/amenities
```

## Agent

```text
/agent/dashboard
/agent/properties
/agent/units
/agent/enquiries
/agent/visits
/agent/bookings
```

---

# 🔌 API Reference

Base URL:

```text
http://localhost:5000/api
```

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Properties

```text
GET    /api/properties
GET    /api/properties/:id
POST   /api/properties
PUT    /api/properties/:id
DELETE /api/properties/:id
```

Supported property query parameters include:

```text
location
propertyType
bhk
minPrice
maxPrice
minArea
maxArea
bedrooms
bathrooms
parking
status
sortBy
order
page
limit
```

## Units

```text
GET    /api/units
POST   /api/units
PUT    /api/units/:id
DELETE /api/units/:id
```

## Enquiries

```text
GET    /api/enquiries
POST   /api/enquiries
PUT    /api/enquiries/:id
DELETE /api/enquiries/:id
```

## Site Visits

```text
GET /api/visits
POST /api/visits
PUT /api/visits/:id
```

## Bookings

```text
GET /api/bookings
POST /api/bookings
PUT /api/bookings/:id
```

## Wishlist

```text
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:propertyId
```

## Users

```text
GET    /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

## Dashboard

```text
GET /api/dashboard/stats
GET /api/dashboard/analytics
```

## Notifications

```text
GET /api/notifications
PUT /api/notifications/read
```

## Amenities

```text
GET  /api/amenities
POST /api/amenities
```

---

# ⚙️ Environment Configuration

Create a backend `.env` file using `.env.example` as the template.

Example:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/estatehub
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173

PASSWORD_RESET_TTL_MINUTES=15

SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=

IMAGE_STORAGE_PROVIDER=local
IMAGE_UPLOAD_DIR=uploads
MAX_IMAGE_SIZE_MB=5

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Important

Never commit:

```text
.env
MongoDB passwords
JWT secrets
SMTP passwords
Cloudinary secrets
Payment credentials
API keys
```

Use `.env.example` for safe configuration templates.

---

# 🚀 Installation & Setup

## Prerequisites

Install:

- Node.js
- npm
- MongoDB

You can use MongoDB locally, MongoDB Atlas, or Docker.

---

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd real-estate
```

---

## 2. Install backend dependencies

```bash
cd server
npm install
```

---

## 3. Install frontend dependencies

```bash
cd ../client
npm install
```

---

## 4. Configure environment

Create:

```text
server/.env
```

using the root `.env.example` as a reference.

Configure:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/estatehub
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

Add SMTP or Cloudinary configuration if those features are enabled.

---

# 🗄️ MongoDB

### Local MongoDB

Default local database:

```text
mongodb://localhost:27017/estatehub
```

Make sure MongoDB is running before starting the backend.

### MongoDB Atlas

Set:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

### Docker

```bash
docker run -d \
  -p 27017:27017 \
  --name mongodb \
  mongo:latest
```

---

# 🌱 Seed Demo Data

The seed script creates sample data for development/testing.

Run:

```bash
cd server
npm run seed
```

The sample dataset includes:

- Admin account
- Agent accounts
- User accounts
- Sample properties
- Apartment units
- Amenities
- Enquiries
- Visits
- Bookings
- Wishlist-related data

---

# ▶️ Run the Application

## Terminal 1 — Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

API:

```text
http://localhost:5000/api
```

## Terminal 2 — Frontend

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 👤 Demo Accounts

After running the seed script:

### Admin

```text
Email: admin@estatehub.com
Password: admin123
```

Access:

```text
Admin Dashboard
Properties
Units
Amenities
Users
Enquiries
Visits
Bookings
Analytics
```

### Agent 1

```text
Email: agent1@estatehub.com
Password: agent123
```

### Agent 2

```text
Email: agent2@estatehub.com
Password: agent123
```

### User 1

```text
Email: user1@estatehub.com
Password: user123
```

### User 2

```text
Email: user2@estatehub.com
Password: user123
```

> These credentials are for local/demo environments. Change or remove them before production deployment.

---

# 🧪 Testing

## Backend

```bash
cd server
npm test
```

Coverage:

```bash
npm run test:coverage
```

Watch:

```bash
npm run test:watch
```

## Frontend

```bash
cd client
npm test
```

Watch:

```bash
npm run test:watch
```

---

# 🏗️ Production Build

Build the frontend:

```bash
cd client
npm run build
```

Preview the production frontend:

```bash
npm run preview
```

Start the backend:

```bash
cd server
npm start
```

For production:

- Use a production MongoDB instance
- Configure secure environment variables
- Configure the production frontend URL
- Configure CORS
- Enable HTTPS
- Configure image storage
- Configure SMTP/email
- Use a process manager such as PM2 where appropriate
- Never use demo credentials

---

# 🔄 Application Workflow

A typical customer workflow is:

```text
Visit Website
     ↓
Browse Properties
     ↓
Search / Filter
     ↓
View Property
     ↓
Compare / Wishlist
     ↓
Send Enquiry
     ↓
Schedule Site Visit
     ↓
Select Property / Unit
     ↓
Submit Booking Request
     ↓
Admin / Agent Review
     ↓
Booking Status Update
     ↓
Notification
```

Administrative workflow:

```text
Admin Login
     ↓
Admin Dashboard
     ↓
Manage Properties
     ↓
Manage Units
     ↓
Manage Amenities
     ↓
Manage Users / Agents
     ↓
Manage Enquiries
     ↓
Manage Visits
     ↓
Manage Bookings
     ↓
Review Analytics
```

---

# 🧩 Architecture

EstateHub follows a standard MERN architecture:

```text
┌───────────────────────────────┐
│          React Client         │
│                               │
│ Pages / Components / Context  │
│ Axios API Service / Routing   │
└───────────────┬───────────────┘
                │ HTTP / JSON
                ▼
┌───────────────────────────────┐
│        Express.js API         │
│                               │
│ Routes → Middleware →         │
│ Controllers → Services        │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│          Mongoose             │
│                               │
│ Models / Validation / Queries │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│           MongoDB             │
└───────────────────────────────┘
```

Supporting services:

```text
Express API
   ├── Email Service
   ├── Image Storage
   └── Notification Service
```

---

# 📌 Development Notes

This project is designed as a complete real-estate marketplace and management platform for development, demonstration, learning, and further production hardening.

Before using it for real commercial transactions, configure production-grade:

- Payment gateway integration
- Cloud image storage
- Email delivery
- Database backups
- Monitoring
- HTTPS
- Production secrets
- Transactional booking/payment verification
- Deployment infrastructure

---

# 📄 License

Add your preferred license here before public release.

Example:

```text
MIT License
```

---

# 👨‍💻 Author

**EstateHub — Real Estate Management Platform**

Built using the MERN stack.
