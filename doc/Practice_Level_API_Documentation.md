# Practice Level API Documentation

This document provides detailed information about the Practice Level API endpoints for managing practice exercises and questions.

## Base URL

All API endpoints are prefixed with `/api/practice`.

## Project Management API

### 1. Get All Projects

**Request Method:** GET
**Endpoint:** `/projects`

**Response:**
```json
{
  "projects": [
    {
      "id": "1234567890",
      "name": "Math Practice",
      "description": "Practice exercises for math",
      "userId": "user123",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "practices": [
        {
          "id": "1",
          "name": "Algebra Practice",
          "description": "Practice algebra problems",
          "questions": []
        }
      ]
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
    "name": "Math Practice",
    "description": "Practice exercises for math",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "practices": [
      {
        "id": "1",
        "name": "Algebra Practice",
        "description": "Practice algebra problems",
        "questions": []
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
  "name": "Math Practice",
  "description": "Practice exercises for math",
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
    "name": "Math Practice",
    "description": "Practice exercises for math",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "practices": []
  }
}
```

### 4. Update a Project

**Request Method:** PUT
**Endpoint:** `/project/:id`

**Request Body:**
```json
{
  "name": "Updated Math Practice",
  "description": "Updated practice exercises for math",
  "practices": [
    {
      "id": "1",
      "name": "Algebra Practice",
      "description": "Practice algebra problems",
      "questions": []
    }
  ]
}
```

**Parameters:**
- `id` (path parameter): Project ID
- `name` (optional): Project name
- `description` (optional): Project description
- `practices` (optional): Project practices list

**Response:**
```json
{
  "message": "Project updated successfully",
  "project": {
    "id": "1234567890",
    "name": "Updated Math Practice",
    "description": "Updated practice exercises for math",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "practices": [
      {
        "id": "1",
        "name": "Algebra Practice",
        "description": "Practice algebra problems",
        "questions": []
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

## Practice Management API

### 1. Get All Practices for a Project

**Request Method:** GET
**Endpoint:** `/project/:projectId/practices`

**Parameters:**
- `projectId` (path parameter): Project ID

**Response:**
```json
{
  "practices": [
    {
      "id": "1",
      "name": "Algebra Practice",
      "description": "Practice algebra problems",
      "questions": []
    }
  ]
}
```

### 2. Get a Single Practice

**Request Method:** GET
**Endpoint:** `/practice/:id`

**Parameters:**
- `id` (path parameter): Practice ID

**Response:**
```json
{
  "practice": {
    "id": "1",
    "name": "Algebra Practice",
    "description": "Practice algebra problems",
    "questions": []
  }
}
```

### 3. Create a New Practice

**Request Method:** POST
**Endpoint:** `/project/:projectId/practices`

**Request Body:**
```json
{
  "name": "Algebra Practice",
  "description": "Practice algebra problems"
}
```

**Parameters:**
- `projectId` (path parameter): Project ID
- `name` (required): Practice name
- `description` (optional): Practice description

**Response:**
```json
{
  "message": "Practice created successfully",
  "project": {
    "id": "1234567890",
    "name": "Math Practice",
    "description": "Practice exercises for math",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "practices": [
      {
        "id": "1",
        "name": "Algebra Practice",
        "description": "Practice algebra problems",
        "questions": []
      }
    ]
  },
  "practice": {
    "id": "1",
    "name": "Algebra Practice",
    "description": "Practice algebra problems",
    "questions": []
  }
}
```

### 4. Update a Practice

**Request Method:** PUT
**Endpoint:** `/practice/:id`

**Request Body:**
```json
{
  "name": "Updated Algebra Practice",
  "description": "Updated practice algebra problems",
  "questions": []
}
```

**Parameters:**
- `id` (path parameter): Practice ID
- `name` (optional): Practice name
- `description` (optional): Practice description
- `questions` (optional): Practice questions list

**Response:**
```json
{
  "message": "Practice updated successfully",
  "project": {
    "id": "1234567890",
    "name": "Math Practice",
    "description": "Practice exercises for math",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "practices": [
      {
        "id": "1",
        "name": "Updated Algebra Practice",
        "description": "Updated practice algebra problems",
        "questions": []
      }
    ]
  },
  "practice": {
    "id": "1",
    "name": "Updated Algebra Practice",
    "description": "Updated practice algebra problems",
    "questions": []
  }
}
```

### 5. Delete a Practice

**Request Method:** DELETE
**Endpoint:** `/practice/:id`

**Parameters:**
- `id` (path parameter): Practice ID

**Response:**
```json
{
  "message": "Practice deleted successfully",
  "project": {
    "id": "1234567890",
    "name": "Math Practice",
    "description": "Practice exercises for math",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "practices": []
  }
}
```

## Question Management API

### 1. Get All Questions for a Practice

**Request Method:** GET
**Endpoint:** `/practice/:practiceId/questions`

**Parameters:**
- `practiceId` (path parameter): Practice ID

**Response:**
```json
{
  "questions": [
    {
      "id": "1",
      "type": "multiple-choice",
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "B",
      "feedback": "Correct! 2 + 2 equals 4."
    }
  ]
}
```

### 2. Get a Single Question

**Request Method:** GET
**Endpoint:** `/question/:id`

**Parameters:**
- `id` (path parameter): Question ID

**Response:**
```json
{
  "question": {
    "id": "1",
    "type": "multiple-choice",
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": "B",
    "feedback": "Correct! 2 + 2 equals 4."
  }
}
```

### 3. Create a New Question

**Request Method:** POST
**Endpoint:** `/practice/:practiceId/questions`

**Request Body (Multiple Choice):**
```json
{
  "type": "multiple-choice",
  "question": "What is 2 + 2?",
  "options": ["3", "4", "5", "6"],
  "correctAnswer": "B",
  "feedback": "Correct! 2 + 2 equals 4."
}
```

**Request Body (Fill in the Blank):**
```json
{
  "type": "fill-blank",
  "question": "What is the capital of France?",
  "correctAnswer": "Paris",
  "feedback": "Correct! The capital of France is Paris."
}
```

**Request Body (Essay):**
```json
{
  "type": "essay",
  "question": "Explain the concept of gravity.",
  "feedback": "Your answer will be evaluated based on clarity and completeness."
}
```

**Parameters:**
- `practiceId` (path parameter): Practice ID
- `type` (required): Question type (multiple-choice, fill-blank, essay)
- `question` (required): Question text
- `options` (required for multiple-choice): Array of options
- `correctAnswer` (required for multiple-choice and fill-blank): Correct answer
- `feedback` (optional): Feedback for the question

**Response:**
```json
{
  "message": "Question created successfully",
  "question": {
    "id": "1",
    "type": "multiple-choice",
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": "B",
    "feedback": "Correct! 2 + 2 equals 4."
  }
}
```

### 4. Update a Question

**Request Method:** PUT
**Endpoint:** `/question/:id`

**Request Body:**
```json
{
  "type": "multiple-choice",
  "question": "What is 3 + 3?",
  "options": ["5", "6", "7", "8"],
  "correctAnswer": "B",
  "feedback": "Correct! 3 + 3 equals 6."
}
```

**Parameters:**
- `id` (path parameter): Question ID
- `type` (optional): Question type
- `question` (optional): Question text
- `options` (optional): Array of options
- `correctAnswer` (optional): Correct answer
- `feedback` (optional): Feedback for the question

**Response:**
```json
{
  "message": "Question updated successfully",
  "question": {
    "id": "1",
    "type": "multiple-choice",
    "question": "What is 3 + 3?",
    "options": ["5", "6", "7", "8"],
    "correctAnswer": "B",
    "feedback": "Correct! 3 + 3 equals 6."
  }
}
```

### 5. Delete a Question

**Request Method:** DELETE
**Endpoint:** `/question/:id`

**Parameters:**
- `id` (path parameter): Question ID

**Response:**
```json
{
  "message": "Question deleted successfully",
  "project": {
    "id": "1234567890",
    "name": "Math Practice",
    "description": "Practice exercises for math",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "practices": [
      {
        "id": "1",
        "name": "Algebra Practice",
        "description": "Practice algebra problems",
        "questions": []
      }
    ]
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
  "name": "Math Practice",
  "description": "Practice exercises for math",
  "userId": "user123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "practices": [
    // Practices list
  ]
}
```

### Practice

```json
{
  "id": "1",
  "name": "Algebra Practice",
  "description": "Practice algebra problems",
  "questions": [
    // Questions list
  ]
}
```

### Question

**Multiple Choice:**
```json
{
  "id": "1",
  "type": "multiple-choice",
  "question": "What is 2 + 2?",
  "options": ["3", "4", "5", "6"],
  "correctAnswer": "B",
  "feedback": "Correct! 2 + 2 equals 4."
}
```

**Fill in the Blank:**
```json
{
  "id": "2",
  "type": "fill-blank",
  "question": "What is the capital of France?",
  "correctAnswer": "Paris",
  "feedback": "Correct! The capital of France is Paris."
}
```

**Essay:**
```json
{
  "id": "3",
  "type": "essay",
  "question": "Explain the concept of gravity.",
  "feedback": "Your answer will be evaluated based on clarity and completeness."
}
```

## Usage Examples

### Create a New Project

```bash
curl -X POST http://localhost:3002/api/practice/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Math Practice", "description": "Practice exercises for math", "userId": "user123"}'
```

### Create a New Practice

```bash
curl -X POST http://localhost:3002/api/practice/project/1234567890/practices \
  -H "Content-Type: application/json" \
  -d '{"name": "Algebra Practice", "description": "Practice algebra problems"}'
```

### Create a New Multiple Choice Question

```bash
curl -X POST http://localhost:3002/api/practice/practice/1/questions \
  -H "Content-Type: application/json" \
  -d '{"type": "multiple-choice", "question": "What is 2 + 2?", "options": ["3", "4", "5", "6"], "correctAnswer": "B", "feedback": "Correct! 2 + 2 equals 4."}'
```

### Create a New Fill in the Blank Question

```bash
curl -X POST http://localhost:3002/api/practice/practice/1/questions \
  -H "Content-Type: application/json" \
  -d '{"type": "fill-blank", "question": "What is the capital of France?", "correctAnswer": "Paris", "feedback": "Correct! The capital of France is Paris."}'
```

### Create a New Essay Question

```bash
curl -X POST http://localhost:3002/api/practice/practice/1/questions \
  -H "Content-Type: application/json" \
  -d '{"type": "essay", "question": "Explain the concept of gravity.", "feedback": "Your answer will be evaluated based on clarity and completeness."}'
```

## Notes

1. All API calls should ensure the user is logged in to verify permissions.
2. Data is persisted in the `practice.json` file.
3. For essay questions, the feedback is currently set to the user's answer itself, but this will be updated to use AI-generated feedback in the future.
4. The `type` property for questions can be one of: "multiple-choice", "fill-blank", or "essay".