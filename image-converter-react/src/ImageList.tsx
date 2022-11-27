import ImageListItem from "./ImageListItem";
import ImageState from "./ImageState";

interface ImageListProps {
  imageList: ImageState[];
  onDeleteImage: (image: ImageState) => any;
}

function ImageList(props: ImageListProps) {
  const listItems = props.imageList.map((image: ImageState) => {
    return (
      <li key={image.id}>
        <ImageListItem image={image} onDelete={props.onDeleteImage} />
      </li>
    );
  });
  return <ul className="imageList">{listItems}</ul>;
}

export default ImageList;
