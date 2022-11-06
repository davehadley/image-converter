import { useDropzone } from "react-dropzone";
import fileDownload from "js-file-download";

interface DownloadProps {
  data: ArrayBuffer;
  fileName: string;
}

function Download(props: DownloadProps) {
  const onClick = () => {
    fileDownload(props.data, props.fileName);
  };
  return (
    <div>
      <button type="button" onClick={onClick}>
        Download {props.fileName}
      </button>
    </div>
  );
}

export default Download;
