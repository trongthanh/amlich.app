Yes — for Cloudflare Workers, you can use a **JS-based terminal/ANSI formatter**, but for a wttr.in-style app you’ll usually be better off with a **small custom renderer** rather than a full terminal emulator library.

## Best fit for your case

Since you want:

- **ANSI** for `curl`
- **Markdown** for CLI-ish/AI-ish consumers
- **HTML** for browsers

the cleanest setup is:

1. **Generate a structured weather model** in Workers
2. Render that model into:
   - **ANSI text**
   - **Markdown**
   - **HTML**
3. Skip “ANSI rendering” as an intermediate step unless you need to convert existing ANSI art

That said, if you specifically want a JS library for terminal styling, these are the common options.

---

## JS libraries you can use in Workers

### 1) `kleur`
- Very small
- No Node.js dependency
- Great for colors and simple emphasis

Good for:
- ANSI color output
- Lightweight CLI formatting

Not good for:
- Full terminal layout / tables / wrapping

### 2) `picocolors`
- Extremely tiny
- Works well in edge runtimes
- Great for basic ANSI escape sequences

Good for:
- bold, dim, red, green, etc.
- simple output formatting

### 3) `chalk`
- Popular, but heavier
- Works in modern runtimes in many cases, but for Workers I’d still prefer `kleur` or `picocolors`

### 4) `cli-table3`, `table`, `text-table`
- Useful if you want ASCII tables
- Some of these are more Node-oriented; check bundle size and runtime compatibility carefully

### 5) `string-width`, `wrap-ansi`
- Useful helpers for alignment and wrapping
- Helpful if you’re building weather panels with columns

### 6) `ansi-to-html`
- If you decide to author ANSI first and then convert to HTML, this can help
- But in your case I would **not** recommend ANSI as the source of truth

---

## Recommended approach for Cloudflare Workers

### Option A: direct multi-format renderer
Create a canonical weather object like:

```ts
type WeatherView = {
  location: string
  updatedAt: string
  current: {
    temp: number
    feelsLike: number
    desc: string
    wind: string
    humidity: number
  }
  forecast: Array<...>
}
```

Then implement:

- `renderAnsi(view)`
- `renderMarkdown(view)`
- `renderHtml(view)`

This is the best choice for:
- lowest complexity
- best performance
- easiest maintenance in Workers

---

### Option B: ANSI as source + HTML conversion
If you already have ANSI-style formatting logic:
- render ANSI
- for browsers, convert with `ansi-to-html`

I’d only use this if you already have a strong ANSI-based layout engine.

---

## My recommendation for your output split

### For curl
Return:
- `Content-Type: text/plain; charset=utf-8`
- ANSI colors only if terminal detected
- otherwise plain text fallback

### For markdown
Return:
- `Content-Type: text/markdown; charset=utf-8`

Useful for:
- `curl ... | less -R`
- integrations
- bots / LLM tooling
- GitHub-flavored Markdown if you keep it simple

### For browsers
Return:
- `Content-Type: text/html; charset=utf-8`

And render a responsive HTML page from the same weather model.

---

## Edge-runtime friendly helper libraries

If you want small dependencies that are typically friendly to Workers:
- **`picocolors`** for ANSI
- **`string-width`** for alignment
- **`wrap-ansi`** or a simple custom wrapper
- **`marked`** only if you need Markdown → HTML, but for your use-case it’s usually better to render HTML directly

---

## Practical advice
For weather output, don’t use a full terminal emulator package. You don’t need xterm-like emulation; you need:
- colored labels
- aligned columns
- small icons/symbols
- line wrapping

That’s much easier to do with a custom renderer than with an ANSI-processing library.

If you want, I can sketch a **Cloudflare Workers architecture** and give you:
1. a **minimal TypeScript renderer** for ANSI/Markdown/HTML, or
2. a **library shortlist with compatibility notes** for Workers.
