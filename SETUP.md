# EstateHub Setup Guide

## Quick Start

### 1. Install MongoDB (Required)

The application requires MongoDB to be running. Choose one of the following options:

#### Option A: Install MongoDB locally
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. MongoDB will run on `localhost:27017` by default

#### Option B: Use MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update the `.env` file with your Atlas connection string:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/estatehub
   ```

#### Option C: Use Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment

The `.env.example` file shows the required environment variables. Copy it to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/estatehub
JWT_SECRET=your-secret-key-change-this-in-production
CLIENT_URL=http://localhost:5174
```

### 4. Start MongoDB

Make sure MongoDB is running before starting the application.

### 5. Seed the Database (Optional)

This creates sample data for testing:
```bash
cd server
npm run seed
```

### 6. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5174 (or 5173 if available)
- Backend API: http://localhost:5000

### 7. Test the Application

#### Demo Accounts
After seeding, use these accounts to test:

**Admin:**
- Email: admin@estatehub.com
- Password: admin123

**Agent:**
- Email: agent1@estatehub.com
- Password: agent123

**User:**
- Email: user1@estatehub.com
- Password: user123

## Troubleshooting

### MongoDB Connection Error
If you see "MongoDB connection error", ensure:
1. MongoDB is running (`mongod` command)
2. The connection string in `.env` is correct
3. MongoDB is accessible on the specified port

### Port Already in Use
If port 5000 or 5173 is already in use:
- Change the PORT in `.env` file
- The frontend will automatically try the next available port

### Build Errors
If you encounter build errors:
1. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear cache: `rm -rf .vite`
3. Ensure all dependencies are installed

## Development Tips

- The backend uses hot-reloading, so changes are reflected immediately
- The frontend uses Vite's HMR for fast development
- Check the console for any errors during development
- Use the demo accounts to test different user roles

## Production Deployment

For production deployment:
1. Build the frontend: `cd client && npm run build`
2. Configure production environment variables
3. Use a production MongoDB instance
4. Set up proper CORS configuration
5. Enable HTTPS
6. Use a process manager like PM2 for the backend
