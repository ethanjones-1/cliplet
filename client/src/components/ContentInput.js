import React, { useState } from 'react';

const ContentInput = ({ onContentProcessed, loading, setLoading }) => {
  const [activeTab, setActiveTab] = useState('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleYouTubeSubmit = async () => {
    if (!youtubeUrl.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/content/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process YouTube video');
      }

      const data = await response.json();
      onContentProcessed(data);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/content/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process file');
      }

      const data = await response.json();
      onContentProcessed(data);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  if (loading) {
    return (
      <div className="content-input">
        <div className="loading">
          <div className="spinner"></div>
          <h3>Processing your content...</h3>
          <p>This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-input">
      <h1 className="input-title">Cliplet</h1>
      <p className="input-subtitle">
        Transform videos and documents into summaries, notes, flashcards, and quizzes with AI
      </p>

      <div className="input-tabs">
        <button
          className={`tab-button ${activeTab === 'youtube' ? 'active' : ''}`}
          onClick={() => setActiveTab('youtube')}
        >
          📺 YouTube
        </button>
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📄 Upload File
        </button>
      </div>

      {activeTab === 'youtube' && (
        <div className="input-section">
          <div className="form-group">
            <label className="form-label">YouTube URL</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleYouTubeSubmit()}
            />
          </div>
          <button
            className="btn-primary"
            onClick={handleYouTubeSubmit}
            disabled={loading || !youtubeUrl.trim()}
          >
            Process YouTube Video
          </button>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="input-section">
          <div className="form-group">
            <label className="form-label">Upload Document or Video</label>
            <div
              className={`file-upload ${dragOver ? 'dragover' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <div className="upload-icon">📁</div>
              <div className="upload-text">
                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
              </div>
              <div className="upload-subtext">
                Supports PDF, DOCX, TXT, MP4, AVI, MOV files (max 100MB)
              </div>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.mp4,.avi,.mov,.mkv,.webm"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentInput;