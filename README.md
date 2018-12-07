# shootbot

A command that takes screenshots from the specfic URL for multiple viewports. 

## Install

```
$ npm install -g @tilecloud/shootbot
```

## Usage

```
$ shootbot -h
Usage: shootbot <URL>

Options:
  -V, --version            output the version number
  --viewports <viewports>  Viewports to take screenshots. e.g, `--viewports 1200,320`.
  -h, --help               output usage information
```

## Default viewports

* 1200
* 992
* 768
* 576

## Examples

Take screenshots for `https://example.com/`. 

```
$ shootbot https://example.com/
```

Take screenshots for `https://example.com/` of viewports `1200` and `320`.

```
$ shootbot https://example.com/ --viewports 1200,320
```