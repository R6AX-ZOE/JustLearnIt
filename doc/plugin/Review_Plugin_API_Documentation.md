# Review Plugin API Documentation

## Overview

The Review Plugin provides functionality for reviewing incorrect questions in the JustLearnIt system. It allows users to filter incorrect questions by practice and date range, and create review sessions for those questions.

## Plugin Methods

### getIncorrectQuestions

**Description**: Fetches incorrect questions for a user, optionally filtered by practice IDs and date range.

**Parameters**:
- `userId` (string): The ID of the user
- `practiceIds` (array, optional): Array of practice IDs to filter by
- `startDate` (string, optional): Start date for filtering (YYYY-MM-DD format)
- `endDate` (string, optional): End date for filtering (YYYY-MM-DD format)

**Returns**:
- Promise that resolves to an array of incorrect question objects

**Example Response**:
```javascript
[
  {
    "question": {
      "id": "123",
      "type": "multiple-choice",
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "4"
    },
    "userAnswer": "3",
    "feedback": "Incorrect",
    "practiceId": "456",
    "practiceName": "Math Basics",
    "submittedAt": "2026-04-20T10:30:00Z",
    "sessionId": "789"
  }
]
```

### getIncorrectQuestionsByPractice

**Description**: Fetches incorrect questions for a specific practice.

**Parameters**:
- `userId` (string): The ID of the user
- `practiceId` (string): The ID of the practice

**Returns**:
- Promise that resolves to an array of incorrect question objects

### startReviewSession

**Description**: Starts a review session for incorrect questions, optionally filtered by practice IDs and date range.

**Parameters**:
- `userId` (string): The ID of the user
- `practiceIds` (array, optional): Array of practice IDs to filter by
- `startDate` (string, optional): Start date for filtering (YYYY-MM-DD format)
- `endDate` (string, optional): End date for filtering (YYYY-MM-DD format)

**Returns**:
- Promise that resolves to an object containing the session information

**Example Response**:
```javascript
{
  "message": "Session started successfully",
  "session": {
    "id": "session_123456789",
    "userId": "user1",
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

### getReviewStats

**Description**: Gets statistics about incorrect questions, optionally filtered by practice IDs and date range.

**Parameters**:
- `userId` (string): The ID of the user
- `practiceIds` (array, optional): Array of practice IDs to filter by
- `startDate` (string, optional): Start date for filtering (YYYY-MM-DD format)
- `endDate` (string, optional): End date for filtering (YYYY-MM-DD format)

**Returns**:
- Promise that resolves to an object containing statistics

**Example Response**:
```javascript
{
  "totalIncorrect": 10,
  "byPractice": {
    "Math Basics": 5,
    "Science Fundamentals": 3,
    "History Overview": 2
  },
  "byType": {
    "multiple-choice": 7,
    "fill-blank": 2,
    "essay": 1
  }
}
```

### createReviewSession

**Description**: Creates a custom review session for selected questions.

**Parameters**:
- `userId` (string): The ID of the user
- `questionIds` (array): Array of question IDs to include in the review session
- `practiceId` (string, optional): The ID of the practice
- `practiceName` (string, optional): The name of the practice

**Returns**:
- Promise that resolves to an object containing the session information

**Example Response**:
```javascript
{
  "message": "Review session started successfully",
  "session": {
    "id": "session_987654321",
    "userId": "user1",
    "practiceId": "456",
    "practiceName": "Custom Review Session",
    "questions": [...],
    "currentQuestionIndex": 0,
    "answers": {},
    "startTime": "2026-04-25T14:30:00Z",
    "lastActivityTime": "2026-04-25T14:30:00Z",
    "status": "in_progress",
    "score": null,
    "totalQuestions": 3
  }
}
```

## Backend API Endpoints

### GET /api/practice/student/:userId/incorrect-questions

**Description**: Fetches incorrect questions for a user.

**Query Parameters**:
- `practiceId` (string, multiple): Practice IDs to filter by
- `startDate` (string): Start date for filtering (YYYY-MM-DD format)
- `endDate` (string): End date for filtering (YYYY-MM-DD format)

**Response**:
- `200 OK`: Returns an object with an `incorrectQuestions` array

### POST /api/practice/student/:userId/session

**Description**: Starts a new practice session.

**Request Body**:
```json
{
  "practiceId": "456",
  "sourceQuestions": [...] // Array of question objects
}
```

**Response**:
- `201 Created`: Returns an object with session information

### POST /api/practice/student/:userId/review-session

**Description**: Creates a custom review session.

**Request Body**:
```json
{
  "questionIds": ["123", "456", "789"],
  "practiceId": "456",
  "practiceName": "Custom Review Session"
}
```

**Response**:
- `201 Created`: Returns an object with session information

## Usage Examples

### Example 1: Get all incorrect questions

```javascript
const incorrectQuestions = await pluginSystem.executePluginMethod('review', 'getIncorrectQuestions', userId);
```

### Example 2: Get incorrect questions for specific practices

```javascript
const practiceIds = ['practice1', 'practice2'];
const incorrectQuestions = await pluginSystem.executePluginMethod('review', 'getIncorrectQuestions', userId, practiceIds);
```

### Example 3: Get incorrect questions within a date range

```javascript
const startDate = '2026-04-01';
const endDate = '2026-04-30';
const incorrectQuestions = await pluginSystem.executePluginMethod('review', 'getIncorrectQuestions', userId, [], startDate, endDate);
```

### Example 4: Start a review session for specific practices

```javascript
const practiceIds = ['practice1', 'practice2'];
const result = await pluginSystem.executePluginMethod('review', 'startReviewSession', userId, practiceIds);
if (result.session) {
  // Navigate to the session
}
```

### Example 5: Create a custom review session

```javascript
const questionIds = ['q1', 'q2', 'q3'];
const result = await pluginSystem.executePluginMethod('review', 'createReviewSession', userId, questionIds, null, 'My Custom Review');
if (result.session) {
  // Navigate to the session
}
```

## Dependencies

The Review Plugin has no dependencies on other plugins.

## Initialization

The Review Plugin is initialized automatically when first loaded. It logs "Review plugin initialized" to the console during initialization.

## Destruction

The Review Plugin cleans up any resources when destroyed and logs "Review plugin destroyed" to the console.