# firebud
Electron &amp; Cross-browser Devtools Utility

# Installation

## Electron
`npm i firebud`

## Browser
```html
<script src="https://cdn.jsdelivr.net/npm/firebud@latest/firebud.min.js"></script>
```

# Usage

## Simple APIs / Events

```javascript
Firebud.on("open", console.log)
// {
//    "opened": true,
//    "orientation": "vertical"
// }

Firebud.on("close", console.log)
// {
//    "opened": false,
//    "orientation": null
// }
```