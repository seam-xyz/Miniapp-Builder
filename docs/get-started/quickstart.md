---
description: Step-by-step guide on how to create your own Seam miniapp
---

# Quickstart

{% embed url="https://youtu.be/oPiLc6U1oIA?si=mw2DICgrm72LQO6L" %}
Tutorial for getting started creating a Seam miniapp
{% endembed %}

### Create a Seam Account

Before creating a miniapp, you should join Seam! Creating a Seam account allows you to claim a username and profile that will be used as the author of the miniapp. More importantly though, it allows you to join a community of other builders, designers, and curators all building the future of social networking together.

Either join on web at [seam.so](https://www.seam.so), or [download our iOS app from the Apple appstore](https://apps.apple.com/us/app/seam-social/id6473547569).

### Setup your development environment

If you're new to programming in general and want to get setup for the first time, head to the [Local Environment Setup](local-environment-setup.md) section to learn more. Otherwise, if you have a favorite code editor and a local Node environment, you're good to go.

### Fork the Miniapp Builder Repository

The next step is to get the miniapp testing code running on your machine. All Seam miniapp code is open source and can be found in our [GitHub repository here](https://github.com/seam-xyz/Miniapp-Builder).&#x20;

First, [fork the Seam Miniapp github repository](https://github.com/seam-xyz/Miniapp-Builder/fork) to your own account, so that you'll be able to make a Pull Request later.

Then, clone your fork with the GitHub CLI tool:

```
gh repo clone [[your github username here]]/Miniapp-Builder
```

Next, in your terminal, install all the dependencies with:

<pre><code><strong>$ cd Miniapp-Builder
</strong>$ yarn install
</code></pre>

Finally, get started with an example home feed of the Seam miniapp builder by running:

<pre><code><strong>$ yarn start
</strong></code></pre>

The Seam miniapp testing harness will show up in your browser at [http://localhost:3000/](http://localhost:3000/). This is a fake feed that you can post into to try all the different miniapps that exist on Seam, and to make sure your new one is working as expected.

### Run the ✨ Seam Magic ✨ script

Now it's time to make some Seam Magic! Starting a new Seam miniapp is simple. In your Miniapp Builder repository terminal window, run the Seam Magic script and it will handle the rest:

<pre><code><strong>$ sh ./seam-magic.sh
</strong></code></pre>

You'll get asked three questions:

```
[1/3] What's your Seam username?
```

Entering your username allows Seam to give you Seam Points when someone unlocks your miniapp, and also give you credit as the author in the composer.

```
[2/3] What should your app be called?
```

This is the title of your miniapp that users will see when they unlock it from the composer. It also will be used to autogenerate code files for you. Some tips:

1. Good miniapp names are short (we trim to the first word).
2. The script autocapitalizes the first letter of the name, and the rest will be lowercased.
3. Miniapp needs to be unique -- so if you have another Image or Video miniapp, make sure to differentiate it!

```
[3/3] What's the description of your app?
```

This is the short (100 characters, max) description of what your miniapp allows users to post. Here are some examples from our existing miniapps:

* "Upload an image and turn it into a sliding puzzle!"
* "Draw on a whiteboard!"
* Create works of art in the style of Piet Mondrian"

### Next Steps

Once you have your miniapp files all set up, it's time to code your [Composer Component](../miniapp-creation/composer-component.md).
