import React, { useState } from 'react';

const ProcessingResults = ({ content, onReset }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const features = [
    {
      id: 'summarize',
      name: 'Summary',
      icon: '📝',
      description: 'Generate a concise summary'
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: '📋',
      description: 'Create structured notes'
    },
    {
      id: 'flashcards',
      name: 'Flashcards',
      icon: '🃏',
      description: 'Generate study flashcards'
    },
    {
      id: 'quiz',
      name: 'Quiz',
      icon: '❓',
      description: 'Create a quiz'
    }
  ];

  const handleFeatureClick = async (feature) => {
    setSelectedFeature(feature);
    setLoading(true);

    try {
      const endpoint = `/api/ai/${feature.id}`;
      const body = { content: content.content };

      // Add specific parameters for different features
      if (feature.id === 'notes') {
        body.style = 'bullet';
      } else if (feature.id === 'flashcards') {
        body.count = 10;
      } else if (feature.id === 'quiz') {
        body.questionCount = 5;
        body.difficulty = 'medium';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to generate ${feature.name.toLowerCase()}`);
      }

      const data = await response.json();
      setAiResult(data);
    } catch (error) {
      alert(`Error: ${error.message}`);
      setAiResult(null);
    } finally {
      setLoading(false);
    }
  };

  const renderAiResult = () => {
    if (!aiResult) return null;

    switch (selectedFeature.id) {
      case 'summarize':
        return (
          <div className="result-content">
            <h3>📝 Summary</h3>
            {aiResult.summary.overview && (
              <div>
                <h4>Overview</h4>
                <p>{aiResult.summary.overview}</p>
              </div>
            )}
            {aiResult.summary.mainPoints && aiResult.summary.mainPoints.length > 0 && (
              <div>
                <h4>Main Points</h4>
                <ul>
                  {aiResult.summary.mainPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            {aiResult.summary.keyTopics && aiResult.summary.keyTopics.length > 0 && (
              <div>
                <h4>Key Topics</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {aiResult.summary.keyTopics.map((topic, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#e9ecef',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'notes':
        return (
          <div className="result-content">
            <h3>📋 Notes</h3>
            {aiResult.notes.sections && aiResult.notes.sections.length > 0 ? (
              aiResult.notes.sections.map((section, index) => (
                <div key={index} style={{ marginBottom: '1.5rem' }}>
                  <h4>{section.heading}</h4>
                  <ul>
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : aiResult.notes.points ? (
              <ul>
                {aiResult.notes.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            ) : (
              <p>Notes generated successfully!</p>
            )}
          </div>
        );

      case 'flashcards':
        return (
          <div className="result-content">
            <h3>🃏 Flashcards ({aiResult.count || aiResult.flashcards.length} cards)</h3>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {aiResult.flashcards.map((card, index) => (
                <FlashcardComponent key={index} card={card} />
              ))}
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="result-content">
            <h3>❓ Quiz - {aiResult.quiz.title || 'Generated Quiz'}</h3>
            <p>Difficulty: {aiResult.quiz.difficulty || aiResult.difficulty}</p>
            <div style={{ marginTop: '1rem' }}>
              {aiResult.quiz.questions.map((question, index) => (
                <QuizQuestionComponent key={index} question={question} index={index} />
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="result-content">
            <h3>Result</h3>
            <pre>{JSON.stringify(aiResult, null, 2)}</pre>
          </div>
        );
    }
  };

  return (
    <div className="processing-results">
      <div className="results-header">
        <h2 className="results-title">
          {content.type === 'youtube' ? '📺 YouTube Video' : '📄 Document'} Processed
        </h2>
        <button className="btn-secondary" onClick={onReset}>
          Process New Content
        </button>
      </div>

      <div className="ai-features">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`feature-card ${selectedFeature?.id === feature.id ? 'active' : ''}`}
            onClick={() => handleFeatureClick(feature)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <div className="feature-name">{feature.name}</div>
            <div className="feature-description">{feature.description}</div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating {selectedFeature?.name.toLowerCase()}...</p>
        </div>
      )}

      {!loading && renderAiResult()}
    </div>
  );
};

// Flashcard component with flip functionality
const FlashcardComponent = ({ card }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      style={{
        border: '2px solid #e9ecef',
        borderRadius: '12px',
        padding: '1.5rem',
        cursor: 'pointer',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: flipped ? '#f8f9fa' : 'white',
        transition: 'all 0.3s ease'
      }}
      onClick={() => setFlipped(!flipped)}
    >
      <div>
        <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
          {flipped ? 'Answer' : 'Question'} - Click to flip
        </div>
        <div style={{ fontSize: '1.1rem' }}>
          {flipped ? card.back : card.front}
        </div>
        {card.category && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#667eea' }}>
            {card.category}
          </div>
        )}
      </div>
    </div>
  );
};

// Quiz question component
const QuizQuestionComponent = ({ question, index }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
  };

  return (
    <div style={{
      border: '2px solid #e9ecef',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem'
    }}>
      <h4>Question {index + 1}</h4>
      <p style={{ marginBottom: '1rem' }}>{question.question}</p>
      
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {question.options.map((option, optionIndex) => (
          <button
            key={optionIndex}
            onClick={() => handleAnswerSelect(optionIndex)}
            style={{
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              background: showAnswer
                ? optionIndex === question.correctAnswer
                  ? '#d4edda'
                  : selectedAnswer === optionIndex
                    ? '#f8d7da'
                    : 'white'
                : 'white',
              cursor: showAnswer ? 'default' : 'pointer',
              textAlign: 'left'
            }}
            disabled={showAnswer}
          >
            {String.fromCharCode(65 + optionIndex)}. {option}
          </button>
        ))}
      </div>
      
      {showAnswer && question.explanation && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          borderLeft: '4px solid #667eea'
        }}>
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};

export default ProcessingResults;