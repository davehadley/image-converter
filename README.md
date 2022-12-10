# Image Converter: An Example React + Rust WASM Single Page Application

This example application demonstrates using
[Rust WASM bindgen](https://rustwasm.github.io/) in a functional
[React](https://reactjs.org/) application. The application allows the user to
convert images between formats supported by the
[Image crate](https://crates.io/crates/image).

See an example of the application running at <https://free-image-converter.davehadley.co.uk/>.

## Build, Test and Run

Install the
[npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and
[cargo](https://rustup.rs/) package managers on your system.

Build the WASM package:

```bash
cd image-converter-react && npm run buildwasm
```

Run the development server with:

```bash
npm start
```

Run the automated tests with (the development server must be running):

```bash
npm test
```

## License

Licensed under either of

- Apache License, Version 2.0
  ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license
  ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.
