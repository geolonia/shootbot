# shootbot

[![Build Status](https://travis-ci.org/tilecloud/shootbot.svg?branch=master)](https://travis-ci.org/tilecloud/shootbot)

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
  -v, --viewports <viewports>       Viewports to take screenshots. e.g, `--viewports 1200x800,320`.
  -l, --accept-language <language>  The language. The default is `en`.
  -w, --waitfor <seconds>           The number of seconds to wait for saving screenshots. The default is `3000`.
  -h, --help                        output usage information
```

## Configuration

You can place configuration file at `~/.shootbot.json` to specify default values for command options.

The defaults are following.

```
{
  viewports: '1200,992,768,576',
  browser: 'chrome',
  acceptLanguage: 'en',
  waitfor: 3000,
}
```

## Examples

Take screenshots for `https://example.com/`.

```
$ shootbot https://example.com/
```

Take screenshots for `https://example.com/` of viewports `1200` and `320`.

```
$ shootbot https://example.com/ --viewports 1200,320
```

You also can specify height of viewport like following.

```
$ shootbot https://example.com/ --viewports 1200x800,320
```

Take screenshots for `https://example.com/` with Firefox.

```
$ shootbot https://example.com/ --viewports 1200,320 --browser firefox
```
