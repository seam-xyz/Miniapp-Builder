# Seam Block SDK
### 🚧 This SDK is in active development. Join us along the journey! 🚧

[Seam](www.seam.so) is a community-developed platform to code, design, and curate your perfect social spaces. Each page is composed of blocks. We provide a testing harness, a mocked version of a card and data storage, which allows quick iteration on your block without ever touching production data.

What do you get by creating blocks on Seam?
- Learn to code Javascript and React. All of our blocks are open source so that you can learn from examples.

# Quickstart

1. git clone the repo
2. `yarn install`
3. `./seam-magic.sh` will guide you through creating a template of an empty block, given whatever name you choose!
4. `yarn start` to see your new block in action.

### What are blocks?

Blocks are software Legos; they are small, re-usable components and functionality.

### Seam Data Access

# Block Development Guide

After creating your new block using our magic script, there are only 3 functions you need to write to make your block.
- The `render()` function renders the block based on the data it has in its `BlockModel`.
- The `renderEditModal` function renders what goes inside the edit modal, which is typically a form for the user to add their customization options into. It also has a `done` function, which will call with the finished model.
- The `renderErrorState` function, which is shown whenever there is an error.

Lastly, don't forget to add your block icon to `types.tsx`! This is the icon that will show when the user is browsing the block list inside the Seam editor.

### Saving and Accessing data

Each block is given a `BlockModel` from our server, which holds a key/value store inside of its `data`. Here, you can store any string you want -- each block holds data for the card that it lives in, meaning that you don't have to worry about different users/cards when storing data.

When the block is added to a card in production, it hooks into a fully functioning data layer using the same api that was previously mocked for your local development.

# Block Submission
Once you are happy with your block, it's time to create a pull request so your block can go live on the [seam.so](www.seam.so) site!

### Submission Guidelines

# Q&A
- My block needs a dependency. How should I include it?
    - Add your new package using `yarn add`, and the main Seam application will bundle it when your block is accepted
- My block needs an external API key. How do I make it work?
    - The unfortunate reality of our current walled garden internet is that much of it is gated behind API keys. Use `process.env` in your local development to insert an API key, and on block submission we'll work with you to see if it makes sense for Seam to apply for a global API key for the service you want to make a block for.
- I found a bug, and something is not working. How do I fix it?
    - The best way to file a bug is by using Github issues.