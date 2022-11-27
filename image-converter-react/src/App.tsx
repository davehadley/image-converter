import React, { useEffect } from "react";
import { Format } from "image-converter-rust";
import FileDropzone from "./FileDropzone";
import DroppedFile from "./DroppedFile";
import ImageState from "./ImageState";
import ImageList from "./ImageList";
import path from "path";
import FormatPicker from "./FormatPicker";
import DownloadAllButton from "./DownloadAllButton";
import { spawn, Pool } from "threads";
import { Link } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import extensionFromFormat from "./extensionFromFormat";

function App() {
  const [imageList, setImageList] = React.useState<ImageState[]>([]);
  const [outputFormat, setOutputFormat] = React.useState<Format>(Format.Png);
  const [imageCounter, setImageCounter] = React.useState(0);

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

  const onImageFormatChange = (outputFormat: Format) => {
    console.log(`Set output image format ${Format[outputFormat]}`);
    setOutputFormat(outputFormat);
    setImageList((oldList) =>
      oldList.map((value) => {
        return { ...value, convertTo: outputFormat, converted: undefined };
      })
    );
  };

  const onDeleteImage = (image: ImageState) => {
    setImageList((imageList: ImageState[]) => {
      return imageList.filter((it) => it.id != image.id);
    });
  };

  useEffect(() => {
    let active = true;
    let jobs: ImageState[] = imageList.filter(
      (image) => image.converted === undefined
    );
    if (jobs.length > 0) {
      console.log(`Updating ${jobs.length} / ${imageList.length}  images`);
      const processingJobs: ImageState[] = jobs.map((it) => {
        return {
          ...it,
          converted: { name: it.original.name, state: "processing" },
        };
      });
      if (active) {
        setImageList((current) => mergeImageList(current, processingJobs));
        processingJobs.forEach(async (it) => {
          const image = await processImage(it);
          if (active) {
            setImageList((current) => mergeImageList(current, [image]));
          }
        });
        return;
      }
    }
    return () => {
      active = false;
    };
  }, [imageList]);

  return (
    <div className="App">
      <FileDropzone
        onImageDropped={onImageDropped}
        childrenAfterAdd={
          <p>
            <Link to="licenseandprivacy">License and Privacy</Link>
          </p>
        }
      >
        <Header />
        <div className="introTextContainer">
          <p>
            Completely free, unlimited, and{" "}
            <a href="https://github.com/davehadley/image-converter">
              open source
            </a>
            .
          </p>
          <p>
            Convert from: jpeg/jpg, png, bitmap/bmp, gif, ico, webp,
            exr/OpenEXR, tiff/tif, tga, ff/farbfeld and pbm/pam/ppm/pgm.
          </p>
          <p>
            Convert to: jpeg/jpg, png, bitmap/bmp, gif, ico, tiff/tif, tga,
            ff/farbfeld and pbm/pam/ppm/pgm.
          </p>
          <p>
            Privacy-preserving: all processing happens in the browser, images
            never leave your device.
          </p>
          <p>
            Drag and drop images or click "Add File" to choose images to
            convert.
          </p>
        </div>
        <FormatPicker format={outputFormat} onSetFormat={onImageFormatChange} />
        <div className="buttonContainer">
          <DownloadAllButton image={imageList} />
          <ImageList imageList={imageList} onDeleteImage={onDeleteImage} />
        </div>
      </FileDropzone>
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
  return path.parse(name).name + "." + extensionFromFormat(to);
}

function mergeImageList(
  original: ImageState[],
  updates: ImageState[]
): ImageState[] {
  return original.map(
    (old) => updates.find((value, _) => value.id == old.id) || old
  );
}

export default App;
