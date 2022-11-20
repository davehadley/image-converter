import ImageListItem from "./ImageListItem";
import ImageState from "./ImageState";

interface ImageListProps {
  imageList: ImageState[];
}

function ImageList(props: ImageListProps) {
  const listItems = props.imageList.map((image: ImageState) => {
    return (
      <li key={image.id}>
        <ImageListItem image={image} />
      </li>
    );
  });
  return <ul>{listItems}</ul>;
}

export default ImageList;
