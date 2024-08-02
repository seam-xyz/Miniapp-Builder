import { useState, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { Microphone } from '@mozartec/capacitor-microphone';

interface RecordingResult {
  dataUrl: string;
  blob?: Blob;
  path?: string;
  webPath?: string;
}

export const useRecordAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isWeb = Capacitor.getPlatform() === 'web';

  const startRecording = async (): Promise<void> => {
    if (isWeb) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        throw new Error('Microphone access is required for recording.');
      }
    } else {
      const permissionStatus = await Microphone.requestPermissions();
      if (permissionStatus.microphone !== 'granted') {
        throw new Error('Microphone permission is required');
      }
      await Microphone.startRecording();
      setIsRecording(true);
    }
  };

  const stopRecording = async (): Promise<RecordingResult> => {
    if (isWeb) {
      return new Promise<RecordingResult>((resolve) => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({ dataUrl: reader.result as string, blob: audioBlob });
            };
            reader.readAsDataURL(audioBlob);
          };
          mediaRecorderRef.current.stop();
        }
      });
    } else {
      const recordedAudio = await Microphone.stopRecording();
      if (!recordedAudio.path) {
        throw new Error('Recording failed');
      }
      setIsRecording(false);
      return recordedAudio as RecordingResult;
    }
  };

  return { startRecording, stopRecording, isRecording };
};
