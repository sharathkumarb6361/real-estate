# EstateHub - Full-Stack Real Estate Management Platform

A production-style, full-stack Real Estate Management and Property Marketplace web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🏠 Features

### For Customers
- **Property Browsing**: Browse and search through an extensive property database
- **Advanced Filtering**: Filter by location, type, BHK, price range, area, amenities, and more
- **Property Details**: View detailed property information with image galleries and floor plans
- **Wishlist**: Save favorite properties for later reference
- **Property Comparison**: Compare up to 3 properties side-by-side
- **Enquiries**: Send enquiries to agents about properties of interest
- **Visit Scheduling**: Schedule property visits at convenient times
- **Booking Requests**: Request property bookings with a mock payment system
- **User Dashboard**: Track enquiries, visits, bookings, and manage profile

### For Administrators
- **Dashboard Analytics**: View comprehensive statistics and charts
- **Property Management**: Full CRUD operations for properties
- **Unit Management**: Manage individual apartment units in projects
- **User Management**: Manage users and their roles
- **Agent Management**: Add, edit, and assign agents to properties
- **Enquiry Management**: Track and manage customer enquiries
- **Visit Management**: Schedule and manage property visits
- **Booking Management**: Approve, reject, and manage booking requests
- **Amenity Management**: Create and manage property amenities

## 🛠 Technology Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management
- **React Hook Form** - Form handling
- **Recharts** - Data visualization charts
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Request validation

## 📁 Project Structure

```
estatehub/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Properties.jsx
│   │   │   ├── PropertyDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Compare.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/     # Admin pages
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProperties.jsx
│   │   │       ├── AdminUsers.jsx
│   │   │       ├── AdminEnquiries.jsx
│   │   │       ├── AdminVisits.jsx
│   │   │       └── AdminBookings.jsx
│   │   ├── context/       # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/      # API services
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Express backend
│   ├── config/           # Configuration files
│   │   └── db.js
│   ├── controllers/      # Route controllers
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── unitController.js
│   │   ├── enquiryController.js
│   │   ├── visitController.js
│   │   ├── bookingController.js
│   │   ├── wishlistController.js
│   │   ├── userController.js
│   │   ├── dashboardController.js
│   │   ├── notificationController.js
│   │   └── amenityController.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── models/          # Mongoose models
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Unit.js
│   │   ├── Enquiry.js
│   │   ├── Visit.js
│   │   ├── Booking.js
│   │   ├── Wishlist.js
│   │   ├── Notification.js
│   │   └── Amenity.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── units.js
│   │   ├── enquiries.js
│   │   ├── visits.js
│   │   ├── bookings.js
│   │   ├── wishlist.js
│   │   ├── users.js
│   │   ├── dashboard.js
│   │   ├── notifications.js
│   │   └── amenities.js
│   ├── seed/            # Database seeding
│   │   └── seed.js
│   ├── server.js
│   └── package.json
│
├── .env                  # Environment variables (not in git)
├── .env.example         # Environment variables template
├── .gitignore
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) running locally OR MongoDB Atlas account
- npm or yarn

**Note**: If you don't have MongoDB installed locally, you can:
1. Install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Use MongoDB Atlas (free tier) at https://www.mongodb.com/cloud/atlas
3. Use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd real-estate
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/estatehub
JWT_SECRET=your-secret-key-change-this-in-production
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas, use your connection string:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/estatehub
```

5. **Start MongoDB**
- **Option 1**: If you have MongoDB installed locally, start the MongoDB service
- **Option 2**: Use MongoDB Atlas (update MONGO_URI in .env with your Atlas connection string)
- **Option 3**: Use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

6. **Seed the database (optional)**
```bash
cd server
npm run seed
```

This will create sample data including:
- 5 users (admin, 2 agents, 2 regular users)
- 6 properties with various types
- 10 apartment units
- 12 amenities
- Sample enquiries, visits, and bookings

6. **Start the backend server**
```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

7. **Start the frontend development server**
```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

## 👤 Demo Accounts

After seeding the database, you can use these demo accounts:

### Admin Account
- **Email**: admin@estatehub.com
- **Password**: admin123
- **Access**: Full admin dashboard and all management features

### Agent Accounts
- **Email**: agent1@estatehub.com
- **Password**: agent123
- **Access**: View assigned properties, manage enquiries and visits

- **Email**: agent2@estatehub.com
- **Password**: agent123
- **Access**: View assigned properties, manage enquiries and visits

### User Accounts
- **Email**: user1@estatehub.com
- **Password**: user123
- **Access**: Browse properties, create enquiries, schedule visits, request bookings

- **Email**: user2@estatehub.com
- **Password**: user123
- **Access**: Browse properties, create enquiries, schedule visits, request bookings

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user (requires authentication)

### Property Endpoints

#### GET /api/properties
Get all properties with optional filters
```
Query params: location, propertyType, bhk, minPrice, maxPrice, minArea, maxArea, 
bedrooms, bathrooms, parking, status, sortBy, order, page, limit
```

#### GET /api/properties/:id
Get property by ID

#### POST /api/properties
Create new property (Admin only)

#### PUT /api/properties/:id
Update property (Admin only)

#### DELETE /api/properties/:id
Delete property (Admin only)

### Unit Endpoints

#### GET /api/units
Get all units

#### POST /api/units
Create new unit (Admin only)

#### PUT /api/units/:id
Update unit (Admin only)

#### DELETE /api/units/:id
Delete unit (Admin only)

### Enquiry Endpoints

#### GET /api/enquiries
Get all enquiries (users see their own, agents/admin see all)

#### POST /api/enquiries
Create new enquiry

#### PUT /api/enquiries/:id
Update enquiry status (Agent/Admin only)

#### DELETE /api/enquiries/:id
Delete enquiry (Agent/Admin only)

### Visit Endpoints

#### GET /api/visits
Get all visits

#### POST /api/visits
Schedule new visit

#### PUT /api/visits/:id
Update visit status (Agent/Admin only)

### Booking Endpoints

#### GET /api/bookings
Get all bookings

#### POST /api/bookings
Create new booking request

#### PUT /api/bookings/:id
Update booking status (Admin only)

### Wishlist Endpoints

#### GET /api/wishlist
Get user's wishlist

#### POST /api/wishlist
Add property to wishlist

#### DELETE /api/wishlist/:propertyId
Remove property from wishlist

### User Endpoints

#### GET /api/users
Get all users (Admin only)

#### PUT /api/users/:id
Update user (Admin only)

#### DELETE /api/users/:id
Delete user (Admin only)

### Dashboard Endpoints

#### GET /api/dashboard/stats
Get dashboard statistics (Admin only)

#### GET /api/dashboard/analytics
Get dashboard analytics with charts (Admin only)

### Notification Endpoints

#### GET /api/notifications
Get user notifications

#### PUT /api/notifications/read
Mark notifications as read

### Amenity Endpoints

#### GET /api/amenities
Get all amenities

#### POST /api/amenities
Create new amenity (Admin only)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-Based Authorization**: USER, AGENT, ADMIN roles with appropriate permissions
- **Protected Routes**: API routes protected with authentication middleware
- **Input Validation**: Express-validator for request validation
- **CORS Configuration**: Cross-origin resource sharing properly configured
- **Environment Variables**: Sensitive data stored in environment variables

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional UI**: Modern, clean interface with Tailwind CSS
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Feedback for user actions
- **Image Gallery**: Professional property image viewing
- **Data Visualization**: Charts and graphs for analytics
- **Search & Filtering**: Advanced property search capabilities
- **Property Comparison**: Side-by-side property comparison

## 📊 Database Schema

### User Model
- name, email, phone, password, role, isActive, assignedProperties, profile

### Property Model
- title, description, location, city, state, price, propertyType, bhk, area, bedrooms, bathrooms, floor, totalFloors, parking, amenities, images, floorPlan, possessionDate, constructionYear, status, agent, nearbyFacilities, isProject

### Unit Model
- property, unitNumber, block, floor, bhk, area, price, status, bedrooms, bathrooms, parking

### Enquiry Model
- user, property, name, email, phone, message, status, agent

### Visit Model
- user, property, date, time, name, phone, message, status, agent

### Booking Model
- user, property, unit, bookingDate, amount, status, notes, paymentStatus

### Wishlist Model
- user, properties (array)

### Notification Model
- user, title, message, type, isRead, relatedId

### Amenity Model
- name, icon, description

## 🔧 Development

### Running Tests
Currently, the project focuses on manual testing. To test the application:

1. Start both servers (backend and frontend)
2. Use the demo accounts to test different user roles
3. Test the complete user flow: register → browse → search → wishlist → enquiry → visit → booking
4. Test the admin flow: login → manage properties → manage users → handle enquiries → approve bookings

### Building for Production

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
```

The build output will be in the `client/dist` directory.

## 🚧 Future Improvements

- Real-time notifications with Socket.io
- Email integration for enquiry/visit confirmations
- Payment gateway integration (Razorpay/Stripe)
- Advanced image upload with Cloudinary
- Google Maps integration for location
- Property video tours
- Virtual reality property viewing
- Mobile app development (React Native)
- Advanced analytics and reporting
- Multi-language support
- Dark mode theme

## 📝 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Author

Built as a comprehensive MERN stack demonstration project.

## 🙏 Acknowledgments

- React and Vite teams for excellent tools
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- All open-source libraries used in this project

---

**Note**: This is a demonstration project. For production use, additional security measures, testing, and optimization would be required.
#   r e a l - e s t a t e  
 