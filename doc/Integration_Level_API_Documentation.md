# Integration Level API Documentation

This document provides detailed information about the Integration Level API endpoints for managing learning projects and schema associations.

## Base URL

All API endpoints are prefixed with `/api/integration`.

## Project Management API

### 1. Get All Projects for a User

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
      "name": "Project Name",
      "description": "Project Description",
      "userId": "user123",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "graphs": [
        {
          "id": "1",
          "name": "Main Graph",
          "description": "Default graph",
          "nodes": [],
          "edges": []
        }
      ]
    }
  ]
}
```

### 1.1 Get All Projects for a User (Basic Information)

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
      "name": "Project Name",
      "description": "Project Description",
      "userId": "user123",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Get a Single Project

**Request Method:** GET
**Endpoint:** `/project/:id`

**Parameters:**
- `id` (path parameter): Project ID

**Response:**
```json
{
  "project": {
    "id": "1234567890",
    "name": "Project Name",
    "description": "Project Description",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "graphs": [
      {
        "id": "1",
        "name": "Main Graph",
        "description": "Default graph",
        "nodes": [],
        "edges": []
      }
    ]
  }
}
```

### 3. Create a New Project

**Request Method:** POST
**Endpoint:** `/projects`

**Request Body:**
```json
{
  "name": "Project Name",
  "description": "Project Description",
  "userId": "user123"
}
```

**Parameters:**
- `name` (required): Project name
- `description` (optional): Project description
- `userId` (required): User ID

**Response:**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": "1234567890",
    "name": "Project Name",
    "description": "Project Description",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "graphs": [
      {
        "id": "1",
        "name": "Main Graph",
        "description": "Default graph",
        "nodes": [],
        "edges": []
      }
    ]
  }
}
```

### 4. Update a Project

**Request Method:** PUT
**Endpoint:** `/project/:id`

**Request Body:**
```json
{
  "name": "New Project Name",
  "description": "New Project Description",
  "graphs": [
    {
      "id": "1",
      "name": "Main Graph",
      "description": "Default graph",
      "nodes": [],
      "edges": []
    }
  ]
}
```

**Parameters:**
- `id` (path parameter): Project ID
- `name` (optional): Project name
- `description` (optional): Project description
- `graphs` (optional): Project graphs list

**Response:**
```json
{
  "message": "Project updated successfully",
  "project": {
    "id": "1234567890",
    "name": "New Project Name",
    "description": "New Project Description",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "graphs": [
      {
        "id": "1",
        "name": "Main Graph",
        "description": "Default graph",
        "nodes": [],
        "edges": []
      }
    ]
  }
}
```

### 5. Delete a Project

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

## Graph Management API

### 1. Get All Graphs for a Project

**Request Method:** GET
**Endpoint:** `/project/:projectId/graphs`

**Parameters:**
- `projectId` (path parameter): Project ID

**Response:**
```json
{
  "graphs": [
    {
      "id": "1",
      "name": "Main Graph",
      "description": "Default graph",
      "nodes": [],
      "edges": []
    }
  ]
}
```

### 2. Get a Single Graph

**Request Method:** GET
**Endpoint:** `/project/:projectId/graph/:graphId`

**Parameters:**
- `projectId` (path parameter): Project ID
- `graphId` (path parameter): Graph ID

**Response:**
```json
{
  "graph": {
    "id": "1",
    "name": "Main Graph",
    "description": "Default graph",
    "nodes": [],
    "edges": []
  }
}
```

### 3. Create a New Graph

**Request Method:** POST
**Endpoint:** `/project/:projectId/graphs`

**Request Body:**
```json
{
  "name": "Graph Name",
  "description": "Graph Description"
}
```

**Parameters:**
- `projectId` (path parameter): Project ID
- `name` (required): Graph name
- `description` (optional): Graph description

**Response:**
```json
{
  "message": "Graph created successfully",
  "project": {
    "id": "1234567890",
    "name": "Project Name",
    "description": "Project Description",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "graphs": [
      {
        "id": "1",
        "name": "Main Graph",
        "description": "Default graph",
        "nodes": [],
        "edges": []
      },
      {
        "id": "1234567891",
        "name": "Graph Name",
        "description": "Graph Description",
        "nodes": [],
        "edges": []
      }
    ]
  },
  "graph": {
    "id": "1234567891",
    "name": "Graph Name",
    "description": "Graph Description",
    "nodes": [],
    "edges": []
  }
}
```

### 4. Update a Graph

**Request Method:** PUT
**Endpoint:** `/project/:projectId/graph/:graphId`

**Request Body:**
```json
{
  "name": "New Graph Name",
  "description": "New Graph Description",
  "nodes": [
    {
      "id": "1",
      "type": "input",
      "data": {
        "label": "Node 1",
        "content": "Node 1 content"
      },
      "position": {
        "x": 100,
        "y": 100
      }
    }
  ],
  "edges": [
    {
      "id": "1-2",
      "source": "1",
      "target": "2"
    }
  ]
}
```

**Parameters:**
- `projectId` (path parameter): Project ID
- `graphId` (path parameter): Graph ID
- `name` (optional): Graph name
- `description` (optional): Graph description
- `nodes` (optional): Graph nodes list
- `edges` (optional): Graph edges list

**Response:**
```json
{
  "message": "Graph updated successfully",
  "project": {
    "id": "1234567890",
    "name": "Project Name",
    "description": "Project Description",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "graphs": [
      {
        "id": "1",
        "name": "New Graph Name",
        "description": "New Graph Description",
        "nodes": [
          {
            "id": "1",
            "type": "input",
            "data": {
              "label": "Node 1",
              "content": "Node 1 content"
            },
            "position": {
              "x": 100,
              "y": 100
            }
          }
        ],
        "edges": [
          {
            "id": "1-2",
            "source": "1",
            "target": "2"
          }
        ]
      }
    ]
  },
  "graph": {
    "id": "1",
    "name": "New Graph Name",
    "description": "New Graph Description",
    "nodes": [
      {
        "id": "1",
        "type": "input",
        "data": {
          "label": "Node 1",
          "content": "Node 1 content"
        },
        "position": {
          "x": 100,
          "y": 100
        }
      }
    ],
    "edges": [
      {
        "id": "1-2",
        "source": "1",
        "target": "2"
      }
    ]
  }
}
```

### 5. Delete a Graph

**Request Method:** DELETE
**Endpoint:** `/project/:projectId/graph/:graphId`

**Parameters:**
- `projectId` (path parameter): Project ID
- `graphId` (path parameter): Graph ID

**Response:**
```json
{
  "message": "Graph deleted successfully",
  "project": {
    "id": "1234567890",
    "name": "Project Name",
    "description": "Project Description",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "graphs": []
  }
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
  "name": "Project Name",
  "description": "Project Description",
  "userId": "user123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "graphs": [
    // Graphs list
  ]
}
```

### Graph

```json
{
  "id": "1",
  "name": "Graph Name",
  "description": "Graph Description",
  "nodes": [
    // Nodes list
  ],
  "edges": [
    // Edges list
  ]
}
```

### Node

```json
{
  "id": "1",
  "type": "custom-type",
  "data": {
    "label": "Node Label",
    "content": "Node Content",
    "type": "custom-type",
    "prerequisites": ["2", "3"],
    "applications": ["4", "5"],
    "description": "Node Description"
  },
  "position": {
    "x": 100,
    "y": 100
  }
}
```

**Note:** The `type` property is now an editable string, allowing users to specify custom node types. It appears both at the top level of the node object and within the `data` object for consistency.

### Edge

```json
{
  "id": "1-2",
  "source": "1",
  "target": "2"
}
```

## Usage Examples

### Create a New Project

```bash
curl -X POST http://localhost:3002/api/integration/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Learning Project", "description": "My learning project", "userId": "user123"}'
```

### Create a New Graph

```bash
curl -X POST http://localhost:3002/api/integration/project/1234567890/graphs \
  -H "Content-Type: application/json" \
  -d '{"name": "Knowledge Graph", "description": "My knowledge graph"}'
```

### Update a Graph

```bash
curl -X PUT http://localhost:3002/api/integration/project/1234567890/graph/1 \
  -H "Content-Type: application/json" \
  -d '{"nodes": [{"id": "1", "type": "input", "data": {"label": "Node 1"}, "position": {"x": 100, "y": 100}}]}'
```

### Get All Projects for a User

```bash
curl http://localhost:3002/api/integration/projects/user123
```

### Get All Projects for a User (Basic Information)

```bash
curl http://localhost:3002/api/integration/projects/user123/basic
```

## Notes

1. All API calls should ensure the user is logged in to verify permissions.
2. Data is persisted in the `integration.json` file.
3. When updating a graph, it's recommended to update both `nodes` and `edges` to ensure data consistency.
4. The `prerequisites` and `applications` fields of nodes store lists of other node IDs.
5. To save tokens when integrating with AI systems, it's recommended to use the basic information endpoint (`/projects/:userId/basic`) instead of the full information endpoint (`/projects/:userId`).