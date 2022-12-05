# Parcel resolver elm bundle

This is a resolver for parcel to make it easier to bundle multiple elm
source files into one.

It does the equivalent of this elm compiler command.

```sh
elm make MainA.elm MainB.elm MainC.elm
```

## Usage

1. Add the resolver to your `.parcelrc` before other resolvers.

```json
{
  "extends": "@parcel/config-default",
  "resolvers": ["parcel-resolver-elm", "..."]
}
```

2. Add a section `elm-bundle` section to your `package.json`, and define
which elm entry points belong to a bundle.

```json
{
  "elm-bundle": {
    "widget-a": [
      "./src/Main.elm",
      "./src/MainB.elm",
      "./src/MainC.elm"
    ]
  }
}
```

3. Reference your defined bundle(s) from your JavaScript. Now, the files `Main.elm`,
`MainB.elm`, `MainC.elm` from the src folder will be compiled into the same output.

```js
import {Elm} from 'elm-bundle:widget-a';
```

## How does it work?

Under the hood The resolver will rewrite this

```js
import {Elm} from 'elm-bundle:widget-a';
```
into this
```js
import {Elm} from './src/Main.elm?with=./MainB.elm&with=./MainC.elm';
```
