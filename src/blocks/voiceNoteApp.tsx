import React from 'react';
import Block from './Block';
import { BlockModel } from './types';
import BlockFactory from './BlockFactory';
import VoiceNoteEditor from './VoiceNoteEditor';
import VoiceNotePlayer from './VoiceNotePlayer';

export default class voiceNoteBlock extends Block {
    render() {
        if (Object.keys(this.model.data).length === 0) {
            return BlockFactory.renderEmptyState(this.model, this.onEditCallback!);
        }

        const audioUrl = this.model.data['audioUrl'];

        return <VoiceNotePlayer audioUrl={audioUrl} />;
    }

    renderEditModal(done: (data: BlockModel) => void) {
        return <VoiceNoteEditor done={done} model={this.model} />;
    }

    renderErrorState() {
        return <h1>Error!</h1>;
    }
}
