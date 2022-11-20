// Make use of TypeScript tagged union
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#tagged-union-types
export interface ConvertedFile {
  name: string;
  data: ArrayBuffer;
  state: "success";
}

export interface FailedToConvertFile {
  name: string;
  state: "failed";
}

export type MaybeConverted = ConvertedFile | FailedToConvertFile;

export default ConvertedFile;
