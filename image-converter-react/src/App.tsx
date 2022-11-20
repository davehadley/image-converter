import React, { useEffect } from "react";
import "./App.css";
import { Format } from "image-converter-rust";
import Dropzone from "./FileDropzone";
import DroppedFile from "./DroppedFile";
import ImageState from "./ImageState";
import ImageList from "./ImageList";
import path from "path";
import FormatPicker from "./FormatPicker";
import DownloadAllButton from "./DownloadAllButton";
import { spawn, Pool } from "threads";

function App() {
  const [imageList, setImageList] = React.useState<ImageState[]>([]);
  const [outputFormat, setOutputFormat] = React.useState<Format>(Format.Png);
  const [imageCounter, setImageCounter] = React.useState(0);

  const updateImages = (imageData: ImageState[]) => {
    console.log(`Updating ${imageData.length} images`);
    imageData.forEach((image) => {
      if (image.converted === undefined) {
        processImage(image).then((newImage) => {
          console.log(`Updating image ${newImage.original.name}`);
          setImageList((oldList) => {
            const newList = [...oldList];
            newList[oldList.indexOf(image)] = newImage;
            return newList;
          });
        });
      }
      return;
    });
  };

  const onImageDropped = (droppedFiles: DroppedFile[]) => {
    const imageData = droppedFiles.map((droppedFile) => {
      console.log(`onImageDropped added ${droppedFile.name}`);
      setImageCounter(imageCounter + 1);
      return {
        id: droppedFile.name + imageCounter.toString(),
        original: droppedFile,
        convertTo: outputFormat,
        converted: undefined,
      };
    });
    setImageList((oldList) => [...oldList, ...imageData]);
  };

  const onSetFormat = (format: Format) => {
    console.log(`Set output image format ${Format[format]}`);
    setOutputFormat(format);
    setImageList((oldList) =>
      oldList.map((value) => {
        return { ...value, convertTo: format, converted: undefined };
      })
    );
  };

  useEffect(() => {
    updateImages(imageList);
  }, [imageList]);

  return (
    <div className="App">
      <header className="App-header">
        <Dropzone onImageDropped={onImageDropped}>
          <FormatPicker format={outputFormat} onSetFormat={onSetFormat} />
          <DownloadAllButton image={imageList} />
          <ImageList imageList={imageList} />
        </Dropzone>
      </header>
    </div>
  );
}

const pool = Pool(
  () =>
    spawn(
      new Worker(new URL("./convert.js", import.meta.url), { type: "module" })
    )
  // 1 // limit number of simultaneous jobs (num CPUs if not set)
);

async function processImage(image: ImageState): Promise<ImageState> {
  const result = { ...image };
  if (image.original.data) {
    // const newdata = convert(image.original.data, undefined, image.convertTo);
    console.log(`Send image ${image.original.name} to background worker`);
    const newdata: ArrayBuffer | undefined = await pool.queue(
      async (convertOnWorker) => convertOnWorker(image)
    );
    console.log(`Received ${newdata} back from background worker`);
    if (newdata) {
      result.converted = {
        name: getNewName(image.original.name, image.convertTo),
        data: newdata,
        state: "success",
      };
    } else {
      result.converted = {
        name: getNewName(image.original.name, image.convertTo),
        state: "failed",
      };
    }
  }
  return result;
}

function getNewName(name: string, to: Format): string {
  return path.parse(name).name + "." + Format[to].toLowerCase();
}

export default App;
