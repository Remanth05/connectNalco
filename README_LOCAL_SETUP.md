# Local Development Setup

This guide helps you set up the NALCO Connect project locally after cloning from GitHub.

## Quick Start (No Database Required)

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd nalco-connect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Open http://localhost:8080 in your browser
   - Use the demo credentials to log in:
     - **Employee**: `EMP001` / `emp123`
     - **Authority**: `AUTH001` / `auth123`
     - **Admin**: `ADMIN001` / `admin123`

## Demo Mode Features

When running locally without MongoDB, the application automatically:
- Uses mock data for all features
- Provides demo authentication credentials
- Simulates all API endpoints
- Maintains full functionality for testing

## Optional: MongoDB Setup

If you want to use MongoDB for persistent data:

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Option A: Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service
   - Keep default `MONGODB_URI=mongodb://localhost:27017/nalco_connect`

3. **Option B: MongoDB Atlas**
   - Create account at https://mongodb.com/atlas
   - Create cluster and get connection string
   - Update `MONGODB_URI` in `.env` file

4. **Populate with data:**
   ```bash
   npm run seed-db
   ```

## Deployment

The application is configured for Netlify deployment:
- Build command: `npm run build`
- Publish directory: `dist/spa`
- Function directory: `netlify/functions`

## Troubleshooting

### Invalid Credentials Error
- Ensure you're using the correct demo credentials
- Check browser console for network errors
- Try refreshing the page

### Port Already in Use
```bash
# Kill process using port 8080
lsof -ti:8080 | xargs kill -9
# Or use a different port
PORT=3000 npm run dev
```

### Build Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Support

For issues with local setup:
1. Check this README first
2. Review console errors in browser dev tools
3. Contact the development team
