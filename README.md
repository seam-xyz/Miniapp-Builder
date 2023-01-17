<p align="center">
  <a href="#">
    <img src="https://user-images.githubusercontent.com/7350670/212753058-373e9a5c-3247-44a5-8455-19c093aed511.svg" width="450">
  </a>
</p>
<p align="center">
<a href="https://twitter.com/intent/follow?screen_name=seam_xyz">
        <img src="https://img.shields.io/twitter/follow/seam_xyz?style=social&logo=twitter"
            alt="follow on Twitter"></a>
</p>
<h1 align="center">
  Seam Block Builder
</h1>


https://user-images.githubusercontent.com/7350670/212757467-69afc52b-2aca-4308-b5a5-323182b99e9f.mov

[Seam](https://www.seam.so) is a community-developed platform to code, design, and curate your perfect social spaces. You can make new cards filled with anything from around the internet, from profiles for yourself or moodboards for your favorite things. Then you can publish your card as a website to share it with your friends.

Many people ask how to make cool blocks like the ones that already live inside the Seam editor. The answer is React components. It is very simple to learn and anyone can do it. You don't need to be a programmer, and you can use the examples of other blocks that already exist to get started.

We've made it easy in this repository to make a new block, and then publish it live so that anyone else in the world can use your new creation, too. We're all building this together!

### What are blocks?

Blocks are software Legos; they are small, re-usable components and functionality. Each profile is made of blocks. Use the music block to play your anthem, the video block to showcase your projects, the text block to write anything you want. And if you need something that isn't already available, you can make it here, yourself. 

**What happens when you make a block on Seam?**
- Accepted blocks go inside [seam.so](https://www.seam.so), and then you can add them into your profile!
- Anyone else can also use your block on their profile.
  - Eventually, you'll be able to earn points + rewards when your block goes viral after being added to many different profiles.
- You'll learn to code Javascript and React, one of the most used languages on the Internet.

# Start Here

https://user-images.githubusercontent.com/7350670/213023742-116abf08-51d8-4b9e-a289-7b601b5d458a.mp4

1. git clone the repo, `cd Block-SDK`
2. `yarn install`
3. `./seam-magic.sh` will guide you through creating a template of an empty block, given whatever name you choose!
4. `yarn start` to see your new block in action.

# Block Maker's Guide

After creating your new block using our magic script, there are only 3 functions you need to write to make your block.
- The `render()` function renders the block based on the data it has in its `BlockModel`.
- The `renderEditModal` function renders what goes inside the edit modal, which is typically a form for the user to add their customization options into. It also has a `done` function, which will call with the finished model.
- The `renderErrorState` function, which is shown whenever there is an error.

Lastly, don't forget to add your **icon** to `types.tsx`! This is the icon that will show when the user is browsing the block list inside the Seam editor.

### Saving and Accessing data

Each block is given a `BlockModel` from our server, which holds a key/value store inside of its `data`. Here, you can store any string you want -- each block holds data for the card that it lives in, meaning that you don't have to worry about different users/cards when storing data.

When the block is added to a card in production, it hooks into a fully functioning data layer using the same api that was previously mocked for your local development.

### Design Systems

With Seam blocks, you don't have to start from scratch. Learn from examples of existing blocks, and in addition, we use the [Material UI system (MUI)](https://mui.com/material-ui/getting-started/overview/). Browse the docs to use common components like buttons, selectors, and more. We are in the process of deprecating the `antd` library.

### Theming

As the block developer, you decide how you want your block to reflect the global card theme. Each Seam card has a theme, which determines background color, block background color, font, and many other attributes. Themes are implemented as [`MUI Themes`](https://mui.com/material-ui/customization/theming/), which provides handy defaults and color palettes for theming components.

To use the theme, you can find it in your block at `this.theme`. The key variables you might want are as follows:

```
palette: {
    primary: {          // Card Background
      main: "#020303"
    },
    secondary: {
      main: "#1C1C1C"  // Block Background
    },
    info: {
      main: "#CCFE07"  // Accent Color
    }
  },
  typography: {
    fontFamily: "monospace"
  }
```

You can find working examples inside of the `LinkBlock.tsx` and the default theme in `App.tsx`. It is entirely optional to use the themes in your block, but it can add greater cohesion and make your block fit nicer inside of user's cards. If you don't use the theme variables, your block will have a white background by default, and it is up to you to define a font.

# Block Submission
Once you are happy with your block, it's time to create a pull request so your block can go live on the [seam.so](www.seam.so) site!

### Submission Guidelines

# Q&A
- My block needs a dependency. How should I include it?
    - Add your new package using `yarn add`, and the main Seam application will bundle it when your block is accepted. Please don't add any extra UI libraries, as those can be very large, slowing down the entire Seam site.
- My block needs an external API key. How do I make it work?
    - The unfortunate reality of our current walled garden internet is that much of it is gated behind API keys. Use `process.env` in your local development to insert an API key, and on block submission we'll work with you to see if it makes sense for Seam to apply for a global API key for the service you want to make a block for.
- I found a bug, and something is not working. How do I fix it?
    - The best way to file a bug is by using Github issues.
