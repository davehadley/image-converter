import { Format } from "image-converter-rust";

interface FormatPickerProps {
  format: Format;
  onSetFormat: (format: Format) => any;
}

function FormatPicker(props: FormatPickerProps) {
  //Object.values(Format).filter((v) => isNaN(Number(v))).map((it) => console.log(it));

  const content = (Object.keys(Format) as (keyof typeof Format)[])
    .filter((v) => isNaN(Number(v)))
    .map((format) => {
      const onClick = (event: any) => {
        props.onSetFormat(Format[format]);
        event.stopPropagation();
      };
      let className =
        Format[format] === props.format
          ? "formatButtonIsSelected"
          : "formatButtonIsNotSelected";
      className += ` formatButton${format.toLowerCase()} `;
      return (
        <button
          className={className}
          type="button"
          onClick={onClick}
          key={format}
        >
          {format.toLowerCase()}
        </button>
      );
    });
  return <div>{content}</div>;
}

export default FormatPicker;
