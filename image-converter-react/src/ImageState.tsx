import DroppedFile from "./DroppedFile";
import { Format } from "image-converter-rust";
import { MaybeConverted } from "./ConvertedFile";

interface ImageState {
  id: string;
  original: DroppedFile;
  convertTo: Format;
  converted: MaybeConverted | undefined;
}

export default ImageState;
