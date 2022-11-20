# Build

To get dependencies:

```
npm install
```

To build the rust wasm library (requires cargo):

```
npm buildwasm
```

# Test

The development server must be running:

```
npm start
```

Then run tests with:

```
npm test
```

# Release

Requires the `netlify` command line tools:

```
npm install netlify-cli -g
```

Build the release package:

```
npm run build
```

Deploy with:

```
netlify deploy
```
