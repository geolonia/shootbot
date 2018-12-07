# shootbot

A command that takes screenshots from the specfic URL for multiple viewports. 

## Install

```
$ npm install -g @tilecloud/shootbot
```

## Usage

```
$ shootbot -h
Usage: shootbot [options] <URL>

Options:
  -V, --version                     output the version number
  -b, --browser <browser>           `chrome` or `firefox`. The default is `chrome`
  -v, --viewports <viewports>       Viewports to take screenshots. e.g, `--viewports 1200,320`.
  -l, --accept-language <language>  The language. The default is `en`.
  -w, --waitfor <seconds>           The number of seconds to wait for saving screenshots. The default is `3,000`.
  -h, --help                        output usage information
```

## Default viewports

* 1200 px
* 992 px
* 768 px
* 576 px

## Examples

Take screenshots for `https://example.com/`. 

```
$ shootbot https://example.com/
```

Take screenshots for `https://example.com/` of viewports `1200` and `320`.

```
$ shootbot https://example.com/ --viewports 1200,320
```
