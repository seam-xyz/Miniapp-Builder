# Rendering a Miniapp

After creating your new miniapp using our magic script, there are only 3 functions you need to write to make your miniapp.

* The `render()` function renders the miniapp based on the data it has in its `BlockModel` as a post in the feed.
* The `renderEditModal` function renders the creation experience, which is typically a form for the user to add their customization options into. It also has a `done` function, which automatically saves the model to the Seam server.
* The `renderErrorState` function, which is shown whenever there is an error.
