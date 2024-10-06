import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';
import MemeEditor from './utils/SeamMeme/components/MemeEditor';
import MemeBrowser from './utils/SeamMeme/components/MemeBrowser';


export const SeamComposerComponent = ({ model, done }: ComposerComponentProps) => {
    return (
        <div className='h-full w-full'>
            <MemeBrowser />
            {/* <MemeEditor /> */}
            {/* <FeedComponent /> */}
            {/* <ChooseMediaComponent /> */}
            {/* <button onClick={() => { done(model) }} className='bg-blue-300 w-full rounded-lg'> Create your own meme </button> */}
        </div>
    );
}


export const SeamFeedComponent = ({ model, update }: FeedComponentProps) => {
    return <h1>Hi, I'm in the feed!</h1>;
}

