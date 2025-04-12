# FW SplitFlap Plugin

**FW SplitFlap** is a WordPress plugin that implements a split-flap display effect using a shortcode. The display is built with vanilla JavaScript and CSS and supports extensive customization, including multi-line wrapping, randomized flip animations, and custom fonts. It delivers a visually rich, dynamic experience for cycling through text.

---

## ✨ Features

- **Shortcode-based Integration**  
  Easily embed the split-flap display using `[split_flap]` anywhere on your site.

- **Smart Multi-line Wrapping**  
  Automatically wraps long values into multiple rows, preserving word boundaries based on tile width.

- **Highly Configurable Options**  
  Supports:
  - Single static `value` or multi-value cycling via `values` (semicolon-delimited)
  - Tile-based layout with `width`, size (`small`, `medium`, `large`), and alignment
  - Themes (`dark`, `light`) and character sets (`numeric`, `alpha`, `alphanumeric`)
  - Flip animation speed, delay, iterations, and loop control
  - Padding character
  - ✅ **Custom fonts via `font` attribute**

- **Smooth Flip Animations**  
  Hardware-accelerated CSS transforms and async JavaScript create a fast and fluid animation effect.

- **Self-hosted and Privacy-Friendly**  
  All assets are loaded locally. No Google Fonts or external CDNs required.

---

## 🛠 Installation

1. Download or clone the plugin repository.
2. Copy the plugin folder (e.g., `fw-flapper-plugin`) into your WordPress `/wp-content/plugins/` directory.
3. Activate the plugin from the WordPress **Plugins** admin screen.
4. Insert the `[split_flap]` shortcode into your posts, pages, or templates.

---

## ⚙️ Usage

Use the `[split_flap]` shortcode with any of the following attributes:

| Attribute         | Description                                                                 | Default         |
|-------------------|-----------------------------------------------------------------------------|-----------------|
| `value`           | A single value to display.                                                  | `0`             |
| `values`          | A semicolon-delimited list of values to cycle through.                      | *(none)*        |
| `width`           | Number of tiles per row. Long text will wrap accordingly.                   | `5`             |
| `size`            | Display size: `small`, `medium`, `large`.                                   | `medium`        |
| `theme`           | Color theme: `dark`, `light`.                                               | `dark`          |
| `chars`           | Character set for flip animation: `numeric`, `alpha`, `alphanumeric`.       | `numeric`       |
| `align`           | Text alignment: `left`, `right`.                                            | `left`          |
| `padding`         | Character used for padding short values.                                    | (space)         |
| `speed`           | Flip duration in milliseconds.                                              | `2`             |
| `iterationsMin`   | Minimum number of random flips per digit.                                   | `4`             |
| `iterationsMax`   | Maximum number of random flips per digit.                                   | `8`             |
| `cycleDelay`      | Delay between value changes in milliseconds.                                | `4000`          |
| `loop`            | Whether to cycle through values repeatedly: `"true"` or `"false"`.          | `true`          |
| `font`            | Custom font family (e.g., `'Courier New', monospace`).                      | Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace;   |

---

## 📘 Example Shortcode

```plaintext

[split_flap
values=“London; Barcelona; Venice; Moscow”
width=“10”
size=“large”
theme=“light”
chars=“alpha”
align=“left”
padding=” “
speed=“50”
iterationsMin=“8”
iterationsMax=“12”
cycleDelay=“4000”
loop=“true”
font=”din-1451-lt-pro”
]

This shortcode will display a light-themed split-flap with 10 columns, flipping through four cities using a custom font.

---

## 🧩 Notes

- The `values` attribute takes precedence over `value`.
- Word wrapping is automatically applied if text exceeds the given `width`.
- Fonts must be loaded via theme or plugin styles using `@font-face`.
- No remote assets (Google Fonts) are used, making it GDPR/privacy friendly.

---

## 🙌 Credits

This plugin builds upon the original concept and animation principles by [@jayKayEss](https://github.com/jayKayEss/Flapper).

> GitHub: [https://github.com/jayKayEss/Flapper](https://github.com/jayKayEss/Flapper)

---

## 🧪 Development Notes

This plugin is written in modern vanilla JavaScript with zero dependencies (no jQuery). It is ready for future extension into a React-based block or Gutenberg integration.