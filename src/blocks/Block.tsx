import { BlockModel } from './types'
import { Theme } from "@mui/material"

interface IBlock {
    name: string
    model: BlockModel
    theme: Theme
    onEditCallback?: () => void

    render(width?: string, height?: string): React.ReactNode // units in px
    renderEditModal(done: () => void): React.ReactNode
}

export default class Block implements IBlock {
    name: string;
    model: BlockModel;
    theme: Theme;
    onEditCallback?: () => void;

    constructor(model: BlockModel, theme: Theme) {
        this.name = model.type
        this.model = model
        this.theme = theme
    }

    render(): React.ReactNode {
        throw new Error("Method not implemented.");
    }
    renderEditModal(done: (data: BlockModel) => void, width?: string): React.ReactNode {
        throw new Error("Method not implemented.");
    }
}