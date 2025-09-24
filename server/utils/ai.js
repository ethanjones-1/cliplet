const OpenAI = require('openai');

// Initialize OpenAI client only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Fallback AI responses when OpenAI is not available
const fallbackResponses = {
  summary: (content) => {
    const words = content.split(' ');
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return {
      mainPoints: sentences.slice(0, 3).map(s => s.trim()),
      keyTopics: [...new Set(words.filter(w => w.length > 6))].slice(0, 5),
      overview: sentences[0]?.trim() + '...' || 'Content summary not available.'
    };
  },
  
  notes: (content, style) => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const points = sentences.slice(0, 8).map((s, i) => `${i + 1}. ${s.trim()}`);
    return {
      title: 'Study Notes',
      style,
      points,
      sections: [
        {
          heading: 'Main Content',
          items: points.slice(0, 4)
        },
        {
          heading: 'Additional Points',
          items: points.slice(4)
        }
      ]
    };
  },
  
  flashcards: (content, count) => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const cards = [];
    
    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      const sentence = sentences[i].trim();
      const words = sentence.split(' ');
      if (words.length > 3) {
        cards.push({
          id: i + 1,
          front: `What is: ${words.slice(0, Math.ceil(words.length / 2)).join(' ')}?`,
          back: sentence,
          category: 'General'
        });
      }
    }
    
    return cards;
  },
  
  quiz: (content, questionCount, difficulty) => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const questions = [];
    
    for (let i = 0; i < Math.min(questionCount, sentences.length); i++) {
      const sentence = sentences[i].trim();
      questions.push({
        id: i + 1,
        question: `Question about: ${sentence.split(' ').slice(0, 8).join(' ')}?`,
        options: [
          'Option A',
          'Option B', 
          'Option C',
          'Option D'
        ],
        correctAnswer: 0,
        explanation: sentence
      });
    }
    
    return {
      title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz`,
      difficulty,
      questions,
      totalPoints: questions.length * 10
    };
  }
};

async function generateSummary(content) {
  try {
    if (!openai) {
      console.log('OpenAI API key not found, using fallback response');
      return fallbackResponses.summary(content);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates concise and informative summaries. Return your response as a JSON object with 'mainPoints' (array of key points), 'keyTopics' (array of main topics), and 'overview' (brief overview paragraph)."
        },
        {
          role: "user",
          content: `Please summarize the following content:\n\n${content.slice(0, 4000)}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = response.choices[0].message.content;
    
    try {
      return JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, return structured fallback
      return {
        overview: aiResponse,
        mainPoints: aiResponse.split('\n').filter(line => line.trim().length > 0).slice(0, 5),
        keyTopics: []
      };
    }

  } catch (error) {
    console.error('OpenAI summary error:', error.message);
    return fallbackResponses.summary(content);
  }
}

async function generateNotes(content, style = 'bullet') {
  try {
    if (!openai) {
      console.log('OpenAI API key not found, using fallback response');
      return fallbackResponses.notes(content, style);
    }

    const stylePrompt = {
      bullet: "Create bullet point notes with clear, concise points.",
      outline: "Create an outline format with main headings and sub-points.",
      detailed: "Create detailed notes with explanations and examples."
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that creates study notes. ${stylePrompt[style]} Return your response as a JSON object with 'title', 'style', 'sections' (array of objects with 'heading' and 'items' array), and 'points' (array of all points).`
        },
        {
          role: "user",
          content: `Create ${style} notes from the following content:\n\n${content.slice(0, 4000)}`
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const aiResponse = response.choices[0].message.content;
    
    try {
      return JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, return structured fallback
      return fallbackResponses.notes(content, style);
    }

  } catch (error) {
    console.error('OpenAI notes error:', error.message);
    return fallbackResponses.notes(content, style);
  }
}

async function generateFlashcards(content, count = 10) {
  try {
    if (!openai) {
      console.log('OpenAI API key not found, using fallback response');
      return fallbackResponses.flashcards(content, count);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that creates flashcards for studying. Create ${count} flashcards with clear questions and answers. Return your response as a JSON array of objects, each with 'id', 'front' (question), 'back' (answer), and 'category' properties.`
        },
        {
          role: "user",
          content: `Create ${count} flashcards from the following content:\n\n${content.slice(0, 4000)}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const aiResponse = response.choices[0].message.content;
    
    try {
      const flashcards = JSON.parse(aiResponse);
      return Array.isArray(flashcards) ? flashcards : fallbackResponses.flashcards(content, count);
    } catch (parseError) {
      return fallbackResponses.flashcards(content, count);
    }

  } catch (error) {
    console.error('OpenAI flashcards error:', error.message);
    return fallbackResponses.flashcards(content, count);
  }
}

async function generateQuiz(content, questionCount = 5, difficulty = 'medium') {
  try {
    if (!openai) {
      console.log('OpenAI API key not found, using fallback response');
      return fallbackResponses.quiz(content, questionCount, difficulty);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that creates quizzes for studying. Create a ${difficulty} level quiz with ${questionCount} multiple choice questions. Return your response as a JSON object with 'title', 'difficulty', 'questions' (array of objects with 'id', 'question', 'options' array, 'correctAnswer' index, and 'explanation'), and 'totalPoints'.`
        },
        {
          role: "user",
          content: `Create a ${difficulty} quiz with ${questionCount} questions from the following content:\n\n${content.slice(0, 4000)}`
        }
      ],
      max_tokens: 1200,
      temperature: 0.7
    });

    const aiResponse = response.choices[0].message.content;
    
    try {
      return JSON.parse(aiResponse);
    } catch (parseError) {
      return fallbackResponses.quiz(content, questionCount, difficulty);
    }

  } catch (error) {
    console.error('OpenAI quiz error:', error.message);
    return fallbackResponses.quiz(content, questionCount, difficulty);
  }
}

module.exports = {
  generateSummary,
  generateNotes,
  generateFlashcards,
  generateQuiz
};