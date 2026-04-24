import type { MarkdownPostProcessorContext } from "obsidian"
import { createBrandImg } from "./brand-element"
import { findBrandSpans } from "./parse"
import type { BrandIconSettings } from "./settings"

export function brandIconPostProcessor(
  settings: BrandIconSettings,
): (el: HTMLElement, ctx: MarkdownPostProcessorContext) => void {
  return (el: HTMLElement) => {
    const walker = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT)

    const replacements: {
      node: Text
      fragments: (string | HTMLElement)[]
    }[] = []

    let textNode = walker.nextNode() as Text | null
    while (textNode) {
      const text = textNode.textContent ?? ""
      const spans = findBrandSpans(text)
      if (spans.length > 0) {
        replacements.push({
          node: textNode,
          fragments: buildFragments(text, spans, settings, el.ownerDocument),
        })
      }
      textNode = walker.nextNode() as Text | null
    }

    for (const { node, fragments } of replacements) {
      const parent = node.parentNode
      if (!parent) continue
      const span = el.ownerDocument.createElement("span")
      for (const fragment of fragments) {
        if (typeof fragment === "string") {
          span.appendChild(el.ownerDocument.createTextNode(fragment))
        } else {
          span.appendChild(fragment)
        }
      }
      parent.replaceChild(span, node)
    }
  }
}

type BrandSpan = ReturnType<typeof findBrandSpans>[number]

function buildFragments(
  text: string,
  spans: BrandSpan[],
  settings: BrandIconSettings,
  doc: Document,
): (string | HTMLElement)[] {
  const fragments: (string | HTMLElement)[] = []
  let lastIndex = 0

  for (const span of spans) {
    if (span.from > lastIndex) {
      fragments.push(text.slice(lastIndex, span.from))
    }
    fragments.push(createBrandImg(doc, span.token, settings))
    lastIndex = span.to
  }

  if (lastIndex < text.length) {
    fragments.push(text.slice(lastIndex))
  }

  return fragments
}
