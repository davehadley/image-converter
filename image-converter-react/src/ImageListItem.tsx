import fileDownload from "js-file-download";
import ImageState from "./ImageState";
import circle_check from "./circle_check.svg";
import loader_2 from "./loader_2.svg";
import alert_circle from "./alert_circle.svg";

interface ImageListItemProps {
  image: ImageState;
}

function ImageListItem(props: ImageListItemProps) {
  const onClick = (event: any) => {
    if (props.image.converted && props.image.converted.state === "success") {
      fileDownload(props.image.converted.data, props.image.converted.name);
    }
    event.stopPropagation();
  };
  let icon;
  if (props.image.converted === undefined) {
    icon = <img src={loader_2} className="loader" alt="Processing"></img>;
  } else if (props.image.converted.state === "failed") {
    icon = <img src={alert_circle} className="icon" alt="Error"></img>;
  } else {
    icon = <img src={circle_check} className="icon" alt="OK"></img>;
  }
  return (
    <div>
      <button
        className="downloadButton"
        type="button"
        onClick={onClick}
        disabled={
          props.image.converted === undefined ||
          props.image.converted.state === "failed"
        }
      >
        {props.image.converted?.name || props.image.original.name}
        {icon}
      </button>
    </div>
  );
}

export default ImageListItem;
