# Uploading Images, Videos, and Files

If your miniapp involves allowing users to upload files (image, video, audio, etc.) please note that we use [Firebase](https://firebase.google.com/docs/emulator-suite) for our miniapp file upload and storage. 

#### Setting up Firebase locally

Open up a new terminal at your Miniapp Builder SDK directory and run the following command: 

```
firebase emulators:start
```

If you're experiencing problems, make sure the firebase Section of your local `Index.tsx` matches the Miniapp Builder SDK. 

#### Testing file uploads

The Miniapp Builder SDK provides a nearly identical `FileUploadComponent` to the one we use on the production version of Seam. 

To use it, just import the `FileUploadComponent` in your edit modal. Check out the `VideoBlock` or `ImageBlock` as an example. The strategy is 1) use the upload component to upload, and then 2) store the URL in your block. TADA! You're done, that's all you need to upload any file! Try it with audio files, pdfs, videos, ect. Have fun!
