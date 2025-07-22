# NALCO connectNALCO - MongoDB Database Setup

This guide will help you set up and configure MongoDB for the NALCO connectNALCO application.

## 🗄️ Database Overview

The application now uses MongoDB to store:

- User credentials and profiles
- Employee information
- Authentication tokens
- Department data
- All system data (replacing localStorage)

## 🚀 Quick Setup

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB Community Server**

   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb

   # macOS with Homebrew
   brew install mongodb-community

   # Windows: Download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB Service**

   ```bash
   # Linux/macOS
   sudo systemctl start mongod
   # or
   brew services start mongodb-community

   # Windows: MongoDB will start automatically or use MongoDB Compass
   ```

3. **Create Environment File**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your MongoDB connection string:

   ```env
   MONGODB_URI=mongodb://localhost:27017/nalco_connect
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

4. **Seed the Database**
   ```bash
   npm run seed-db
   ```

### Option 2: MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster

2. **Get Connection String**

   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update Environment Variables**

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nalco_connect?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

4. **Seed the Database**
   ```bash
   npm run seed-db
   ```

## 👥 Default User Accounts

After seeding, you'll have these default accounts:

### Administrator

- **Email**: admin@nalco.com
- **Password**: nalco@2024
- **Role**: Admin
- **Access**: Full system administration

### Department Head (Authority)

- **Email**: priya.sharma@nalco.com
- **Password**: nalco@2024
- **Role**: Authority
- **Department**: Human Resources

### Employee

- **Email**: rajesh.singh@nalco.com
- **Password**: nalco@2024
- **Role**: Employee
- **Department**: Human Resources

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/users` - Get all users (admin only)
- `PUT /api/auth/users/:id` - Update user

### Usage Examples

#### Login

```javascript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@nalco.com",
    password: "nalco@2024",
  }),
});
const data = await response.json();
```

#### Register New User

```javascript
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    employeeId: "EMP004",
    name: "New Employee",
    email: "new.employee@nalco.com",
    password: "nalco@2024",
    phone: "+91-9876543219",
    department: "Engineering",
    designation: "Engineer",
    role: "employee",
  }),
});
```

## ����️ Development Commands

```bash
# Start development server with MongoDB
npm run dev

# Seed database with initial data
npm run seed-db

# Seed database (development)
npm run seed-db:dev

# Build for production
npm run build

# Start production server
npm start
```

## 🗂️ Database Structure

### Users Collection

```javascript
{
  _id: ObjectId,
  employeeId: String (unique),
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: 'employee' | 'authority' | 'admin',
  department: String,
  designation: String,
  joinDate: Date,
  status: 'active' | 'inactive' | 'suspended',
  avatar: String,
  location: String,
  team: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin, Authority, Employee roles
- **Input Validation**: Mongoose schema validation
- **Email Uniqueness**: Prevents duplicate accounts

## 🚨 Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB status
systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check MongoDB logs
sudo journalctl -u mongod
```

### Seeding Issues

```bash
# Clear database and re-seed
npm run seed-db:dev
```

### Permission Issues

Make sure MongoDB has proper permissions:

```bash
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock
```

## 📱 Integration with Frontend

The authentication is now integrated with the frontend AuthContext. Users will:

1. Login through the login page
2. Receive JWT token
3. Store token in localStorage
4. Access protected routes
5. Auto-logout on token expiry

## 🎯 Next Steps

1. **Set up MongoDB** (local or Atlas)
2. **Run the seeding script**: `npm run seed-db`
3. **Start the development server**: `npm run dev`
4. **Login with default credentials**
5. **Test all functionality**

## 📞 Support

For issues or questions:

- Check MongoDB logs
- Verify environment variables
- Ensure MongoDB service is running
- Contact: support@nalco.com

---

🎉 **Your NALCO connectNALCO application is now ready with MongoDB integration!**
