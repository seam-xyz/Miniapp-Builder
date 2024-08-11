import { useState, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { Microphone, AudioRecording } from '@mozartec/capacitor-microphone'; // Ensure you import AudioRecording
import { FirebaseStorage } from '@capacitor-firebase/storage';
import { nanoid } from 'nanoid';

interface RecordingResult {
  dataUrl: string;
  blob?: Blob;
  path?: string;
  webPath?: string;
}

export const useRecordAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isWeb = Capacitor.getPlatform() === 'web';

  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
  const MAX_DURATION_MILLISECONDS = 600000; // Max duration of 10 minutes. (10MB for .M4A)

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
        alert('Microphone could not be accessed. Check to see if your microphone is enabled in your browser.');
      }
    } else {
      try {
        const permissionStatus = await Microphone.requestPermissions();
        if (permissionStatus.microphone !== 'granted') {
          throw new Error('Microphone could not be accessed. To enable, go to Settings > Seam > Microphone and then try again.');
        }
        await Microphone.startRecording();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting mobile recording:', error);
        alert('Microphone could not be accessed. To enable, go to Settings > Seam > Microphone and then try again.');
      }
    }
  };

  const stopRecording = async (): Promise<RecordingResult> => {
    if (isWeb) {
      return new Promise<RecordingResult>((resolve) => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({ dataUrl: reader.result as string, blob: audioBlob });
            };
            reader.readAsDataURL(audioBlob);
          };
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      });
    } else {
      const recordedAudio = (await Microphone.stopRecording()) as AudioRecording;
      setIsRecording(false);

      if (recordedAudio.duration && recordedAudio.duration > MAX_DURATION_MILLISECONDS) {
        alert(`The recording is too long. Maximum allowed duration is 10 minutes.`);
        throw new Error('Recording duration exceeds the limit.');
      }

      return {
        path: recordedAudio.path,
        webPath: recordedAudio.webPath,
        dataUrl: '', // No data URL needed for mobile
      };
    }
  };

  const uploadAudioToFirebase = async (recordedAudio: { path?: string; webPath?: string; dataUrl: string, blob?: Blob }): Promise<string> => {
    const name = nanoid();
    const dataPath = `voice-notes/${name}.${isWeb ? 'wav' : 'm4a'}`;
    let uploadData: Blob | string;

    if (isWeb) {
      uploadData = recordedAudio.blob!;
      
      if (uploadData.size > MAX_FILE_SIZE_BYTES) {
        alert(`The audio file is too large. Maximum allowed size is 10MB.`);
        throw new Error('File size exceeds the limit.');
      }
    } else {
      uploadData = recordedAudio.path!;
    }

    return new Promise((resolve, reject) => {
      FirebaseStorage.uploadFile(
        {
          path: dataPath,
          blob: isWeb ? (uploadData as Blob) : undefined,
          uri: isWeb ? undefined : (uploadData as string),
        },
        async (event, error) => {
          if (error) {
            console.error('Upload failed:', error);
            setUploadProgress(0);
            reject(error);
            return;
          }
          if (event) {
            setUploadProgress(event.progress * 100);
          }

          if (event?.completed) {
            const { downloadUrl } = await FirebaseStorage.getDownloadUrl({ path: dataPath });
            setUploadProgress(0);
            resolve(downloadUrl);
          }
        }
      );
    });
  };

  return { startRecording, stopRecording, isRecording, uploadProgress, uploadAudioToFirebase };
};