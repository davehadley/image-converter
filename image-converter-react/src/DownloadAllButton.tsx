import fileDownload from "js-file-download";
import ImageState from "./ImageState";
import circle_check from "./circle_check.svg";
import loader_2 from "./loader_2.svg";
import alert_circle from "./alert_circle.svg";
import { promisify } from "util";

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
  if (props.image.length > 0) {
    let isEnabled = false;
    let icon;
    let className = "downloadAllButton";
    const numOkFiles = props.image.filter(
      (it) => it.converted !== undefined && it.converted.state === "success"
    ).length;
    if (
      props.image.some(
        (it) =>
          it.converted === undefined || it.converted.state === "processing"
      )
    ) {
      icon = (
        <img src={loader_2} className="icon loader" alt="Processing"></img>
      );
      className += " loading";
    } else if (
      props.image.every(
        (it) => it.converted !== undefined && it.converted.state === "success"
      )
    ) {
      icon = <img src={circle_check} className="icon" alt="OK"></img>;
      className += " ok";
      isEnabled = true;
    } else {
      icon = <img src={alert_circle} className="icon error" alt="Error"></img>;
      className += " error";
    }

    return (
      <div>
        <button
          className="downloadAllButton"
          type="button"
          onClick={onClick}
          disabled={!isEnabled}
        >
          {icon} Download {numOkFiles} image{numOkFiles > 1 ? "s" : ""}
        </button>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default DownloadAllButton;
