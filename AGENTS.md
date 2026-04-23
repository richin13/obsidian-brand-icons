# Obsidian Brand Icons Plugin

Displays brand logos inline in notes using `:brand:domain.com|variant|size:` syntax. Multi-provider architecture so icon services are swappable.

## Obsidian rules (critical)

- Network requests: `requestUrl()` not `fetch()`
- DOM creation: `createEl()` / `createDiv()` / `createSpan()` not `innerHTML`
- Timers: `activeWindow.setTimeout()` not bare `setTimeout()`
- DOM instanceof: `component.instanceOf(T)` not `instanceof` (popout window safety)
- Events: `registerEvent()` / `registerDomEvent()` for automatic cleanup
- CSS: Obsidian CSS variables only (`--font-text-size`, `--text-normal`, etc.), scoped selectors
- UI text: sentence case everywhere ("Advanced settings", not "Advanced Settings")
- Commands: no "command" in name/ID, no plugin name/ID in command ID
- No default hotkeys
- Settings headings: `.setHeading()` only
- No `console.log` in `onload`/`onunload`

## Code conventions

- No comments unless the why is non-obvious
- Strict TypeScript — no `any`, use `instanceof` for TFile/TFolder narrowing
- Prefer `async`/`await` over Promise chains
- Settings fields are provider-driven; don't hardcode provider names in `settings.ts`
- `providerConfig` keys are namespaced: `"brandfetch.clientId"`

## Before touching the editor extension

The CodeMirror integration in `editor-extension.ts` is stateful. Changes there affect both decoration placement and cursor-aware hide/show logic. Read the full file before editing; don't touch the update dispatch loop without understanding `editorLivePreviewField`.
