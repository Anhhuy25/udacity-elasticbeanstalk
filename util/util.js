import fs from "fs";
import { Jimp } from "jimp";
import path from "path";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  try {
    const __dirname = path.resolve();
    const dir = path.join(__dirname, "images");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const photo = await Jimp.read(inputURL);
    const outpath = path.join(
      dir,
      "/image-" + Math.random().toString(36).slice(2, 7) + ".jpg"
    );
    await photo.resize({ w: 256, h: 256 }).greyscale().write(`${outpath}`);

    return outpath;
  } catch (error) {
    console.log("----error----", error);
  }
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
