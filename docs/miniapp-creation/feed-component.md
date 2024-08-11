---
description: Allowing the user to view a post in the feed
---

# Feed Component

The second step to creating a miniapp is to define the feed component, which is what displays in the feed of Seam.

After running the `./seam-magic.sh` script in the quickstart, you'll be given a feed component that looks like this:

```
export const YourAppFeedComponent = ({ model }: FeedComponentProps) => {
  return <h1>Hi, I'm in the feed!</h1>;
}
```

The job of the Feed Component is to read the data out of the model, and use it to render a post in the feed. 

### Fetching User Data

Just as you stored data in the composer component, in the feed component you'll need to get the strings you stored out. Getting data out of the model is as easy as:
```
const photoURL = model.data['photoURL']
```
Make sure that the key that you're looking at is the same as the one you used in your Composer Component.
