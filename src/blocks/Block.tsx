import { BlockModel } from './types'

interface IBlock {
    name: string
    model: BlockModel
    onEditCallback?: () => void

    render(): React.ReactNode
    renderEditModal(done: () => void): React.ReactNode
    renderErrorState(): React.ReactNode
}

export default class Block implements IBlock {
    name: string;
    model: BlockModel;
    onEditCallback?: () => void;

    constructor(model: BlockModel) {
        this.name = model.type
        this.model = model
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