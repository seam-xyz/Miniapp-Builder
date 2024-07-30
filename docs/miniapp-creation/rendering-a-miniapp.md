---
description: >-
  Taking user data and displaying it in the feed when people post with your
  miniapp
---

# Feed Component

After running the `./seam-magic.sh` script from the quickstart, you'll have created a feed component like this:

```
export const BookshelfFeedComponent = ({ model }: FeedComponentProps) => {
  return (
    <BookDetail title={model.data['title']} author={model.data['author']} coverImage={model.data['coverImage']} />
   );
}
```
