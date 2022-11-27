import fileDownload from "js-file-download";
import ImageState from "./ImageState";
import circle_check from "./circle_check.svg";
import loader_2 from "./loader_2.svg";
import alert_circle from "./alert_circle.svg";
import trash_x from "./trash_x.svg";

interface ImageListItemProps {
  image: ImageState;
  onDelete: (image: ImageState) => any;
}

function ImageListItem(props: ImageListItemProps) {
  const onClick = (event: any) => {
    if (props.image.converted && props.image.converted.state === "success") {
      fileDownload(props.image.converted.data, props.image.converted.name);
    }
    event.stopPropagation();
  };
  let icon;
  let className = "downloadButton";
  if (
    props.image.converted === undefined ||
    props.image.converted.state === "processing"
  ) {
    icon = <img src={loader_2} className="icon loader" alt="Processing"></img>;
    className += " loading";
  } else if (props.image.converted.state === "failed") {
    icon = <img src={alert_circle} className="icon error" alt="Error"></img>;
    className += " error";
  } else {
    icon = <img src={circle_check} className="icon" alt="OK"></img>;
    className += " ok";
  }
  const onDelete = () => props.onDelete(props.image);
  return (
    <div className="imageListItem">
      <button
        className={className}
        type="button"
        onClick={onClick}
        disabled={
          props.image.converted === undefined ||
          props.image.converted.state !== "success" ||
          !props.image.converted
        }
      >
        {icon}
        {props.image.converted?.name || props.image.original.name}
      </button>
      <button className="deleteItemButton" type="button" onClick={onDelete}>
        <img src={trash_x} className="icon" alt="Delete"></img>
      </button>
    </div>
  );
}

export default ImageListItem;
