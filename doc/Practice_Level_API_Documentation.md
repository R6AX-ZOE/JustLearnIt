# Practice Level API Documentation

This document provides detailed information about the Practice Level API endpoints for managing practice exercises and questions.

## Base URL

All API endpoints are prefixed with `/api/practice`.

## Important Note for AI Integration

**To save tokens when using AI services, prefer using basic information APIs instead of full information APIs.**

- Use `/projects/:userId/basic` instead of `/projects/:userId` when you only need project metadata
- Basic information APIs return only essential fields (id, name, description, userId, createdAt, updatedAt) without the full practices and questions data
- This significantly reduces token usage when AI needs to understand the project structure without detailed content

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

### 1.1. Get All Projects for a User

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

### 1.2. Get All Projects for a User (Basic Information)

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
      "name": "Math Practice",
      "description": "Practice exercises for math",
      "userId": "user123",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Note:** This endpoint is recommended for AI integration to save tokens.

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
      "feedback": "Correct! 2 + 2 equals 4.",
      "responseFunction": "return isCorrect ? '### Correct!\\n\\nYou got it right. The answer is ' + question.correctAnswer + '.\\n\\n**Explanation:**\n2 + 2 = 4' : '### Incorrect\\n\\nThe correct answer is ' + question.correctAnswer + '.\\n\\n**Try again!**'
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
    "feedback": "Correct! 2 + 2 equals 4.",
    "responseFunction": "return isCorrect ? '### Correct!\\n\\nYou got it right. The answer is ' + question.correctAnswer + '.\\n\\n**Explanation:**\n2 + 2 = 4' : '### Incorrect\\n\\nThe correct answer is ' + question.correctAnswer + '.\\n\\n**Try again!**'
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
  "feedback": "Correct! 2 + 2 equals 4.",
  "responseFunction": "return isCorrect ? '### Correct!\\n\\nYou got it right. The answer is ' + question.correctAnswer + '.\\n\\n**Explanation:**\n2 + 2 = 4' : '### Incorrect\\n\\nThe correct answer is ' + question.correctAnswer + '.\\n\\n**Try again!**'
}
```

**Request Body (Fill in the Blank):**
```json
{
  "type": "fill-blank",
  "question": "What is the capital of France?",
  "correctAnswer": "Paris",
  "feedback": "Correct! The capital of France is Paris.",
  "responseFunction": "return isCorrect ? '### Correct!\\n\\nYou got it right. The capital of France is Paris.' : '### Incorrect\\n\\nThe correct answer is Paris.\\n\\n**Try again!**'
}
```

**Request Body (Essay):**
```json
{
  "type": "essay",
  "question": "Explain the concept of gravity.",
  "feedback": "Your answer will be evaluated based on clarity and completeness.",
  "responseFunction": "return '### Your Answer\\n\\n' + answer + '\\n\\n**Feedback:**\nYour answer has been submitted. It will be evaluated based on clarity and completeness.'"
}
```

**Parameters:**
- `practiceId` (path parameter): Practice ID
- `type` (required): Question type (multiple-choice, fill-blank, essay)
- `question` (required): Question text
- `options` (required for multiple-choice): Array of options
- `correctAnswer` (required for multiple-choice and fill-blank): Correct answer
- `feedback` (optional): Default feedback for the question
- `responseFunction` (optional): JavaScript function to generate dynamic feedback (supports Markdown and KaTeX)
- `position` (optional): Position to insert the question (0-based index). If not provided, question is added to the end.

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
    "feedback": "Correct! 2 + 2 equals 4.",
    "responseFunction": "return isCorrect ? '### Correct!\\n\\nYou got it right. The answer is ' + question.correctAnswer + '.\\n\\n**Explanation:**\n2 + 2 = 4' : '### Incorrect\\n\\nThe correct answer is ' + question.correctAnswer + '.\\n\\n**Try again!**'
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
  "feedback": "Correct! 3 + 3 equals 6.",
  "responseFunction": "return isCorrect ? '### Correct!\\n\\nYou got it right. The answer is ' + question.correctAnswer + '.\\n\\n**Explanation:**\n3 + 3 = 6' : '### Incorrect\\n\\nThe correct answer is ' + question.correctAnswer + '.\\n\\n**Try again!**'
}
```

**Parameters:**
- `id` (path parameter): Question ID
- `type` (optional): Question type
- `question` (optional): Question text
- `options` (optional): Array of options
- `correctAnswer` (optional): Correct answer
- `feedback` (optional): Feedback for the question
- `responseFunction` (optional): JavaScript function to generate dynamic feedback

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
    "feedback": "Correct! 3 + 3 equals 6.",
    "responseFunction": "return isCorrect ? '### Correct!\\n\\nYou got it right. The answer is ' + question.correctAnswer + '.\\n\\n**Explanation:**\n3 + 3 = 6' : '### Incorrect\\n\\nThe correct answer is ' + question.correctAnswer + '.\\n\\n**Try again!**'
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

### 6. Submit Answer and Get Feedback

**Request Method:** POST
**Endpoint:** `/question/:id/submit`

**Request Body:**
```json
{
  "answer": "B"
}
```

**Parameters:**
- `id` (path parameter): Question ID
- `answer` (required): User's answer to the question

**Response:**
```json
{
  "questionId": "1",
  "userAnswer": "B",
  "isCorrect": true,
  "feedback": "### Correct!\n\nYou got it right. The answer is B.\n\n**Explanation:**\n2 + 2 = 4",
  "isMarkdown": true
}
```

**Notes:**
- For multiple-choice questions, the answer should be the option letter (A, B, C, D, etc.)
- For fill-in-the-blank questions, the answer should be the text answer
- For essay questions, the answer should be the essay text
- Currently, essay questions return the user's answer as feedback; in the future, AI-generated feedback will be provided
- The `isCorrect` field indicates whether the answer is correct (for essay questions, this is always true)
- The `feedback` field can contain Markdown and KaTeX syntax, which should be rendered by the frontend
- The `isMarkdown` field indicates that the feedback should be rendered as Markdown

## Student Progress API

### 1. Get In-Progress Sessions

**Request Method:** GET
**Endpoint:** `/student/:userId/in-progress`

**Parameters:**
- `userId` (path parameter): User ID

**Response:**
```json
{
  "sessions": [
    {
      "id": "session_123456789",
      "userId": "user123",
      "practiceId": "456",
      "practiceName": "Math Basics",
      "questions": [...],
      "currentQuestionIndex": 2,
      "answers": {},
      "startTime": "2026-04-20T10:00:00Z",
      "lastActivityTime": "2026-04-20T10:15:00Z",
      "status": "in_progress",
      "score": null,
      "totalQuestions": 5
    }
  ]
}
```

### 2. Get History Sessions

**Request Method:** GET
**Endpoint:** `/student/:userId/history`

**Parameters:**
- `userId` (path parameter): User ID

**Response:**
```json
{
  "history": [
    {
      "id": "history_123456789",
      "userId": "user123",
      "sessionId": "session_987654321",
      "practiceId": "456",
      "practiceName": "Math Basics",
      "questions": [...],
      "answers": {},
      "score": 80,
      "correctCount": 4,
      "totalQuestions": 5,
      "startTime": "2026-04-19T14:00:00Z",
      "endTime": "2026-04-19T14:30:00Z",
      "completedAt": "2026-04-19T14:30:00Z"
    }
  ]
}
```

### 3. Start a New Session

**Request Method:** POST
**Endpoint:** `/student/:userId/session`

**Request Body:**
```json
{
  "practiceId": "456",
  "sourceQuestions": [...] // Optional: Array of question objects for custom sessions
}
```

**Parameters:**
- `userId` (path parameter): User ID
- `practiceId` (required): Practice ID
- `sourceQuestions` (optional): Array of question objects for custom sessions

**Response:**
```json
{
  "message": "Session started successfully",
  "session": {
    "id": "session_123456789",
    "userId": "user123",
    "practiceId": "456",
    "practiceName": "Math Basics",
    "questions": [...],
    "currentQuestionIndex": 0,
    "answers": {},
    "startTime": "2026-04-25T14:00:00Z",
    "lastActivityTime": "2026-04-25T14:00:00Z",
    "status": "in_progress",
    "score": null,
    "totalQuestions": 5
  }
}
```

### 4. Get Session Details

**Request Method:** GET
**Endpoint:** `/session/:sessionId`

**Parameters:**
- `sessionId` (path parameter): Session ID

**Response:**
```json
{
  "session": {
    "id": "session_123456789",
    "userId": "user123",
    "practiceId": "456",
    "practiceName": "Math Basics",
    "questions": [...],
    "currentQuestionIndex": 2,
    "answers": {},
    "startTime": "2026-04-25T14:00:00Z",
    "lastActivityTime": "2026-04-25T14:15:00Z",
    "status": "in_progress",
    "score": null,
    "totalQuestions": 5
  }
}
```

### 5. Get Session Preview

**Request Method:** GET
**Endpoint:** `/session/:sessionId/preview`

**Parameters:**
- `sessionId` (path parameter): Session ID

**Response:**
```json
{
  "sessionId": "session_123456789",
  "practiceName": "Math Basics",
  "totalQuestions": 5,
  "previewQuestions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"]
    }
  ]
}
```

### 6. Get Session Start Page

**Request Method:** GET
**Endpoint:** `/session/:sessionId/start`

**Parameters:**
- `sessionId` (path parameter): Session ID

**Response:**
```json
{
  "sessionId": "session_123456789",
  "practiceName": "Math Basics",
  "totalQuestions": 5,
  "startTime": "2026-04-25T14:00:00Z",
  "currentQuestionIndex": 0
}
```

### 7. Submit Answer

**Request Method:** POST
**Endpoint:** `/session/:sessionId/submit`

**Request Body:**
```json
{
  "answer": "B"
}
```

**Parameters:**
- `sessionId` (path parameter): Session ID
- `answer` (required): User's answer

**Response:**
```json
{
  "questionId": "q1",
  "userAnswer": "B",
  "isCorrect": true,
  "feedback": "### Correct!\n\nYou got it right.",
  "isMarkdown": true,
  "currentQuestionIndex": 0,
  "totalQuestions": 5
}
```

### 8. Get Next Question

**Request Method:** POST
**Endpoint:** `/session/:sessionId/next`

**Parameters:**
- `sessionId` (path parameter): Session ID

**Response:**
```json
{
  "currentQuestionIndex": 1,
  "question": {
    "id": "q2",
    "type": "multiple-choice",
    "question": "What is 3 + 3?",
    "options": ["5", "6", "7", "8"]
  },
  "hasAnswered": false
}
```

### 9. Complete Session

**Request Method:** POST
**Endpoint:** `/session/:sessionId/complete`

**Parameters:**
- `sessionId` (path parameter): Session ID

**Response:**
```json
{
  "message": "Session completed successfully",
  "summary": {
    "score": 80,
    "correctCount": 4,
    "totalQuestions": 5,
    "practiceName": "Math Basics"
  }
}
```

### 10. Get Session End Page

**Request Method:** GET
**Endpoint:** `/session/:sessionId/end`

**Parameters:**
- `sessionId` (path parameter): Session ID

**Response:**
```json
{
  "sessionId": "session_123456789",
  "practiceName": "Math Basics",
  "score": 80,
  "correctCount": 4,
  "totalQuestions": 5,
  "completedAt": "2026-04-25T14:30:00Z",
  "questions": [...],
  "answers": {}
}
```

### 11. Delete History Record

**Request Method:** DELETE
**Endpoint:** `/student/:userId/history/:historyId`

**Parameters:**
- `userId` (path parameter): User ID
- `historyId` (path parameter): History record ID

**Response:**
```json
{
  "message": "History entry deleted successfully"
}
```

### 12. Delete In-Progress Session

**Request Method:** DELETE
**Endpoint:** `/student/:userId/in-progress/:sessionId`

**Parameters:**
- `userId` (path parameter): User ID
- `sessionId` (path parameter): Session ID

**Response:**
```json
{
  "message": "Session deleted successfully"
}
```

## Question Node API

### 1. Get Question Nodes

**Request Method:** GET
**Endpoint:** `/question/:id/nodes`

**Parameters:**
- `id` (path parameter): Question ID

**Response:**
```json
{
  "questionId": "q1",
  "nodes": ["node1", "node2"]
}
```

### 2. Update Question Nodes

**Request Method:** PUT
**Endpoint:** `/question/:id/nodes`

**Request Body:**
```json
{
  "nodes": ["node1", "node3"]
}
```

**Parameters:**
- `id` (path parameter): Question ID
- `nodes` (required): Array of node IDs

**Response:**
```json
{
  "message": "Question nodes updated successfully",
  "question": {
    "id": "q1",
    "type": "multiple-choice",
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": "B",
    "nodes": ["node1", "node3"]
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
  "feedback": "Correct! 2 + 2 equals 4.",
  "responseFunction": "return isCorrect ? '### Correct!\\n\\nYou got it right. The answer is ' + question.correctAnswer + '.\\n\\n**Explanation:**\n2 + 2 = 4' : '### Incorrect\\n\\nThe correct answer is ' + question.correctAnswer + '.\\n\\n**Try again!**'
}
```

**Fill in the Blank:**
```json
{
  "id": "2",
  "type": "fill-blank",
  "question": "What is the capital of France?",
  "correctAnswer": "Paris",
  "feedback": "Correct! The capital of France is Paris.",
  "responseFunction": "return isCorrect ? '### Correct!\\n\\nYou got it right. The capital of France is Paris.' : '### Incorrect\\n\\nThe correct answer is Paris.\\n\\n**Try again!**'
}
```

**Essay:**
```json
{
  "id": "3",
  "type": "essay",
  "question": "Explain the concept of gravity.",
  "feedback": "Your answer will be evaluated based on clarity and completeness.",
  "responseFunction": "return '### Your Answer\\n\\n' + answer + '\\n\\n**Feedback:**\nYour answer has been submitted. It will be evaluated based on clarity and completeness.'"
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

### Create a New Multiple Choice Question with Response Function

```bash
curl -X POST http://localhost:3002/api/practice/practice/1/questions \
  -H "Content-Type: application/json" \
  -d '{"type": "multiple-choice", "question": "What is 2 + 2?", "options": ["3", "4", "5", "6"], "correctAnswer": "B", "feedback": "Correct! 2 + 2 equals 4.", "responseFunction": "return isCorrect ? '### Correct!\\n\\nYou got it right. The answer is ' + question.correctAnswer + '.\\n\\n**Explanation:**\\n2 + 2 = 4' : '### Incorrect\\n\\nThe correct answer is ' + question.correctAnswer + '.\\n\\n**Try again!**'"}'
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

### Create a Question at Specific Position

```bash
curl -X POST http://localhost:3002/api/practice/practice/1/questions \
  -H "Content-Type: application/json" \
  -d '{"type": "multiple-choice", "question": "What is 1 + 1?", "options": ["1", "2", "3", "4"], "correctAnswer": "B", "feedback": "Correct! 1 + 1 equals 2.", "position": 0}'
```

### Get All Projects for a User

```bash
curl -X GET http://localhost:3002/api/practice/projects/user123
```

### Get All Projects for a User (Basic Information)

```bash
curl -X GET http://localhost:3002/api/practice/projects/user123/basic
```

### Submit an Answer and Get Feedback

```bash
curl -X POST http://localhost:3002/api/practice/question/1/submit \
  -H "Content-Type: application/json" \
  -d '{"answer": "B"}'
```

## Notes

1. All API calls should ensure the user is logged in to verify permissions.
2. Data is persisted in the `practice.json` file.
3. For essay questions, the feedback is currently set to the user's answer itself, but this will be updated to use AI-generated feedback in the future.
4. The `type` property for questions can be one of: "multiple-choice", "fill-blank", or "essay".
5. To save tokens when using AI services, prefer using basic information APIs (`/projects/:userId/basic`) instead of full information APIs.
6. The submit answer API (`/question/:id/submit`) is designed for future AI integration, where essay questions will receive AI-generated feedback.
7. The `position` parameter for creating questions allows inserting questions at specific positions in the list.
8. The `responseFunction` parameter allows for dynamic feedback generation using JavaScript, supporting Markdown and KaTeX syntax.
9. The feedback returned by the submit answer API is marked with `isMarkdown: true`, indicating it should be rendered as Markdown.