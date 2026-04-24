import type { Extension } from "@codemirror/state"
import {
  Decoration,
  type DecorationSet,
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
  WidgetType,
} from "@codemirror/view"
import { editorLivePreviewField } from "obsidian"
import { createBrandImg } from "./brand-element"
import type BrandIconPlugin from "./main"
import type { BrandToken } from "./parse"
import { findBrandSpans } from "./parse"

class BrandWidget extends WidgetType {
  constructor(
    private readonly token: BrandToken,
    private readonly plugin: BrandIconPlugin,
  ) {
    super()
  }

  toDOM(): HTMLElement {
    return createBrandImg(activeDocument, this.token, this.plugin.settings)
  }

  eq(other: BrandWidget): boolean {
    return (
      this.token.domain === other.token.domain &&
      this.token.variant === other.token.variant &&
      this.token.size === other.token.size
    )
  }
}

function buildDecorations(
  view: EditorView,
  plugin: BrandIconPlugin,
): DecorationSet {
  const decorations: {
    from: number
    to: number
    decoration: Decoration
  }[] = []

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.sliceDoc(from, to)
    const spans = findBrandSpans(text)

    for (const span of spans) {
      const absFrom = from + span.from
      const absTo = from + span.to

      const cursorHead = view.state.selection.main.head
      if (cursorHead >= absFrom && cursorHead <= absTo) {
        continue
      }

      decorations.push({
        from: absFrom,
        to: absTo,
        decoration: Decoration.replace({
          widget: new BrandWidget(span.token, plugin),
        }),
      })
    }
  }

  return Decoration.set(
    decorations.map((d) => d.decoration.range(d.from, d.to)),
  )
}

export function brandIconExtension(plugin: BrandIconPlugin): Extension {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet

      constructor(view: EditorView) {
        if (view.state.field(editorLivePreviewField)) {
          this.decorations = buildDecorations(view, plugin)
        } else {
          this.decorations = Decoration.none
        }
      }

      update(update: ViewUpdate): void {
        if (!update.view.state.field(editorLivePreviewField)) {
          this.decorations = Decoration.none
          return
        }
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.selectionSet
        ) {
          this.decorations = buildDecorations(update.view, plugin)
        }
      }
    },
    { decorations: (v) => v.decorations },
  )
}
