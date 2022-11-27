import { Format } from "image-converter-rust";

function extensionFromFormat(to: Format): string {
  switch (+to) {
    case Format.Png:
      return "png";
    case Format.Jpeg:
      return "jpg";
    case Format.Gif:
      return "gif";
    // case Format.WebP:
    //   return "webp";
    case Format.Pnm:
      return "pbm";
    case Format.Tiff:
      return "tiff";
    case Format.Tga:
      return "tga";
    // case Format.Dds:
    //   return "dds";
    case Format.Bmp:
      return "bmp";
    case Format.Ico:
      return "ico";
    // case Format.Hdr:
    //   return "hdr";
    // case Format.OpenExr:
    //   return "exr";
    case Format.Farbfeld:
      return "ff";
    // case Format.Avif:
    //   return "avif";
  }
  throw new Error("unknown file format");
}

export default extensionFromFormat;
