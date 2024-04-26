# Manual Creation

Usually, you'll run the `./seam-magic.sh` script and it'll create an empty miniapp for you. However, there are times when you'll want to know what's going on under the hood, and the other pieces that are being setup for you.

#### Setting up the SDK Manually

Under the folder `src/blocks/blockIcons`, add a picture for your block icon, which will be displayed to users. Then, import it into `src/blocks/types.tsx`. It should look like this:

```
import marqueeIcon from "./blockIcons/marqueeIcon.png"
```

Then, add your block to the types dictionary. It should be in the following format, where _**shortName**_, _**name**_, and _**description**_ are strings of your choosing. _**icon**_ is the icon you just imported.

```
shortName: { 
        type: shortName,
        displayName: name,
        displayDescription: description,
        emptyTitle: "Empty name Block",
        emptySubtitle: "Tap here to setup your name block!",
        icon: icon, // TODO: insert your block icon here
        deprecated: false,
        doesBlockPost: false
    }
```

_**shortName**_ is the name of your block without spaces. For consistency purposes, it's recommended that this is capitalized. _**name**_ is the name of the block, visible to users. _**description**_ tells users what your block does.

For example, here's the Marquee block type:

```
  "Marquee": {
    type: "Marquee",
    displayName: "Marquee",
    displayDescription: "Displays a scrolling banner of text",
    emptyTitle: "Empty Marquee Block",
    emptySubtitle: "Tap here to setup your Marquee block!",
    icon: marqueeIcon,
    deprecated: false,
    doesBlockPost: true
    createdBy: "Your name here"
  }
```

Next, create a _**shortName**_Block.tsx file for your block under `src/blocks`. Copy and paste the contents of `src/blocks/BlockTemplate.txt` into _**shortName**_Block.tsx. Inside the _**shortName**_Block.tsx file, replace %NAME% with _**shortName**_. Note that when naming the file and replacing %NAME%, _**shortName**_ should be capitalized, if it isn't already.

For example, here is what the `src/blocks/MarqueBlock.tsx` file would contain after this step:

```
import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

export default class MarqueeBlock extends Block {
  render() {
    return (
      <h1>Marquee Block!</h1>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <h1>Edit Marquee Block!</h1>
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}
```

Afterwards, import your block into `src/blocks/BlockFactory.tsx` like this:

```
import MarqueeBlock from './MarqueeBlock'
```

And add a case for your block to the switch, like so:

```
case "Marquee": return new MarqueeBlock(model, theme)
```

Note that the string after `case` should be _**shortName**_.

Then, in `src/App.tsx`, replace %NAME% with _**shortName**_:

```
  let yourBlock: BlockModel = {
    type: "Marquee",
    data: {},
    uuid: "test"
  }
```
