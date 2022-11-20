import { expose } from "threads/worker";
import init, { convert } from "image-converter-rust";

expose(async function convertOnWorker(image) {
  await init();
  console.log(`Background worker working on ${image.original.name}`);
  const newdata = convert(image.original.data, undefined, image.convertTo);
  return newdata;
});
