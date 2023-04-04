import { BlockModel } from './types'
import { Theme } from "@mui/material"

interface IBlock {
    name: string
    model: BlockModel
    theme: Theme
    onEditCallback?: () => void
    canBlockExpand: boolean; // when Seam pages are embedded into games, blocks do not scroll. Blocks can have a 'see all' label if they are expandable.

    render(): React.ReactNode
    renderEditModal(done: () => void): React.ReactNode
    renderErrorState(): React.ReactNode
}

export default class Block implements IBlock {
    name: string;
    model: BlockModel;
    theme: Theme;
    canBlockExpand: boolean;
    onEditCallback?: () => void;

    constructor(model: BlockModel, theme: Theme) {
        this.name = model.type
        this.model = model
        this.theme = theme
        this.canBlockExpand = false
    }

    render(): React.ReactNode {
        throw new Error("Method not implemented.");
    }
    renderEditModal(done: (data: BlockModel) => void): React.ReactNode {
        throw new Error("Method not implemented.");
    }
    renderErrorState(): React.ReactNode {
        throw new Error("Method not implemented.");
    }
}