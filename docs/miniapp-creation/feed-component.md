---
description: Allowing the user to view a post in the feed
---

# Feed Component

{% embed url="https://www.youtube.com/watch?v=qkqKN8Pmc4M" %}
Coding in React to make a Seam Miniapp Feed Component
{% endembed %}

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

<<<<<<< HEAD
** Retrieving Numbers **

To get numbers out of the model, you can use the Javascript function `parseInt`, like so:

```
const highscore: number = parseInt(model.data['highscore'])
```

** Retrieving Arrays **

Once you've stored your array in the model using `stringify`, you can get it back out again into an array by using `JSON.parse`, like so:
```
let urls = model.data['urls'] ? JSON.parse(model.data['urls']) : [];
```

It's important to check if the model data does have data in it to avoid crashing from the JSON parsing an undefined variable.
=======
### Rendering User Data

Then, once you have successfully retrieved your string data, you can render a component's UI. For example, here's a simple miniapp that just renders an image that it is given:

```
export const ImageFeedComponent = ({ model }: FeedComponentProps) => {
  let photoURL = model.data['photoURL']
  return (
    <div style={{ display: 'block', width: '100%' }}>
      <img src={photoURL} style={{ width: '100%', height: 'auto' }} />
    </div>
  );
}
```

### Updating User Data

If your miniapp requires changing the data stored in a post after it has been posted to the feed (for example: the Poll Miniapp), use the ```update``` function. 

Not unlike the done function, ```update``` is designed to take a single argument, your updated post data, of the following type: ```({ [key: string]: string })```

In the example of the Poll Miniapp, when a user votes on a poll, the new vote totals need to be stored and reflected across Seam. The ```update``` function handles this by interacting with Seam's backend. 

```
const handleVote = async (optionKey: string) => {
  if (hasVoted) return; // Prevent multiple votes

  const updatedVotes = { ...votes, [optionKey]: votes[optionKey] + 1 };
  setVotes(updatedVotes); // Optimistic update
  setTotalVotes(totalVotes + 1);
  setSelectedOption(optionKey);
  setHasVoted(true);

  try {
    // Prepare the updated data for the backend
    const updatedData = { ...model.data };
    updatedData[`${optionKey}Votes`] = updatedVotes[optionKey].toString();

    // Call the update function to save the new vote counts
    if (update) {
      await update(updatedData);
    }
  } catch (error) {
    console.error('Failed to update votes:', error);
  }
};
```

In the above example, after a Seam user casts their vote, the ```update``` function is called with the updatedData containing the user's vote. The function call will update that post's data on Seam's backend. 

Poll Miniapp postData before calling the update function:
```
"data": {
  "question": "a or b",
  "option1": "a",
  "option1Votes": “0”,
  "option2": "b",
  "option2Votes": "0"
},
```

After:
```
"data": {
  "question": "a or b",
  "option1": "a",
  "option1Votes": “1”,
  "option2": "b",
  "option2Votes": "0"
},
```

### Optimistic UI Updates

It is generally advised to update the local state before calling the ```update``` function. This will provide immediate optimistic feedback to the user while the backend update is processed.

>>>>>>> ae788b55f94f7731bc46338848732a1578c84c95
