# Working with multiple collaborators

If you have multiple teammates all working on the same miniapp, it's possible to add them as collaborators so that everyone gets Points when someone unlocks your miniapp. After all, on Seam we want to reward everyone who had a hand in building miniapps! It doesn't matter if you're a designer, engineer, or someone with good ideas, everyone should be recognized for the part they play in collaboration.

Inside of the `types.tsx` file where all of the miniapp types live, you'll see a definition for a `PointSplit`, which is used to determine what % of the total points each collaborator should receive. 

```
export type PointSplit = {
  username: string;
  split: number; // 1.0 is 100%, 0.5 is 50%, etc. Make sure to add up to 1.0!
};
```

To add multiple collaborators, add another PointSplit object in the `createdBy` array, like so:
```
createdBy: [{username: "jamesburet", split: 0.5}, {username: "rocco", split: 0.5}],
```

All percentages must add up to 1.0. The split percentages are up to your team, and remember to fairly reward anyone who helped you build your miniapp. It goes without saying, but don't tamper with the percentages of other miniapps that aren't your own -- those pull requests will be rejected.