# NALCO connectNALCO - Advanced MongoDB Setup with Custom Credentials

This comprehensive guide will help you set up MongoDB with your own custom credentials, security configurations, and production-ready settings for the NALCO connectNALCO application.

## 🎯 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local MongoDB Setup](#local-mongodb-setup)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Custom User Management](#custom-user-management)
5. [Security Configuration](#security-configuration)
6. [Environment Configuration](#environment-configuration)
7. [Database Initialization](#database-initialization)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

## 📋 Prerequisites

Before starting, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Basic understanding of MongoDB
- Administrator access to your server (for production setup)

## 🏠 Local MongoDB Setup

### Option 1: MongoDB Community Server (Recommended for Development)

#### 1. Install MongoDB

**Windows:**
```powershell
# Download and install from https://www.mongodb.com/try/download/community
# Or use Chocolatey
choco install mongodb
```

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB as a service
brew services start mongodb-community@7.0
```

**Ubuntu/Debian:**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**RHEL/CentOS:**
```bash
# Create repository file
sudo vim /etc/yum.repos.d/mongodb-org-7.0.repo

# Add the following content:
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc

# Install MongoDB
sudo yum install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 2. Create Custom Database and Users

**Access MongoDB Shell:**
```bash
mongosh
```

**Create your custom database:**
```javascript
// Switch to your custom database
use nalco_production

// Create an admin user for your database
db.createUser({
  user: "nalco_admin",
  pwd: "your_super_secure_password_here",
  roles: [
    { role: "dbAdmin", db: "nalco_production" },
    { role: "readWrite", db: "nalco_production" }
  ]
})

// Create an application user (recommended for security)
db.createUser({
  user: "nalco_app",
  pwd: "your_app_password_here", 
  roles: [
    { role: "readWrite", db: "nalco_production" }
  ]
})

// Create a read-only user for analytics/reporting
db.createUser({
  user: "nalco_readonly",
  pwd: "your_readonly_password_here",
  roles: [
    { role: "read", db: "nalco_production" }
  ]
})
```

#### 3. Enable Authentication

**Edit MongoDB configuration file:**

**Linux/macOS:** `/etc/mongod.conf` or `/usr/local/etc/mongod.conf`
**Windows:** `C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg`

```yaml
# Network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1  # Change to 0.0.0.0 for remote connections

# Security
security:
  authorization: enabled

# Storage
storage:
  dbPath: /var/lib/mongodb  # Windows: C:\data\db

# Logging
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log  # Windows: C:\data\log\mongod.log
```

**Restart MongoDB:**
```bash
# Linux/macOS
sudo systemctl restart mongod

# Windows
net stop MongoDB
net start MongoDB
```

## ☁️ MongoDB Atlas Setup

### 1. Create Atlas Account and Cluster

1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Build a new cluster (choose your preferred cloud provider and region)
4. Wait for cluster creation (usually 3-7 minutes)

### 2. Configure Network Access

1. Go to **Network Access** in Atlas dashboard
2. Click **Add IP Address**
3. For development: Add your current IP or `0.0.0.0/0` (all IPs)
4. For production: Add only your application server IPs

### 3. Create Database Users

1. Go to **Database Access** in Atlas dashboard
2. Click **Add New Database User**
3. Create users with appropriate roles:

**Application User:**
```
Username: nalco_app_user
Password: [Generate secure password]
Roles: Read and write to any database
```

**Admin User:**
```
Username: nalco_admin_user  
Password: [Generate secure password]
Roles: Atlas admin
```

### 4. Get Connection String

1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Select **Node.js** as driver
4. Copy the connection string

Example connection string:
```
mongodb+srv://nalco_app_user:<password>@cluster0.abc123.mongodb.net/nalco_production?retryWrites=true&w=majority
```

## 👥 Custom User Management

### Creating Your Own Employee Data

Create a file `custom-users.json` with your organization's data:

```json
{
  "users": [
    {
      "employeeId": "NALCO001",
      "name": "Your CEO Name",
      "email": "ceo@yourcompany.com",
      "password": "SecurePassword123!",
      "phone": "+91-9876543210",
      "role": "admin",
      "department": "Executive",
      "designation": "Chief Executive Officer",
      "joinDate": "2020-01-01",
      "location": "Head Office",
      "team": "Leadership"
    },
    {
      "employeeId": "NALCO002", 
      "name": "Your HR Manager",
      "email": "hr@yourcompany.com",
      "password": "SecurePassword123!",
      "phone": "+91-9876543211",
      "role": "authority",
      "department": "Human Resources",
      "designation": "HR Manager",
      "joinDate": "2020-06-15",
      "location": "Main Office",
      "team": "HR Team"
    },
    {
      "employeeId": "NALCO003",
      "name": "Sample Employee",
      "email": "employee@yourcompany.com", 
      "password": "SecurePassword123!",
      "phone": "+91-9876543212",
      "role": "employee",
      "department": "Operations",
      "designation": "Operations Executive",
      "joinDate": "2021-03-20",
      "location": "Branch Office",
      "team": "Operations Team"
    }
  ]
}
```

### Custom Seeding Script

Create `scripts/seed-custom-db.js`:

```javascript
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { User } from '../server/models/User.js';
import fs from 'fs';
import path from 'path';

// Load custom users
const customUsers = JSON.parse(
  fs.readFileSync('./custom-users.json', 'utf8')
);

async function seedCustomDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users (optional)
    const clearExisting = process.argv.includes('--clear');
    if (clearExisting) {
      await User.deleteMany({});
      console.log('Cleared existing users');
    }

    // Create users
    for (const userData of customUsers.users) {
      const existingUser = await User.findOne({ 
        $or: [
          { email: userData.email },
          { employeeId: userData.employeeId }
        ]
      });

      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(userData.password, 12);

      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword,
        status: 'active',
        avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await user.save();
      console.log(`Created user: ${userData.name} (${userData.email})`);
    }

    console.log('Custom database seeding completed!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedCustomDatabase();
```

Add to `package.json`:
```json
{
  "scripts": {
    "seed-custom": "node scripts/seed-custom-db.js",
    "seed-custom-clear": "node scripts/seed-custom-db.js --clear"
  }
}
```

## 🔐 Security Configuration

### 1. Environment Variables

Create `.env.production`:

```env
# Database Configuration
MONGODB_URI=mongodb://nalco_app:your_app_password_here@localhost:27017/nalco_production
# For Atlas:
# MONGODB_URI=mongodb+srv://nalco_app_user:your_password@cluster0.abc123.mongodb.net/nalco_production?retryWrites=true&w=majority

# JWT Configuration  
JWT_SECRET=your_super_long_jwt_secret_key_minimum_32_characters_for_security
JWT_EXPIRES_IN=8h

# Session Configuration
SESSION_SECRET=your_session_secret_key_for_express_sessions
SESSION_TIMEOUT=28800000

# Email Configuration (optional)
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASS=your_email_password
SMTP_FROM=NALCO connectNALCO <noreply@yourcompany.com>

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Application Configuration
NODE_ENV=production
PORT=3000
APP_NAME=NALCO connectNALCO
APP_URL=https://yourcompany.com

# Backup Configuration
BACKUP_PATH=/var/backups/nalco
BACKUP_SCHEDULE=0 2 * * *
```

### 2. Production Security Settings

Update `server/config/database.ts`:

```typescript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const options = {
      // Connection options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      
      // Security options
      authSource: 'admin',
      ssl: process.env.NODE_ENV === 'production',
      sslValidate: process.env.NODE_ENV === 'production',
      
      // Additional options for Atlas
      retryWrites: true,
      w: 'majority'
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI!, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection errors
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
```

## 🗄️ Database Initialization

### 1. Run Custom Seeding

```bash
# Create your custom users file first
cp custom-users.example.json custom-users.json

# Edit custom-users.json with your data
nano custom-users.json

# Seed database with your custom data
npm run seed-custom

# Or clear existing data and seed fresh
npm run seed-custom-clear
```

### 2. Verify Database Setup

```bash
# Connect to MongoDB
mongosh "mongodb://nalco_app:your_password@localhost:27017/nalco_production"

# Check collections
show collections

# Verify users
db.users.find().pretty()

# Check indexes
db.users.getIndexes()
```

## 🚀 Production Deployment

### 1. Docker Setup

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    container_name: nalco_mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: nalco_root
      MONGO_INITDB_ROOT_PASSWORD: your_root_password
      MONGO_INITDB_DATABASE: nalco_production
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb
      - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
    ports:
      - "27017:27017"
    networks:
      - nalco_network

  app:
    build: .
    container_name: nalco_app
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://nalco_app:your_app_password@mongodb:27017/nalco_production
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    networks:
      - nalco_network

volumes:
  mongodb_data:
  mongodb_config:

networks:
  nalco_network:
    driver: bridge
```

Create `init-mongo.js`:

```javascript
db = db.getSiblingDB('nalco_production');

db.createUser({
  user: 'nalco_app',
  pwd: 'your_app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'nalco_production'
    }
  ]
});
```

### 2. Backup Strategy

Create `scripts/backup-database.sh`:

```bash
#!/bin/bash

# Configuration
DB_NAME="nalco_production"
BACKUP_DIR="/var/backups/nalco"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
mongodump --db $DB_NAME --out $BACKUP_DIR/backup_$DATE

# Compress backup
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $BACKUP_DIR backup_$DATE
rm -rf $BACKUP_DIR/backup_$DATE

# Remove old backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: backup_$DATE.tar.gz"
```

Add to crontab for automated backups:
```bash
# Edit crontab
crontab -e

# Add backup job (daily at 2 AM)
0 2 * * * /path/to/scripts/backup-database.sh
```

### 3. Monitoring Setup

Create `scripts/monitor-db.js`:

```javascript
import mongoose from 'mongoose';

async function monitorDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    console.log('Database Statistics:');
    console.log(`- Database: ${stats.db}`);
    console.log(`- Collections: ${stats.collections}`);
    console.log(`- Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Indexes: ${stats.indexes}`);
    console.log(`- Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Check recent activity
    const recentUsers = await db.collection('users').find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    console.log('\nRecent Users:');
    recentUsers.forEach(user => {
      console.log(`- ${user.name} (${user.employeeId}) - ${user.createdAt}`);
    });
    
  } catch (error) {
    console.error('Monitoring error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

monitorDatabase();
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Connection Refused

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check if port is listening
netstat -tulpn | grep 27017

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

#### 2. Authentication Failed

```bash
# Verify user credentials
mongosh -u nalco_app -p your_password --authenticationDatabase nalco_production

# Reset user password
mongosh
use nalco_production
db.updateUser("nalco_app", {pwd: "new_password"})
```

#### 3. Permission Denied

```bash
# Fix MongoDB directory permissions
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chmod 755 /var/lib/mongodb
```

#### 4. Out of Disk Space

```bash
# Check disk usage
df -h

# Clean up old logs
sudo logrotate /etc/logrotate.d/mongodb

# Compact database (if needed)
mongosh
use nalco_production
db.runCommand({compact: "users"})
```

### Environment-Specific Troubleshooting

#### Development Environment

```bash
# Reset development database
npm run seed-custom-clear

# Clear all data and start fresh
mongosh
use nalco_production
db.dropDatabase()
exit
npm run seed-custom
```

#### Production Environment

```bash
# Check application logs
sudo journalctl -u nalco-app -f

# Monitor database performance
mongotop 5
mongostat 5

# Check connection pool
mongosh
db.runCommand({connPoolStats: 1})
```

## 📞 Support and Resources

### Documentation Links
- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

### Quick Reference Commands

```bash
# Connect to MongoDB
mongosh "mongodb://username:password@host:port/database"

# Show databases
show dbs

# Use database
use nalco_production

# Show collections
show collections

# Find documents
db.users.find().pretty()

# Create index
db.users.createIndex({email: 1}, {unique: true})

# Database statistics
db.stats()

# Collection statistics
db.users.stats()
```

---

## 🎉 Conclusion

Your NALCO connectNALCO application is now configured with a robust MongoDB setup featuring:

✅ **Custom user management** with your organization's data  
✅ **Secure authentication** with proper password hashing  
✅ **Role-based access control** for different user types  
✅ **Production-ready configuration** with monitoring and backups  
✅ **Scalable architecture** ready for growth  

For additional support or custom configurations, please contact your system administrator or refer to the troubleshooting section above.
