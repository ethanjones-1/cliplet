const { YoutubeTranscript } = require('youtube-transcript');

async function getYouTubeTranscript(videoId) {
  try {
    console.log(`Fetching transcript for video ID: ${videoId}`);
    
    // Get transcript from YouTube
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      return null;
    }
    
    // Combine all transcript parts into a single text
    const fullText = transcript
      .map(entry => entry.text)
      .join(' ')
      .replace(/\[.*?\]/g, '') // Remove timestamp markers
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    console.log(`Transcript extracted: ${fullText.length} characters`);
    return fullText;
    
  } catch (error) {
    console.error('YouTube transcript error:', error);
    
    // Handle specific YouTube transcript errors
    if (error.message.includes('Transcript is disabled')) {
      throw new Error('Transcript is disabled for this video');
    } else if (error.message.includes('No transcript available')) {
      throw new Error('No transcript available for this video');
    } else if (error.message.includes('Video unavailable')) {
      throw new Error('Video is unavailable or private');
    } else {
      throw new Error('Failed to fetch YouTube transcript: ' + error.message);
    }
  }
}

module.exports = {
  getYouTubeTranscript
};