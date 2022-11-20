import React from "react";
import { useDropzone } from "react-dropzone";
import DroppedFile from "./DroppedFile";

interface FileDropzoneProps {
  onImageDropped: (droppedFiles: DroppedFile[]) => any;
  children: React.ReactNode;
}

function FileDropzone(props: FileDropzoneProps) {
  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      console.log(`FileDropzone got file ${file.name}`);
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const result = reader.result;
        if (result instanceof ArrayBuffer) {
          props.onImageDropped([{ name: file.name, data: result }]);
        } else {
          props.onImageDropped([{ name: file.name, data: undefined }]);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input className="dropzoneInput" {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
      {props.children}
    </div>
  );
}

export default FileDropzone;
