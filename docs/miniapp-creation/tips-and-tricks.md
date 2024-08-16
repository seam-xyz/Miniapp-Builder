# Tips and Tricks

### Changing the iOS status bar color

If you'd like to change the top status bar color (where the iOS battery, clock, reception, etc. are displayed) for your fullscreen miniapp, you can do so via the following:

``` 
document.body.style.backgroundColor = "#YOUR_BACKGROUND_COLOR";
```

We currently implement this solution on several miniapps via the following example:

```
export const YourMiniappComposerComponent = ({ model, done }: 
  useEffect (() => {
    document.body.style.backgroundColor = "#YOUR_BACKGROUND_COLOR";

    return () => {
      document.body.style.backgroundColor = "#FFFFFF";
    }
  })
)
```

It's important to set the background color back to white on cleanup to ensure the status bar is restored to its original color.