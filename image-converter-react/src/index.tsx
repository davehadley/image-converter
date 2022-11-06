import image_converter_library from "image-converter-rust";

// Guarantee that the image-converter-library is initialized
image_converter_library().then((_) => {
  import("./main").then((main) => {});
});
