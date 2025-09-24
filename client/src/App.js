import React, { useState } from 'react';
import './App.css';
import ContentInput from './components/ContentInput';
import ProcessingResults from './components/ProcessingResults';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContentProcessed = (processedContent) => {
    setContent(processedContent);
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container">
          {!content ? (
            <ContentInput 
              onContentProcessed={handleContentProcessed}
              loading={loading}
              setLoading={setLoading}
            />
          ) : (
            <ProcessingResults 
              content={content}
              onReset={() => setContent(null)}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
