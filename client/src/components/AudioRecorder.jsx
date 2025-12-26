/**
 * AudioRecorder Component - Compact LeetCode Style
 */

import { useState, useRef, useEffect } from 'react';

const SUPPORTED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

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

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Audio recording not supported');
      return;
    }

    const supportedType = getSupportedMimeType();
    if (!supportedType) {
      setError('No supported audio format');
      return;
    }

    setMimeType(supportedType);
  }, []);

  async function startRecording() {
    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 } 
      });

      const mediaRecorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 128000 });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        setError(`Recording error: ${event.error}`);
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found');
      } else {
        setError(`Failed: ${err.message}`);
      }
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-red-300 text-xs">
          ⚠️ {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300">🎤 Record Explanation</h3>
        {isRecording && (
          <div className="flex items-center gap-2 text-red-400">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-mono text-sm font-bold">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      {!isRecording && (
        <p className="text-xs text-gray-500">Explain approach, complexity, edge cases (1-2 min)</p>
      )}

      {!isRecording ? (
        <button
          onClick={startRecording}
          disabled={disabled || !!error}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg text-sm
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <div className="w-2 h-2 bg-white rounded-full"></div>
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="w-full bg-[#3b3b3b] hover:bg-[#4a4a4a] text-white font-semibold py-2 px-4 rounded-lg text-sm
                     transition-all flex items-center justify-center gap-2"
        >
          <div className="w-2 h-2 bg-white rounded"></div>
          Stop Recording
        </button>
      )}
    </div>
  );
}
