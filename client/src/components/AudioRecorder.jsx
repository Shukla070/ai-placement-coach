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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            🎤 Record Explanation
          </h3>
          {isRecording && (
            <div className="flex items-center gap-2 text-red-400 animate-pulse">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-mono text-lg font-bold">{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!isRecording && (
          <p className="text-gray-400 text-xs mb-3">
            Explain your approach, time complexity, and edge cases (1-2 minutes)
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={disabled || !!error}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <div className="w-3 h-3 bg-white"></div>
              Stop Recording
            </button>
          )}
        </div>

        {/* Browser Info */}
        {mimeType && !error && (
          <p className="text-xs text-gray-500 mt-2">
            Format: {mimeType.split(';')[0]}
          </p>
        )}
      </div>
    </div>
  );
}