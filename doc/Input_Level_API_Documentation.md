# Input Level API Documentation

This document provides detailed information about the Input Level API endpoints for managing learning projects, directories, and content.

## Base URL

All API endpoints are prefixed with `/api/learning`.

## Important Note for AI Integration

**To save tokens when using AI services, prefer using basic information APIs instead of full information APIs.**

- When you only need project metadata, consider requesting only necessary fields
- This significantly reduces token usage when AI needs to understand the project structure without detailed content

## Project Management API

### 1. Create a New Project

**Request Method:** POST
**Endpoint:** `/projects`

**Request Body:**
```json
{
  "name": "My Learning Project",
  "overview": "A comprehensive learning project about web development",
  "userId": "user123"
}
```

**Parameters:**
- `name` (required): Project name
- `overview` (optional): Project overview/description
- `userId` (required): User ID

**Response:**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": "1234567890",
    "name": "My Learning Project",
    "overview": "A comprehensive learning project about web development",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "structure": {
      "directories": []
    }
  }
}
```

### 2. Get All Projects for a User

**Request Method:** GET
**Endpoint:** `/projects/:userId`

**Parameters:**
- `userId` (path parameter): User ID

**Response:**
```json
{
  "projects": [
    {
      "id": "1234567890",
      "name": "My Learning Project",
      "overview": "A comprehensive learning project about web development",
      "userId": "user123",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "structure": {
        "directories": [
          {
            "id": "1",
            "name": "HTML Basics",
            "description": "Introduction to HTML",
            "content": [],
            "subdirectories": []
          }
        ]
      }
    }
  ]
}
```

### 2.1. Get All Projects for a User (Basic Information)

**Request Method:** GET
**Endpoint:** `/projects/:userId/basic`

**Parameters:**
- `userId` (path parameter): User ID

**Response:**
```json
{
  "projects": [
    {
      "id": "1234567890",
      "name": "My Learning Project",
      "overview": "A comprehensive learning project about web development",
      "userId": "user123",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Note:** This endpoint is recommended for AI integration to save tokens, as it returns only essential project metadata without the full structure.

### 3. Get a Single Project

**Request Method:** GET
**Endpoint:** `/project/:id`

**Parameters:**
- `id` (path parameter): Project ID

**Response:**
```json
{
  "project": {
    "id": "1234567890",
    "name": "My Learning Project",
    "overview": "A comprehensive learning project about web development",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "structure": {
      "directories": [
        {
          "id": "1",
          "name": "HTML Basics",
          "description": "Introduction to HTML",
          "content": [],
          "subdirectories": []
        }
      ]
    }
  }
}
```

### 4. Delete a Project

**Request Method:** DELETE
**Endpoint:** `/project/:id`

**Parameters:**
- `id` (path parameter): Project ID

**Response:**
```json
{
  "message": "Project deleted successfully"
}
```

## Directory Management API

### 1. Add a Directory to a Project

**Request Method:** POST
**Endpoint:** `/project/:id/directories`

**Request Body:**
```json
{
  "name": "HTML Basics",
  "description": "Introduction to HTML",
  "parentId": null
}
```

**Parameters:**
- `id` (path parameter): Project ID
- `name` (required): Directory name
- `description` (optional): Directory description
- `parentId` (optional): Parent directory ID (for nested directories)

**Response:**
```json
{
  "message": "Directory added successfully",
  "directory": {
    "id": "1",
    "name": "HTML Basics",
    "description": "Introduction to HTML",
    "content": [],
    "subdirectories": []
  },
  "project": {
    "id": "1234567890",
    "name": "My Learning Project",
    "overview": "A comprehensive learning project about web development",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "structure": {
      "directories": [
        {
          "id": "1",
          "name": "HTML Basics",
          "description": "Introduction to HTML",
          "content": [],
          "subdirectories": []
        }
      ]
    }
  }
}
```

**Notes:**
- If `parentId` is not provided, the directory will be added as a top-level directory
- If `parentId` is provided, the directory will be added as a subdirectory under the specified parent

### 2. Delete a Directory

**Request Method:** DELETE
**Endpoint:** `/project/:projectId/directory/:directoryId`

**Parameters:**
- `projectId` (path parameter): Project ID
- `directoryId` (path parameter): Directory ID

**Response:**
```json
{
  "message": "Directory deleted successfully",
  "project": {
    "id": "1234567890",
    "name": "My Learning Project",
    "overview": "A comprehensive learning project about web development",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "structure": {
      "directories": []
    }
  }
}
```

**Notes:**
- Deleting a directory will also delete all its content and subdirectories
- This operation cannot be undone

## Content Management API

### 1. Add Content to a Directory

**Request Method:** POST
**Endpoint:** `/project/:projectId/directory/:directoryId/content`

**Request Body:**
```json
{
  "title": "Introduction to HTML Tags",
  "content": "HTML tags are the building blocks of web pages...",
  "images": [
    {
      "url": "/uploads/image1.png",
      "caption": "HTML Tag Structure"
    }
  ]
}
```

**Parameters:**
- `projectId` (path parameter): Project ID
- `directoryId` (path parameter): Directory ID
- `title` (required): Content title
- `content` (required): Content text
- `images` (optional): Array of image objects with `url` and `caption` fields

**Response:**
```json
{
  "message": "Content added successfully",
  "content": {
    "id": "1",
    "title": "Introduction to HTML Tags",
    "content": "HTML tags are the building blocks of web pages...",
    "images": [
      {
        "url": "/uploads/image1.png",
        "caption": "HTML Tag Structure"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "project": {
    "id": "1234567890",
    "name": "My Learning Project",
    "overview": "A comprehensive learning project about web development",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "structure": {
      "directories": [
        {
          "id": "1",
          "name": "HTML Basics",
          "description": "Introduction to HTML",
          "content": [
            {
              "id": "1",
              "title": "Introduction to HTML Tags",
              "content": "HTML tags are the building blocks of web pages...",
              "images": [
                {
                  "url": "/uploads/image1.png",
                  "caption": "HTML Tag Structure"
                }
              ],
              "createdAt": "2024-01-01T00:00:00.000Z",
              "updatedAt": "2024-01-01T00:00:00.000Z"
            }
          ],
          "subdirectories": []
        }
      ]
    }
  }
}
```

### 2. Update Content

**Request Method:** PUT
**Endpoint:** `/project/:projectId/directory/:directoryId/content/:contentId`

**Request Body:**
```json
{
  "title": "Introduction to HTML Tags (Updated)",
  "content": "HTML tags are the fundamental building blocks of web pages...",
  "images": [
    {
      "url": "/uploads/image1.png",
      "caption": "HTML Tag Structure"
    },
    {
      "url": "/uploads/image2.png",
      "caption": "Example HTML Document"
    }
  ]
}
```

**Parameters:**
- `projectId` (path parameter): Project ID
- `directoryId` (path parameter): Directory ID
- `contentId` (path parameter): Content ID
- `title` (optional): Content title
- `content` (optional): Content text
- `images` (optional): Array of image objects

**Response:**
```json
{
  "message": "Content updated successfully",
  "content": {
    "id": "1",
    "title": "Introduction to HTML Tags (Updated)",
    "content": "HTML tags are the fundamental building blocks of web pages...",
    "images": [
      {
        "url": "/uploads/image1.png",
        "caption": "HTML Tag Structure"
      },
      {
        "url": "/uploads/image2.png",
        "caption": "Example HTML Document"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

### 3. Delete Content

**Request Method:** DELETE
**Endpoint:** `/project/:projectId/directory/:directoryId/content/:contentId`

**Parameters:**
- `projectId` (path parameter): Project ID
- `directoryId` (path parameter): Directory ID
- `contentId` (path parameter): Content ID

**Response:**
```json
{
  "message": "Content deleted successfully"
}
```

## Error Handling

All API endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Name and userId are required"
}
```

### 404 Not Found
```json
{
  "message": "Project not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Error message"
}
```

## Data Structures

### Project

```json
{
  "id": "1234567890",
  "name": "My Learning Project",
  "overview": "A comprehensive learning project about web development",
  "userId": "user123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "structure": {
    "directories": [
      // Directory objects
    ]
  }
}
```

### Directory

```json
{
  "id": "1",
  "name": "HTML Basics",
  "description": "Introduction to HTML",
  "content": [
    // Content objects
  ],
  "subdirectories": [
    // Nested directory objects
  ]
}
```

### Content

```json
{
  "id": "1",
  "title": "Introduction to HTML Tags",
  "content": "HTML tags are the building blocks of web pages...",
  "images": [
    {
      "url": "/uploads/image1.png",
      "caption": "HTML Tag Structure"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Image

```json
{
  "url": "/uploads/image1.png",
  "caption": "HTML Tag Structure"
}
```

## Usage Examples

### Create a New Project

```bash
curl -X POST http://localhost:3002/api/learning/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "My Learning Project", "overview": "A comprehensive learning project about web development", "userId": "user123"}'
```

### Get All Projects for a User

```bash
curl -X GET http://localhost:3002/api/learning/projects/user123
```

### Get All Projects for a User (Basic Information)

```bash
curl -X GET http://localhost:3002/api/learning/projects/user123/basic
```

### Get a Single Project

```bash
curl -X GET http://localhost:3002/api/learning/project/1234567890
```

### Add a Top-Level Directory

```bash
curl -X POST http://localhost:3002/api/learning/project/1234567890/directories \
  -H "Content-Type: application/json" \
  -d '{"name": "HTML Basics", "description": "Introduction to HTML"}'
```

### Add a Subdirectory

```bash
curl -X POST http://localhost:3002/api/learning/project/1234567890/directories \
  -H "Content-Type: application/json" \
  -d '{"name": "HTML Forms", "description": "Working with HTML forms", "parentId": "1"}'
```

### Add Content to a Directory

```bash
curl -X POST http://localhost:3002/api/learning/project/1234567890/directory/1/content \
  -H "Content-Type: application/json" \
  -d '{"title": "Introduction to HTML Tags", "content": "HTML tags are the building blocks of web pages..."}'
```

### Update Content

```bash
curl -X PUT http://localhost:3002/api/learning/project/1234567890/directory/1/content/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Introduction to HTML Tags (Updated)", "content": "HTML tags are the fundamental building blocks of web pages..."}'
```

### Delete Content

```bash
curl -X DELETE http://localhost:3002/api/learning/project/1234567890/directory/1/content/1
```

### Delete a Directory

```bash
curl -X DELETE http://localhost:3002/api/learning/project/1234567890/directory/1
```

### Delete a Project

```bash
curl -X DELETE http://localhost:3002/api/learning/project/1234567890
```

## Notes

1. All API calls should ensure the user is logged in to verify permissions.
2. Data is persisted in the `projects.json` file.
3. Directories support nested structures through the `parentId` parameter.
4. Content can include images with captions for better learning experience.
5. Deleting a directory will cascade delete all its content and subdirectories.
6. The `updatedAt` timestamp is automatically updated when content or structure changes.
7. To save tokens when using AI services, consider requesting only necessary fields from the API responses.
