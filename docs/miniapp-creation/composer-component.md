---
description: Allowing the user to create their post
---

# Composer Component

The first step to creating a miniapp is to define the composer component, which is what displays in the post composer and allows a user to create a post using your miniapp.

After running the `./seam-magic.sh` script in the quickstart, you'll be given a composer component that looks like this:

```
export const YourMiniappComposerComponent = ({ model, done }: ComposerComponentProps) => {
  return (
    <div>
      <h1>Hi, I'm in the composer!</h1>
      <button onClick={() => { done(model) }}> Post </button>
    </div>
  );
}
```

### Storing User Data

All data gets stored in the `BlockModel` which is a key-value store which holds strings.

### Posting

Once the user is done in your miniapp, call the done function with the updated model. This will automatically advance the composer to the preview step.
