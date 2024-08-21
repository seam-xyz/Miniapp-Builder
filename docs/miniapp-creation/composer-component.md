---
description: Allowing the user to create their post
---

# Composer Component

{% embed url="https://www.youtube.com/watch?v=zv_h8QbiY4o" %}
Video walkthrough of creating the Composer Component
{% endembed %}

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

The job of the Composer Component is to store data in the `BlockModel`. Depending on what type of miniapp you are creating, you can create input fields here or even entire full gaming experiences. As the user makes selections, earns a highscore, or composes their song, add the relevant strings to the model. Then, call the done function with your updated model.

### Storing User Data

All data gets stored in the `BlockModel` which is a key-value store which holds strings. Seam stores the model in our database for you, so you don't have to worry about backends, authentication, or users. Each model is unique per post, and holds all the data necessary to render a post in the feed.

Storing a string is as easy as adding it to the model's `data` property:

```
model.data['text'] = "New User Text Here!"
```

Make sure not to store any data in here that is too large, for performance reasons. If you want to store images, videos, or other large files, you can use our [FileUploader](uploading-images-videos-and-files.md) component, and store the URL as a string in the model.

** Storing Numbers **

To store numbers, you can use the Javascript function `toString`, like so:

```
const highscore: number = 10;
model.data['highscore'] = highscore.toString();
```

** Storing Arrays **

The model only allows strings, so how do you store more complex data types, like arrays? For that, you can use the `JSON.stringify()` function, like so:
```
const userPreferences = ['apple', 'orange'];
model.data['userPreferences'] = JSON.stringify(userPreferences)
```

Again, make sure to not store arrays that are too large in the data model -- that'll cause your posts to render slowly in the feed!

### Posting

Once the user is done in your miniapp, call the done function with the updated model. This will automatically advance the composer to the preview step. For example from the Camera miniapp:

```
const onFinalize = (photoUrl: string) => {
  model.data.photoUrl = photoUrl;
  done(model);
};
```

### Next Steps

Once you have a Composer Component that takes in user choices, saves them to the model, and calls the done function, run `yarn start` to see your latest changes live in the example composer. As always, check out other open source miniapps to learn how other people have constructed their miniapps.

Next, it's time to create the Feed Component!
