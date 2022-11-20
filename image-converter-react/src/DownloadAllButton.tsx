import fileDownload from "js-file-download";
import ImageState from "./ImageState";

interface DownloadAllButtonProps {
  image: ImageState[];
}

function DownloadAllButton(props: DownloadAllButtonProps) {
  const onClick = (event: any) => {
    props.image.forEach((image) => {
      if (
        image.converted !== undefined &&
        image.converted.state === "success"
      ) {
        fileDownload(image.converted.data, image.converted.name);
      }
      event.stopPropagation();
    });
  };
  const isEnabled =
    props.image.length > 0 &&
    props.image.every((image) => image.converted !== undefined);
  return (
    <div>
      <button
        className="downloadAllButton"
        type="button"
        onClick={onClick}
        disabled={!isEnabled}
      >
        Download all
      </button>
    </div>
  );
}

export default DownloadAllButton;
