# firebud
Electron &amp; Cross-browser Devtools Utility

# Installation

## Electron
`npm i firebud`
or
`npm i fieebud --save`

## Browser
`<script type="module" src="https://cdn.jsdelivr.net/npm/elxai@1.2.5/index.js"></script>`
# Usage

## Getting the request

```
// Firebud.on("open", console.log)
{
  "opened": true,
  "orientation": "vertical"
}

// Firebud.on("close", console.log)
{
  "opened": false,
  "orientation": null
}
```