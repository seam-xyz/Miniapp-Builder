# Saving User Data

Each block is given a `BlockModel` from our server, which holds a key/value store inside of its `data`. Here, you can store any string you want -- each block holds data for the card that it lives in, meaning that you don't have to worry about different users/cards when storing data.

When the block is added to a card in production, it hooks into a fully functioning data layer using the same api that was previously mocked for your local development.
