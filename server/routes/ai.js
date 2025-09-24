const express = require('express');
const { generateSummary, generateNotes, generateFlashcards, generateQuiz } = require('../utils/ai');
const router = express.Router();

// Generate summary from content
router.post('/summarize', async (req, res) => {
  try {
    const { content, type } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    console.log(`Generating summary for ${type || 'unknown'} content`);
    
    const summary = await generateSummary(content);
    
    res.json({
      success: true,
      summary,
      type: 'summary'
    });

  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      message: error.message 
    });
  }
});

// Generate notes from content
router.post('/notes', async (req, res) => {
  try {
    const { content, style = 'bullet' } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    console.log(`Generating ${style} notes`);
    
    const notes = await generateNotes(content, style);
    
    res.json({
      success: true,
      notes,
      style,
      type: 'notes'
    });

  } catch (error) {
    console.error('Notes generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate notes',
      message: error.message 
    });
  }
});

// Generate flashcards from content
router.post('/flashcards', async (req, res) => {
  try {
    const { content, count = 10 } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    console.log(`Generating ${count} flashcards`);
    
    const flashcards = await generateFlashcards(content, count);
    
    res.json({
      success: true,
      flashcards,
      count: flashcards.length,
      type: 'flashcards'
    });

  } catch (error) {
    console.error('Flashcards generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate flashcards',
      message: error.message 
    });
  }
});

// Generate quiz from content
router.post('/quiz', async (req, res) => {
  try {
    const { content, questionCount = 5, difficulty = 'medium' } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    console.log(`Generating ${difficulty} quiz with ${questionCount} questions`);
    
    const quiz = await generateQuiz(content, questionCount, difficulty);
    
    res.json({
      success: true,
      quiz,
      questionCount: quiz.questions.length,
      difficulty,
      type: 'quiz'
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate quiz',
      message: error.message 
    });
  }
});

// Get all available AI features
router.get('/features', (req, res) => {
  res.json({
    features: [
      {
        id: 'summarize',
        name: 'Summary',
        description: 'Generate a concise summary of the content'
      },
      {
        id: 'notes',
        name: 'Notes',
        description: 'Create structured notes from the content',
        options: ['bullet', 'outline', 'detailed']
      },
      {
        id: 'flashcards',
        name: 'Flashcards',
        description: 'Generate flashcards for study and memorization'
      },
      {
        id: 'quiz',
        name: 'Quiz',
        description: 'Create a quiz to test understanding',
        options: ['easy', 'medium', 'hard']
      }
    ]
  });
});

module.exports = router;