import React, { useEffect, useRef } from 'react';
import { default as WavesurferPlayer, useWavesurfer } from '@wavesurfer/react';

interface VoiceNotePlayerProps {
    audioUrl: string;
}

const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({ audioUrl }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { wavesurfer, isReady } = useWavesurfer({
        container: containerRef,
        url: audioUrl,
        waveColor: '#ddd',
        progressColor: '#4a90e2',
        cursorColor: '#4a90e2'
    });

    useEffect(() => {
        if (isReady && wavesurfer) {
            wavesurfer?.load(audioUrl);
        }
    }, [audioUrl, isReady, wavesurfer]);

    return (
        <div>
            <div ref={containerRef} />
            <audio controls>
                <source src={audioUrl} type="audio/wav" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

export default VoiceNotePlayer;