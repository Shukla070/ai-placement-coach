/**
 * AudioRecorder Component - Captures user's verbal explanation
 * 
 * Features:
 * - Browser compatibility (WebM, MP4, OGG)
 * - MIME type validation
 * - Chunked recording (prevents memory leaks)
 * - Visual feedback during recording
 */

import { useState, useRef, useEffect } from 'react';

const SUPPORTED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

/**
 * Find the first supported MIME type for this browser
 */
function getSupportedMimeType() {
  for (const mimeType of SUPPORTED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }
  return null;
}

export default function AudioRecorder({ onRecordingComplete, disabled = false }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState(null);
  const [mimeType, setMimeType] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Check browser support on mount
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Audio recording is not supported in this browser');
      return;
    }

    const supportedType = getSupportedMimeType();
    if (!supportedType) {
      setError('No supported audio format found');
      return;
    }

    setMimeType(supportedType);
    console.log('✅ Using MIME type:', supportedType);
  }, []);

  /**
   * Start recording
   */
  async function startRecording() {
    try {
      setError(null);
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000, // 16kHz for speech
        } 
      });

      // Create MediaRecorder with chunked recording
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000, // 128kbps
      });

      // Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
        // Validate MIME type
        if (!SUPPORTED_MIME_TYPES.some(type => audioBlob.type.includes(type.split(';')[0]))) {
          setError(`Unsupported audio format: ${audioBlob.type}`);
          return;
        }

        console.log('✅ Recording complete:', {
          size: `${(audioBlob.size / 1024).toFixed(2)} KB`,
          type: audioBlob.type,
          duration: `${recordingTime}s`,
        });

        onRecordingComplete(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        setError(`Recording error: ${event.error}`);
        console.error('MediaRecorder error:', event.error);
      };

      // Start recording with 1-second chunks
      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone permissions.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
      } else {
        setError(`Failed to start recording: ${err.message}`);
      }
      console.error('Recording error:', err);
    }
  }

  /**
   * Stop recording
   */
  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
    }
  }

  /**
   * Format time as MM:SS
   */
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Recording Controls */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          🎤 Record Your Explanation
        </h3>

        {/* Recording Status */}
        {isRecording && (
          <div className="mb-4 flex items-center gap-3 text-red-400 animate-pulse">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-mono text-xl">{formatTime(recordingTime)}</span>
          </div>
        )}

        {/* Instructions */}
        {!isRecording && (
          <p className="text-gray-400 text-sm mb-4">
            Explain your approach, time complexity, and edge cases. 
            Aim for 1-2 minutes.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={disabled || !!error}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="btn-danger flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop Recording
            </button>
          )}
        </div>

        {/* Browser Info */}
        {mimeType && !error && (
          <p className="text-xs text-gray-500 mt-4">
            Format: {mimeType.split(';')[0]}
          </p>
        )}
      </div>
    </div>
  );
}