import "./App.css";
import Header from "./Header";

function LicenseAndPrivacy() {
  return (
    <div>
      <Header />
      <div className="License">
        <h2>License</h2>
        <p>This application is licensed under either of</p>
        <ul>
          <li>
            Apache License, Version 2.0 (LICENSE-APACHE or{" "}
            <a href="http://www.apache.org/licenses/LICENSE-2.0">
              http://www.apache.org/licenses/LICENSE-2.0
            </a>
            )
          </li>
          <li>
            MIT license (LICENSE-MIT or{" "}
            <a href="https://opensource.org/licenses/MIT">
              http://opensource.org/licenses/MIT
            </a>
            )
          </li>
        </ul>
        <p>at your option.</p>
        <h2>Dependencies</h2>
        <ul>
          <li>
            Image conversion by{" "}
            <a href="https://crates.io/crates/image">Image</a> licensed under{" "}
            <a href="https://github.com/image-rs/image/blob/master/LICENSE">
              MIT License
            </a>
            . See{" "}
            <a href="https://github.com/davehadley/image-converter/blob/develop/image-converter-rust/Cargo.toml">
              the full list of Rust dependencies
            </a>
            .
          </li>
          <li>
            Icons from <a href="https://tabler-icons.io/">Tabler</a> under the{" "}
            <a href="https://github.com/tabler/tabler-icons/blob/master/LICENSE">
              MIT License
            </a>
            .
          </li>
          <li>
            UI from <a href="https://reactjs.org/">React</a> and others under
            the{" "}
            <a href="https://github.com/facebook/react/blob/main/LICENSE">
              MIT License
            </a>
            . See{" "}
            <a href="https://github.com/davehadley/image-converter/blob/develop/image-converter-react/package.json">
              the full list of UI dependencies
            </a>
            .
          </li>
        </ul>
        <h2>Privacy Statement</h2>
        <p>
          This application runs entirely on your device. No images leave your
          device and no personal information is collected by the developer. This
          site is hosted by Netlify. You may find details of any information
          collected by Netlify in the Netlify{" "}
          <a href="https://www.netlify.com/gdpr-ccpa/">
            GDPR and CCPA statement
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default LicenseAndPrivacy;
