# FW SplitFlip Plugin

**FW SplitFlip* is a WordPress plugin that implements a split-flap display effect using a shortcode. The display is built with vanilla JavaScript and CSS and supports multiple configuration options, including multi-line text wrapping. This allows you to show a dynamic, animated display that can cycle through multiple phrases without breaking words.

## Features

- **Shortcode-based Integration:** Easily insert the split-flap display using the `[split_flap]` shortcode.
- **Multi-line Text Wrapping:** Automatically wraps long text into multiple rows based on a maximum tile width.
- **Customizable Options:** Configure text values, layout, and animation parameters including:
  - Single or multiple values (semicolon-delimited)
  - Maximum tile width (which drives word wrapping)
  - Display sizes (small, medium, large)
  - Themes (dark, light)
  - Character sets (numeric, alpha, alphanumeric)
  - Alignment (left or right)
  - Padding character
  - Flip animation speed and flip iterations
  - Cycle delay and looping behavior
- **Smooth Animations:** Uses requestAnimationFrame-based timing and hardware-accelerated CSS transforms for improved performance.

## Installation

1. **Download or clone** the repository.
2. **Copy the plugin folder** (e.g., `fw-flapper-plugin`) into your WordPress `wp-content/plugins/` directory.
3. **Activate the plugin** from your WordPress admin under **Plugins**.
4. **Embed the display** in your posts or pages using the `[split_flap]` shortcode with your desired attributes.

## Usage

Place the shortcode in a WordPress post or page with the available attributes. The plugin supports the following attributes:

- **value**:  
  A single text string to display. _(Default: "0")_
  
- **values**:  
  A semicolon-delimited list of text values. If provided, this takes precedence over **value**.
  
- **width**:  
  Maximum number of tiles per row. Long text is wrapped into new rows as needed. _(Default: 5)_
  
- **size**:  
  Display size. Options: `small`, `medium`, `large`. _(Default: medium)_
  
- **theme**:  
  Color theme. Options: `dark`, `light`. _(Default: dark)_
  
- **chars**:  
  Character set for randomized flips. Options: `numeric`, `alpha`, `alphanumeric`. _(Default: numeric)_
  
- **align**:  
  Text alignment in the digit panels. Options: `left`, `right`. _(Default: left)_
  
- **padding**:  
  Character used for padding if the text is shorter than the width. _(Default: a single space)_
  
- **speed**:  
  Duration (in milliseconds) for each flip cycle. _(Default: 2)_
  
- **iterationsMin**:  
  Minimum number of random flip iterations per digit. _(Default: 4)_
  
- **iterationsMax**:  
  Maximum number of random flip iterations per digit. _(Default: 8)_
  
- **cycleDelay**:  
  Delay (in milliseconds) between cycling values when using multiple values. _(Default: 4)_
  
- **loop**:  
  Whether to cycle through values continuously. Accepts `"true"` or `"false"`. _(Default: true)_

### Example Shortcode

```plaintext
[split_flap 
  value="Traditionally our industry has used Lorem Ipsum, which is placeholder text written in Latin. Unfortunately, not everyone is familiar with Lorem Ipsum and that can lead to confusion." 
  width="30" 
  size="medium" 
  theme="dark" 
  chars="alpha" 
  align="left" 
  padding=" " 
  speed="2" 
  iterationsMin="5" 
  iterationsMax="8" 
  cycleDelay="4" 
  loop="true"
]

## Credits
This plugin builds upon the original Flapper project by Jay Kay Ess, available at:
https://github.com/jayKayEss/Flapper


