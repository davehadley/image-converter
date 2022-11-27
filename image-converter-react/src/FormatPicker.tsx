import { Format } from "image-converter-rust";
import extensionFromFormat from "./extensionFromFormat";

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
        <input
          className={className}
          type="button"
          onClick={onClick}
          key={format}
          value={"." + extensionFromFormat(Format[format])}
        />
      );
    });
  const chunkedContent = chunked(content, 3).map((it) => (
    <div className="formatButtonContainerInner">{it}</div>
  ));
  return (
    <div className="formatPickerContainer">
      <h2>Choose output format</h2>
      <div className="formatButtonContainer">{chunkedContent}</div>
    </div>
  );
}

function chunked<Type>(array: Type[], size: number): Type[][] {
  const initial: Type[][] = [[]];
  return array.reduce((outerArray, value) => {
    const innerArray = outerArray[outerArray.length - 1];
    if (innerArray.length < size) {
      innerArray.push(value);
    } else {
      outerArray.push([value]);
    }
    return outerArray;
  }, initial);
}

export default FormatPicker;
