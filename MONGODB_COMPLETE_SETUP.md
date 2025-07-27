# Complete MongoDB Setup Guide for NALCO connectNALCO

## 🎯 Overview
This guide provides complete step-by-step instructions to set up MongoDB database for your NALCO connectNALCO project, store all data persistently, and enable custom login credentials.

## 📋 Prerequisites
- Node.js installed on your system
- MongoDB Compass (recommended for visual database management)

## 🚀 Step 1: Install MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Click "Try Free" and create an account
   - Verify your email address

2. **Create a Cluster**
   - Click "Create" to build a new cluster
   - Choose "Shared" (free tier)
   - Select your preferred cloud provider and region
   - Name your cluster (e.g., "nalco-connect")
   - Click "Create Cluster"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `nalco_admin`
   - Password: Generate a secure password (save this!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Add Current IP Address"
   - For production: Add specific IP addresses
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" and click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" and version "4.1 or later"
   - Copy the connection string
   - It looks like: `mongodb+srv://nalco_admin:<password>@nalco-connect.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Option B: Local MongoDB Installation

1. **Download MongoDB Community Server**
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select your OS and download
   - Install following the installer instructions

2. **Download MongoDB Compass**
   - Go to [MongoDB Compass Download](https://www.mongodb.com/try/download/compass)
   - Install the GUI tool for database management

## 🔧 Step 2: Configure Your Project

1. **Create Environment File**
   ```bash
   # In your project root, create a .env file
   touch .env
   ```

2. **Add MongoDB Configuration to .env**
   ```env
   # For MongoDB Atlas
   MONGODB_URI=mongodb+srv://nalco_admin:YOUR_PASSWORD@nalco-connect.xxxxx.mongodb.net/nalco_connect?retryWrites=true&w=majority
   
   # For Local MongoDB
   # MONGODB_URI=mongodb://localhost:27017/nalco_connect
   
   # JWT Secret for authentication
   JWT_SECRET=nalco_super_secret_key_2024_change_in_production
   
   # Environment
   NODE_ENV=development
   ```

3. **Install Required Dependencies**
   ```bash
   npm install
   ```

## 📊 Step 3: Initialize Database with Sample Data

1. **Run the Database Seeding Script**
   ```bash
   npm run seed-db:dev
   ```

   This will create:
   - Users collection with admin, authority, and employee accounts
   - Departments collection
   - Sample data for testing

## 👥 Step 4: Default Login Credentials

After seeding, you'll have these accounts:

### Administrator Account
- **Employee ID**: `ADMIN001`
- **Password**: `admin123`
- **Role**: Admin
- **Access**: Full system administration

### Authority Account
- **Employee ID**: `AUTH001`
- **Password**: `auth123`
- **Role**: Authority
- **Access**: Department management

### Employee Account
- **Employee ID**: `EMP001`
- **Password**: `emp123`
- **Role**: Employee
- **Access**: Personal portal

## 🗄️ Step 5: Database Management with MongoDB Compass

1. **Open MongoDB Compass**
2. **Connect to Your Database**
   - For Atlas: Use the connection string from Step 1
   - For Local: `mongodb://localhost:27017`
3. **Navigate to Your Database**
   - Database name: `nalco_connect`
   - Collections: `users`, `departments`, etc.

## 📱 Step 6: Creating Custom Login Credentials

### Method 1: Through Admin Panel (Recommended)
1. Login as admin using the credentials above
2. Go to Admin Dashboard → User Management
3. Click "Add User" button
4. Fill in the user details:
   - Full Name
   - Employee ID (must be unique)
   - Email
   - Phone
   - Department
   - Role (employee/authority/admin)
5. Click "Create User"
6. The system will generate a default password
7. User can change password after first login

### Method 2: Direct Database Insert (Advanced)
Using MongoDB Compass:
1. Open the `users` collection
2. Click "INSERT DOCUMENT"
3. Add user data in JSON format:
   ```json
   {
     "employeeId": "EMP002",
     "name": "John Doe",
     "email": "john.doe@nalco.com",
     "password": "$2b$10$...", // Use bcrypt to hash password
     "phone": "+91-9876543210",
     "role": "employee",
     "department": "Engineering",
     "designation": "Engineer",
     "status": "active",
     "joinDate": "2024-01-15T00:00:00.000Z",
     "createdAt": "2024-01-15T00:00:00.000Z",
     "updatedAt": "2024-01-15T00:00:00.000Z"
   }
   ```

## 🔒 Step 7: Data Persistence Configuration

All data is now automatically stored in MongoDB:

### What's Stored:
- ✅ User accounts and authentication
- ✅ Employee profiles and information
- ✅ Department data
- ✅ Leave applications
- ✅ Reimbursement requests
- ✅ Payslip information
- ✅ Facility bookings
- ✅ Attendance records
- ✅ System settings

### Backup Strategy:
1. **Automated Backups** (Atlas):
   - Atlas provides automatic backups
   - Access via Atlas dashboard → Backup tab

2. **Manual Backup** (Local):
   ```bash
   mongodump --db nalco_connect --out ./backup/$(date +%Y%m%d)
   ```

3. **Restore from Backup**:
   ```bash
   mongorestore ./backup/20240115/nalco_connect
   ```

## 🚀 Step 8: Start Your Application

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Verify Database Connection**
   - Check console for "✅ MongoDB Connected" message
   - If you see connection errors, verify your MONGODB_URI

3. **Test Login**
   - Go to the login page
   - Click on any role button (Employee/Authority/Admin)
   - Use the default credentials provided above
   - Verify you can access the appropriate dashboard

## 🔧 Step 9: Department Setup Button Functionality

The cancel and save changes buttons in the admin portal department setup are now fully functional:

- **Cancel Button**: Closes the dialog without saving
- **Save Changes Button**: Saves the department data to MongoDB
- **Add Department Button**: Creates new departments in the database

## 🚨 Step 10: Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**
   ```
   Error: connect ECONNREFUSED
   ```
   **Solution**: Verify your MONGODB_URI and ensure MongoDB is running

2. **Authentication Failed**
   ```
   Error: Authentication failed
   ```
   **Solution**: Check username/password in connection string

3. **Network Access Issues** (Atlas)
   ```
   Error: not authorized on admin
   ```
   **Solution**: Add your IP address to Atlas Network Access

4. **Seeding Failed**
   ```
   Error: Collection already exists
   ```
   **Solution**: Drop the database and re-run seeding:
   ```bash
   # Using MongoDB Compass, delete the database
   # Then run: npm run seed-db:dev
   ```

## 📞 Support Commands

```bash
# Check MongoDB connection
npm run dev

# Re-seed database (clears existing data)
npm run seed-db:dev

# View application logs
# Check console output when starting the server

# Database operations
mongosh # Connect to local MongoDB shell
```

## ✅ Verification Checklist

- [ ] MongoDB is installed and running
- [ ] Environment variables are configured
- [ ] Database seeding completed successfully
- [ ] Can login with default credentials
- [ ] Can access all three dashboards (Employee/Authority/Admin)
- [ ] Can create new users through admin panel
- [ ] Data persists after browser refresh
- [ ] Department setup buttons work correctly
- [ ] MongoDB Compass can connect and view data

## 🎉 Success!

Your NALCO connectNALCO application is now fully configured with MongoDB persistence. All user data, authentication, and application state will be stored in the database and persist across sessions.

## 📋 Next Steps

1. **Customize User Roles**: Modify user permissions as needed
2. **Add More Departments**: Use the admin panel to create your organization structure
3. **Configure Email Settings**: Set up SMTP for notifications
4. **Set Up Backups**: Implement regular backup procedures
5. **Security Hardening**: Change default passwords and implement additional security measures

---

**Need Help?** Contact the development team or refer to the MongoDB Atlas documentation for additional support.
