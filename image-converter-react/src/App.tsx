import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { add } from "image-converter-rust";

function App() {
  const value = add(1, 1);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>1 + 1 = {value}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
