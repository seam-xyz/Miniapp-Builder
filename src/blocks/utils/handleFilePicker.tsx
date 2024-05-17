import { FilePicker } from '@capawesome/capacitor-file-picker';

export const handleFilePicker = async (fileTypes: string, multiple: boolean, handleFilesPicked: (files: any[]) => void) => {
  let result;
  try {
    const pickerOptions = {
      multiple,
      ordered: true, // Enable numbered order for the picker
      readData: true
    };

    if (fileTypes.includes('image')) {
      result = await FilePicker.pickImages(pickerOptions);
    } else if (fileTypes.includes('video')) {
      result = await FilePicker.pickVideos(pickerOptions);
    } else {
      result = await FilePicker.pickFiles({
        ...pickerOptions,
        types: fileTypes.split(',').map(type => type.trim()), // Use generic picker if specific type is not found
      });
    }

    if (result.files.length > 0) {
      handleFilesPicked(result.files);
    }
  } catch (error) {
    console.error("File selection cancelled by user or failed", error);
  }
};