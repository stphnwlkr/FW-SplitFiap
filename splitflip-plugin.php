<?php
/**
 * Plugin Name: FW SplitFlip
 * Plugin URI: https://example.com/split-flap-display
 * Description: A WordPress plugin that implements a split-flap display effect using shortcodes.
 * Version: 1.0.2
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
    // Normalize all attribute keys to lowercase
    $atts = shortcode_atts(
        [
            'value'         => '0',
            'values'        => '',
            'width'         => '5',
            'size'          => 'medium',
            'theme'         => 'dark',
            'chars'         => 'numeric',
            'align'         => 'left',
            'padding'       => ' ',
            'speed'         => '2',
            'iterationsmin' => '4',
            'iterationsmax' => '8',
            'cycledelay'    => '4000',
            'loop'          => 'true',
            'font'          => '',
        ],
        array_change_key_case( $atts, CASE_LOWER ),
        'split_flap'
    );

    // Sanitize attributes
    $value         = sanitize_text_field( $atts['value'] );
    $values        = sanitize_text_field( $atts['values'] );
    $width         = absint( $atts['width'] );
    $size          = sanitize_key( $atts['size'] );
    $theme         = sanitize_key( $atts['theme'] );
    $chars         = sanitize_key( $atts['chars'] );
    $align         = sanitize_key( $atts['align'] );
    $padding       = sanitize_text_field( $atts['padding'] );
    $loop          = sanitize_text_field( $atts['loop'] );
    $font          = sanitize_text_field( $atts['font'] );

    $speed         = is_numeric( $atts['speed'] )         ? (int) $atts['speed']         : 2;
    $iterationsMin = is_numeric( $atts['iterationsmin'] ) ? (int) $atts['iterationsmin'] : 4;
    $iterationsMax = is_numeric( $atts['iterationsmax'] ) ? (int) $atts['iterationsmax'] : 8;
    $cycleDelay    = is_numeric( $atts['cycledelay'] )    ? (int) $atts['cycledelay']    : 4000;

    // Dynamic replacements
    if ( strpos( $value, '{post:title}' ) !== false ) {
        $value = str_replace( '{post:title}', get_the_title(), $value );
    }

    if ( ! empty( $values ) ) {
        $valuesArray = array_map( function( $v ) {
            return ( strpos( $v, '{post:title}' ) !== false )
                ? str_replace( '{post:title}', get_the_title(), $v )
                : $v;
        }, explode( ';', $values ) );
        $values = implode( ';', $valuesArray );
    }

    // Generate unique ID
    $id = 'split-flap-' . uniqid();

    // Build the container
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
    $html .= 'data-cycle-delay="' . esc_attr( $cycleDelay ) . '" ';
    $html .= 'data-font="' . esc_attr( $font ? $font : '' ) . '"';
    $html .= '>';
    $html .= '</div>';

    return $html;
}
}

new SplitFlapDisplay();