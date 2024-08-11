# Uploading Images, Videos, and Files

If your miniapp involves allowing users to upload files, Seam provides a [Firebase](https://firebase.google.com/docs/emulator-suite) storage bucket for our miniapp file upload and storage. This allows you to upload any file (image, video, sounds, 3d images) and not worry about hosting your own backend. Additionally, you can use this simulated testing enviroment when you build you miniapp, without needing to upload to a real server.

#### Getting started: Setting up Firebase locally

To get started uploading files, you'll need to run a local server to simulate the process of uploading and downloading files. Open up a new terminal at your Miniapp Builder SDK directory and run the following command: 

```
npx firebase emulators:start
```

Then, you can see a sample file upload bucket at `http://127.0.0.1:4000/storage/demo-seam-miniapp-builder/files`.

#### Uploading Images

To upload images in your miniapp, you can use the `FileUploadComponent` provided to you by Seam, like so:

```
import FileUploadComponent from './utils/FileUploadComponent';

const handleUpdate = (uploadedUrls: string[]) => {
    setPreviewUrls(uploadedUrls);
};

<FileUploadComponent
    fileTypes="image/*"
    label={previewUrls.length > 0 ? "Upload More Images" : "Upload Images"}
    onUpdate={handleUpdate}
    multiple={true}
    maxFiles={10}
/>
```

This gives you a button that when clicked allows the user to pick photos from their camera roll. Check out the `ImageComposerComponent` for a full example.

#### Uploading Videos

To upload videos in your miniapp, you can use the same `FileUploadComponent`, but specify a fileType of video, like so:

```
import FileUploadComponent from './utils/FileUploadComponent';

const [uploadedUrl, setUploadedUrl] = useState(model.data['url'] || "");

const handleUpdate = (urls: string[]) => {
    if (urls.length > 0) {
      setUploadedUrl(urls[0]);
      model.data['url'] = urls[0]; // Only one video is allowed
    }
};

<FileUploadComponent
    fileTypes="video/*"
    label="Upload a Video"
    onUpdate={handleUpdate}
    multiple={false}
    maxFiles={1}
/>
```
This gives you a button that when clicked allows the user to a video from their camera roll. Check out the `VideoBlock` for a full example.

#### Uploading arbitrary files

For any other file types, you can use the Firebase uploader functions yourself. Read more in the [documentation here](https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/storage).

#### Testing file uploads

The strategy is 1) use the upload component to upload, and then 2) store the URL in your block. TADA! You're done, that's all you need to upload any file! Try it with audio files, pdfs, videos, ect. Have fun!
