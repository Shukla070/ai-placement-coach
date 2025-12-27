/**
 * AudioRecorder Component - Enhanced with new UI components
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';

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
    <div className="space-y-3">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H9m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Record Explanation
        </h3>
        {isRecording && (
          <div className="flex items-center gap-2 text-red-400">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="font-mono text-base font-bold">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      {!isRecording && (
        <p className="text-xs text-text-tertiary leading-relaxed">
          Explain your approach, time complexity, and edge cases (1-2 minutes recommended)
        </p>
      )}

      {isRecording && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0, 100, 200, 300, 400].map((delay, i) => (
                <div
                  key={i}
                  className="w-1 bg-red-500 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${delay}ms`,
                    height: `${15 + Math.random() * 15}px`,
                  }}
                ></div>
              ))}
            </div>
            <p className="text-xs text-red-300 font-medium">Recording in progress...</p>
          </div>
        </div>
      )}

      {!isRecording ? (
        <Button
          onClick={startRecording}
          variant="danger"
          size="md"
          disabled={disabled || !!error}
          className="w-full"
        >
          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          Start Recording
        </Button>
      ) : (
        <Button
          onClick={stopRecording}
          variant="secondary"
          size="md"
          className="w-full"
        >
          <div className="w-2.5 h-2.5 bg-white rounded"></div>
          Stop Recording
        </Button>
      )}
    </div>
  );
}
