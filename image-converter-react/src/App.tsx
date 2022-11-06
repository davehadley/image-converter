import React from "react";
import "./App.css";
import { convert } from "image-converter-rust";
import Dropzone from "./Dropzone";
import Download from "./Download";

function App() {
  const [data, setData] = React.useState<ArrayBuffer>();

  const callback = (buffer: ArrayBuffer) => {
    const convertedbuffer = convert(buffer);
    setData(convertedbuffer);
  };

  let button;

  if (data == null) {
    button = <div />;
  } else {
    const fileName = "testfile.png";
    button = <Download data={data} fileName={fileName} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <Dropzone callback={callback} />
        {button}
      </header>
    </div>
  );
}

export default App;
