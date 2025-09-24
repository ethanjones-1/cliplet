# Cliplet API Documentation

## Base URL
Development: `http://localhost:5001/api`
Production: `https://your-domain.com/api`

## Content Processing Endpoints

### Process YouTube Video
Extract transcript from YouTube video for analysis.

```http
POST /content/youtube
```

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "success": true,
  "videoId": "VIDEO_ID",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "content": "Extracted transcript text...",
  "type": "youtube"
}
```

**Error Response:**
```json
{
  "error": "Invalid YouTube URL"
}
```

### Upload and Process Document
Upload and extract text from documents (PDF, DOCX, TXT).

```http
POST /content/upload
```

**Request:** Multipart form data with file field

**Response:**
```json
{
  "success": true,
  "filename": "document.pdf",
  "content": "Extracted document text...",
  "type": "upload"
}
```

**Supported File Types:**
- PDF (.pdf)
- Microsoft Word (.docx, .doc)
- Plain Text (.txt)
- Video files (.mp4, .avi, .mov, .mkv, .webm)

**File Size Limit:** 100MB

## AI Processing Endpoints

### Generate Summary
Create a concise summary of the content.

```http
POST /ai/summarize
```

**Request Body:**
```json
{
  "content": "Content to summarize..."
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "overview": "Brief overview paragraph...",
    "mainPoints": [
      "Key point 1",
      "Key point 2",
      "Key point 3"
    ],
    "keyTopics": ["topic1", "topic2", "topic3"]
  },
  "type": "summary"
}
```

### Generate Notes
Create structured study notes from content.

```http
POST /ai/notes
```

**Request Body:**
```json
{
  "content": "Content to create notes from...",
  "style": "bullet" // Optional: "bullet", "outline", "detailed"
}
```

**Response:**
```json
{
  "success": true,
  "notes": {
    "title": "Study Notes",
    "style": "bullet",
    "sections": [
      {
        "heading": "Main Content",
        "items": ["Note 1", "Note 2", "Note 3"]
      }
    ],
    "points": ["All points as flat array"]
  },
  "style": "bullet",
  "type": "notes"
}
```

### Generate Flashcards
Create study flashcards from content.

```http
POST /ai/flashcards
```

**Request Body:**
```json
{
  "content": "Content to create flashcards from...",
  "count": 10 // Optional: number of flashcards to generate
}
```

**Response:**
```json
{
  "success": true,
  "flashcards": [
    {
      "id": 1,
      "front": "Question or term",
      "back": "Answer or definition",
      "category": "Category name"
    }
  ],
  "count": 10,
  "type": "flashcards"
}
```

### Generate Quiz
Create multiple-choice quiz questions.

```http
POST /ai/quiz
```

**Request Body:**
```json
{
  "content": "Content to create quiz from...",
  "questionCount": 5, // Optional: number of questions
  "difficulty": "medium" // Optional: "easy", "medium", "hard"
}
```

**Response:**
```json
{
  "success": true,
  "quiz": {
    "title": "Generated Quiz",
    "difficulty": "medium",
    "questions": [
      {
        "id": 1,
        "question": "What is...?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Explanation of the correct answer"
      }
    ],
    "totalPoints": 50
  },
  "questionCount": 5,
  "difficulty": "medium",
  "type": "quiz"
}
```

### List Available AI Features
Get information about available AI processing features.

```http
GET /ai/features
```

**Response:**
```json
{
  "features": [
    {
      "id": "summarize",
      "name": "Summary",
      "description": "Generate a concise summary of the content"
    },
    {
      "id": "notes",
      "name": "Notes", 
      "description": "Create structured notes from the content",
      "options": ["bullet", "outline", "detailed"]
    },
    {
      "id": "flashcards",
      "name": "Flashcards",
      "description": "Generate flashcards for study and memorization"
    },
    {
      "id": "quiz",
      "name": "Quiz",
      "description": "Create a quiz to test understanding",
      "options": ["easy", "medium", "hard"]
    }
  ]
}
```

## Utility Endpoints

### Health Check
Check server status.

```http
GET /health
```

**Response:**
```json
{
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error

Error responses have this format:
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production deployments.

## Authentication

No authentication is currently required. Consider adding API keys for production use.

## Examples

### Complete Workflow Example

1. **Upload Document**
```bash
curl -X POST \
  -F "file=@document.pdf" \
  http://localhost:5001/api/content/upload
```

2. **Generate Summary**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"content":"Extracted content from step 1"}' \
  http://localhost:5001/api/ai/summarize
```

3. **Create Flashcards**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"content":"Extracted content from step 1","count":5}' \
  http://localhost:5001/api/ai/flashcards
```

### JavaScript Frontend Example

```javascript
// Upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResponse = await fetch('/api/content/upload', {
  method: 'POST',
  body: formData
});

const uploadData = await uploadResponse.json();

// Generate summary
const summaryResponse = await fetch('/api/ai/summarize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: uploadData.content
  })
});

const summaryData = await summaryResponse.json();
console.log(summaryData.summary);
```