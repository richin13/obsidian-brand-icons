# Brand Icons

Display brand logos and icons inline in your Obsidian notes.

Write `:brand:github.com:` in your note and it renders as an inline icon right next to your text.

## Syntax

```
:brand:github.com:
:brand:spotify.com|logo:
:brand:stripe.com|icon|32:
```

The format is `:brand:domain:` with optional variant and size overrides separated by `|`.

| Part | Required | Description |
|------|----------|-------------|
| domain | Yes | The company's domain, e.g. `github.com` |
| variant | No | `icon`, `logo`, or `symbol` (depends on provider) |
| size | No | Height in pixels, overrides the default |

## Settings

- **Provider** -- which brand icon service to fetch from (default: Brandfetch)
- **Default size** -- icon height in pixels (default: 20)
- **Default variant** -- which logo variant to use when not specified

Each provider may have its own settings. For example, Brandfetch requires a client ID from their [developer portal](https://developers.brandfetch.com/).

## Installation

Copy `main.js`, `manifest.json`, and `styles.css` into your vault at `.obsidian/plugins/brand-icons/`, then enable the plugin in settings.

## Development

```sh
npm install
npm run dev    # watch mode
npm run build  # production build
```
