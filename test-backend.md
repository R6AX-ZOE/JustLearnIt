# Backend API Testing Guide

## Test Backend Server Status

### 1. Check if server is running
```powershell
netstat -ano | findstr :3002 | findstr LISTENING
```

### 2. Test server root endpoint
```powershell
Invoke-WebRequest -Uri http://localhost:3002/
```

### 3. Test delete directory API (with example IDs)
```powershell
Invoke-WebRequest -Uri http://localhost:3002/api/learning/project/YOUR_PROJECT_ID/directory/YOUR_DIRECTORY_ID -Method DELETE
```

## How to View Backend Logs

### Option 1: Run server in terminal
```powershell
node server.js
```
Then perform actions in the frontend and watch the console output.

### Option 2: Check running server logs
If the server is already running, you can:
1. Kill the existing server: `taskkill /F /PID <PID>`
2. Start a new server: `node server.js`
3. Perform actions in the frontend
4. Watch the console output

## What to Look for in Logs

When you perform a delete action, you should see:

1. **Request received**:
```
=== 2026-04-07T18:30:00.000Z ===
DELETE /api/learning/project/123/directory/456
```

2. **Route handler execution**:
```
=== DELETE Directory Request ===
Project ID: 123
Directory ID: 456
```

3. **Processing result**:
```
Project found: My Project
Project directories: [...]
Directory found at index: 0
Directory deleted successfully
```

## Common Issues

### 404 Error
- **Cause**: Route not found
- **Check**: Backend server is running with latest code
- **Solution**: Restart backend server

### Project Not Found
- **Cause**: Project ID doesn't exist
- **Check**: Project ID in request matches existing project
- **Solution**: Verify project exists in database

### Directory Not Found
- **Cause**: Directory ID doesn't exist in project
- **Check**: Directory ID in request matches existing directory
- **Solution**: Verify directory exists in project structure
