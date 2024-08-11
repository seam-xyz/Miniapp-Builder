# FAQ

* My miniapp needs a dependency. How should I include it?
  * Add your new package using `yarn add`, and the main Seam application will bundle it when your block is accepted. Please don't add any extra UI libraries, as those can be very large, slowing down the entire Seam app.
* How do I let users upload Images/Videos/Files with my miniapp?
  * See the [Uploading Images, Videos, and Files](https://docs.getseam.xyz/miniapp-creation/uploading-images-videos-and-files) page under the Miniapp Creation section.
* My block needs an external API key. How do I make it work?
  * The unfortunate reality of our current walled garden internet is that much of it is gated behind API keys. Use `process.env` in your local development to insert an API key, and on miniapp submission we'll work with you to see if it makes sense for Seam to apply for a global API key for the service you want to make a miniapp for.
* I found a bug, and something is not working. How do I fix it?
  * [Create a new issue](https://github.com/seam-xyz/Miniapp-Builder/issues/new) in the Seam miniapp builder github repository, and we'll address it.
