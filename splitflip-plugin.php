<?php
/**
 * Plugin Name: FW SplitFlip
 * Plugin URI: https://example.com/split-flap-display
 * Description: A WordPress plugin that implements a split-flap display effect using shortcodes.
 * Version: 1.0.0
 * Author: Stephen Walker
 * Author URI: https://flyingw.co
 * Text Domain: fw-flapper
 * License: GPL-2.0+
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Prevent direct access.
}

class SplitFlapDisplay {
    public function __construct() {
        add_shortcode( 'split_flap', [ $this, 'render_split_flap' ] );
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
    }

    public function enqueue_assets() {
        wp_enqueue_style(
            'split-flap-style',
            plugin_dir_url( __FILE__ ) . 'assets/css/fw-flapper.css',
            [],
            '1.1.0'
        );
        // Enqueue the modern vanilla JS (no jQuery dependency).
        wp_enqueue_script(
            'split-flap-script',
            plugin_dir_url( __FILE__ ) . 'assets/js/fw-flapper.js',
            [],
            '1.1.0',
            true
        );
    }

    public function render_split_flap( $atts ) {
        // Define default attributes.
        $atts = shortcode_atts(
            [
                'value'         => '0',
                'values'        => '',  // Semicolon-delimited list of values.
                'width'         => '5',
                'size'          => 'medium',
                'theme'         => 'dark',
                'chars'         => 'numeric',
                'align'         => 'left',
                'padding'       => ' ',
                'speed'         => '2',
                'iterationsMin' => '4',
                'iterationsMax' => '8',
                'cycleDelay'    => '4',
                'loop'          => 'true',
            ],
            $atts,
            'split_flap'
        );

        // Sanitize the attributes.
        $value         = sanitize_text_field( $atts['value'] );
        $values        = sanitize_text_field( $atts['values'] );
        $width         = absint( $atts['width'] );
        $size          = sanitize_key( $atts['size'] );
        $theme         = sanitize_key( $atts['theme'] );
        $chars         = sanitize_key( $atts['chars'] );
        $align         = sanitize_key( $atts['align'] );
        $padding       = sanitize_text_field( $atts['padding'] );
        $speed         = absint( $atts['speed'] );
        $iterationsMin = absint( $atts['iterationsMin'] );
        $iterationsMax = absint( $atts['iterationsMax'] );
        $cycleDelay    = absint( $atts['cycleDelay'] );
        $loop          = sanitize_text_field( $atts['loop'] );

        // Generate a unique container ID.
        $id = 'split-flap-' . wp_rand( 1000, 9999 );

        // Build the container with data attributes.
        // If "values" is provided (non-empty), that takes precedence.
        $html  = '<div id="' . esc_attr( $id ) . '" class="split-flap-display" ';
        $html .= 'data-value="' . esc_attr( $value ) . '" ';
        $html .= 'data-values="' . esc_attr( $values ) . '" ';
        $html .= 'data-width="' . esc_attr( $width ) . '" ';
        $html .= 'data-size="' . esc_attr( $size ) . '" ';
        $html .= 'data-theme="' . esc_attr( $theme ) . '" ';
        $html .= 'data-chars="' . esc_attr( $chars ) . '" ';
        $html .= 'data-align="' . esc_attr( $align ) . '" ';
        $html .= 'data-padding="' . esc_attr( $padding ) . '" ';
        $html .= 'data-loop="' . esc_attr( $loop ) . '" ';
        $html .= 'data-speed="' . esc_attr( $speed ) . '" ';
        $html .= 'data-iterations-min="' . esc_attr( $iterationsMin ) . '" ';
        $html .= 'data-iterations-max="' . esc_attr( $iterationsMax ) . '" ';
        $html .= 'data-cycle-delay="' . esc_attr( $cycleDelay ) . '">';
        $html .= '</div>';

        return $html;
    }
}

new SplitFlapDisplay();