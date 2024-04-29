# FAQ

* My miniapp needs a dependency. How should I include it?
  * Add your new package using `yarn add`, and the main Seam application will bundle it when your block is accepted. Please don't add any extra UI libraries, as those can be very large, slowing down the entire Seam app.
* My block needs an external API key. How do I make it work?
  * The unfortunate reality of our current walled garden internet is that much of it is gated behind API keys. Use `process.env` in your local development to insert an API key, and on miniapp submission we'll work with you to see if it makes sense for Seam to apply for a global API key for the service you want to make a miniapp for.
* I found a bug, and something is not working. How do I fix it?
  * The best way to file a bug is by using Github issues.
