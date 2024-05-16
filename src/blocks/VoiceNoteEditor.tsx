import React, { useState, useRef, useEffect } from 'react';
import { BlockModel } from './types';
import { default as WavesurferPlayer, useWavesurfer } from '@wavesurfer/react';

interface VoiceNoteEditorProps {
    done: (data: BlockModel) => void;
    model: BlockModel;
}

const VoiceNoteEditor: React.FC<VoiceNoteEditorProps> = ({ done, model }) => {
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(model.data['audioUrl'] || '');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { wavesurfer, isReady } = useWavesurfer({
        container: containerRef,
        url: audioUrl,
        waveColor: '#ddd',
        progressColor: '#4a90e2',
        cursorColor: '#4a90e2'
    });

    const handleRecord = async () => {
        if (recording) {
            mediaRecorderRef.current?.stop();
            setRecording(false);
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                setAudioBlob(audioBlob);
                model.data['audioUrl'] = url;
                done(model);
                if (isReady) {
                    wavesurfer?.load(url);
                }
            };

            mediaRecorder.start();
            setRecording(true);
        }
    };

    const handleDelete = () => {
        setAudioUrl('');
        setAudioBlob(null);
        delete model.data['audioUrl'];
        if (isReady) {
            wavesurfer?.empty();
        }
    };

    return (
        <div>
            <button onMouseDown={handleRecord} onMouseUp={handleRecord}>
                {recording ? 'Release to Stop' : 'Hold to Record'}
            </button>
            <div ref={containerRef} />
            {audioUrl && (
                <div>
                    <audio controls src={audioUrl}></audio>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
};

export default VoiceNoteEditor;