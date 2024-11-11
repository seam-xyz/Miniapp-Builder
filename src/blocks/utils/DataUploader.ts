import { nanoid } from "nanoid";
import { Capacitor } from "@capacitor/core";
import { FirebaseStorage } from "@capacitor-firebase/storage";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { BlockModel } from "../types";


export async function DataUploader(dataURL: string, model: BlockModel, done: (data: BlockModel) => void): Promise<void> {
  // Get uri
  const blob = await (await fetch(dataURL)).blob();
  const name = nanoid();
  const path = `files/${name}`;
  let uri = path

  // Save the base64 string as a file in the temporary directory
  if (Capacitor.getPlatform() !== "web") {
    const savedFile = await Filesystem.writeFile({
      path: name,
      data: dataURL,
      directory: Directory.Cache,
    });
    uri = savedFile.uri;
  }

  // Firebase Storage
  await FirebaseStorage.uploadFile(
    {
      path,
      blob,
      uri: uri,
    },
    async (event, error) => {
      if (error) {
        return;
      }

      if (event && event.completed) {
        const result = await FirebaseStorage.getDownloadUrl({ path });
        if (result) {
          model.data["dataURL"] = result.downloadUrl;
          done(model);
        }
      }
    }
  )
  return
}

