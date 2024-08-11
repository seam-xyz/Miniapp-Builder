import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types'

export const UnknownFeedComponent = ({ model }: FeedComponentProps) => {
  return (
    <h1>Unknown Miniapp! Update your app or come back later.</h1>
   );
}

export const UnknownComposerComponent = ({ model, done }: ComposerComponentProps) => {
  return (
    <h1>Edit Unknown Block</h1>
  )
}