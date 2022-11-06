import React from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  callback: (buffer: ArrayBuffer) => any;
}

function Dropzone(props: DropzoneProps) {
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const result = reader.result;
        if (result instanceof ArrayBuffer) {
          props.callback(result);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
}

export default Dropzone;
