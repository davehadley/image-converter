import React from "react";
import { useDropzone } from "react-dropzone";
import DroppedFile from "./DroppedFile";
import plus from "./plus.svg";

interface FileDropzoneProps {
  onImageDropped: (droppedFiles: DroppedFile[]) => any;
  childrenAfterAdd: React.ReactNode;
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
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });
  const {
    getRootProps: getClickableProps,
    getInputProps: getClickableInputProps,
  } = useDropzone({ onDrop, noClick: false });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input className="dropzoneInput" {...getInputProps()} />
      {props.children}
      <button className="addFileButton" {...getClickableProps()}>
        <img src={plus} className="icon" alt="OK"></img>
        <input {...getClickableInputProps()} />
        Add File
      </button>
      {props.childrenAfterAdd}
    </div>
  );
}

export default FileDropzone;
