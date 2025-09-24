const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { getYouTubeTranscript } = require('../utils/youtube');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt|mp4|avi|mov|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Only documents and videos are allowed!');
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Extract YouTube video ID from URL
function getYouTubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Process YouTube URL
router.post('/youtube', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    console.log(`Processing YouTube video: ${videoId}`);
    
    // Get transcript
    const transcript = await getYouTubeTranscript(videoId);
    
    if (!transcript) {
      return res.status(404).json({ error: 'No transcript available for this video' });
    }

    res.json({
      success: true,
      videoId,
      url,
      content: transcript,
      type: 'youtube'
    });

  } catch (error) {
    console.error('YouTube processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process YouTube video',
      message: error.message 
    });
  }
});

// Process uploaded file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const filePath = file.path;
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    console.log(`Processing uploaded file: ${file.originalname}`);
    
    let content = '';
    
    try {
      // Extract content based on file type
      switch (fileExtension) {
        case '.pdf':
          const pdfBuffer = await fs.readFile(filePath);
          const pdfData = await pdfParse(pdfBuffer);
          content = pdfData.text;
          break;
          
        case '.docx':
          const docxResult = await mammoth.extractRawText({ path: filePath });
          content = docxResult.value;
          break;
          
        case '.doc':
          // For .doc files, we'll try mammoth but it might not work perfectly
          try {
            const docResult = await mammoth.extractRawText({ path: filePath });
            content = docResult.value;
          } catch (docError) {
            content = 'Could not extract text from .doc file. Please convert to .docx or .pdf format.';
          }
          break;
          
        case '.txt':
          content = await fs.readFile(filePath, 'utf8');
          break;
          
        case '.mp4':
        case '.avi':
        case '.mov':
        case '.mkv':
        case '.webm':
          // For video files, we'll return metadata and let the user know transcription is not yet implemented
          content = `Video file uploaded: ${file.originalname}. Automatic video transcription is not yet implemented. Please provide a YouTube URL or upload a document instead.`;
          break;
          
        default:
          throw new Error('Unsupported file type');
      }

      // Clean up uploaded file after processing
      await fs.remove(filePath);

      res.json({
        success: true,
        filename: file.originalname,
        content: content,
        type: 'upload'
      });

    } catch (processingError) {
      // Clean up file on error
      await fs.remove(filePath);
      throw processingError;
    }

  } catch (error) {
    console.error('File upload processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process uploaded file',
      message: error.message 
    });
  }
});

// Get processing status
router.get('/status/:id', (req, res) => {
  // This endpoint could be used for long-running processing tasks
  // For now, it's a placeholder
  res.json({
    id: req.params.id,
    status: 'completed',
    message: 'Processing completed'
  });
});

module.exports = router;