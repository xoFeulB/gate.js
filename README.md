# gate.js

## install

```bash
npm link
```

## usage

```bash
gate --index index.html --out ./dist/index.html --depth 10000
```

```bash
Options:
      --version   Show version number                                  [boolean]
  -i, --index     path to index.html                                    [string]
  -o, --out       path to <output>.html       [string] [default: "./index.html"]
  -d, --depth     path to output directory             [number] [default: 10000]
  -r, --root      gate src root                                         [string]
  -p, --prettier  enable prettier                      [boolean] [default: true]
      --help      Show help                                            [boolean]
```

## input

./index.html

```html
<!doctype html>
<html>
  <head>
  </head>

  <body>
    <gate src="./panel/destination.html"></gate>
  </body>
</html>
```

./panel/destination.html

```html
<div>destination</div>
```

## result

```html
<!doctype html>
<html>
  <head>
  </head>

  <body>
    <div>destination</div>
  </body>
</html>
```
