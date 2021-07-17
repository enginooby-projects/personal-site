import * as Selectors from './color-selectors.js';
import { StyleRegistry } from './StyleRegistry.js';
import { TinyColor } from './TinyColor.js';
import { StyleRuleStore } from './StyleRuleStore.js';
let $squareImg;
let borderRadius = 9;
export let colorfull1 = new TinyColor("#01724b");
export let colorfull2 = new TinyColor("#bc5b00");
export let colorfull3 = new TinyColor("#c40639");
export let schemeColor = new TinyColor("#D4D4D4");
export let highlightColor = new TinyColor("#004b97");
export let baseColor = 'black';
//TODO: muted base color intensity
const lightMutedBaseColor = "#b2b2b2";
const darkMutedBaseColor = "#4D4D4D";
export let mutedBaseColor = darkMutedBaseColor;
export let currentStyle;
let hoverEventsAreSetup = false;
//populate all style names since we have init css files
let stylesWithUpdatedSchemeColor = ['flat-style', 'neu-style', 'glass-style'];
let stylesWithUpdatedHighlightColor = ['flat-style', 'neu-style', 'glass-style'];
export function changeStyle(newStyle) {
    // currentStyle?.onDisable();
    currentStyle = newStyle;
    $(".customizer").hide();
    currentStyle.onEnable();
    $("body").removeClass();
    $("body").addClass(currentStyle.name);
    updateChangesFromLastStyle();
}
function updateChangesFromLastStyle() {
    if (!stylesWithUpdatedSchemeColor.includes(currentStyle.name)) {
        currentStyle.onSchemeColorUpdated();
        stylesWithUpdatedSchemeColor.push(currentStyle.name);
    }
    if (!stylesWithUpdatedHighlightColor.includes(currentStyle.name)) {
        currentStyle.onHighlightColorUpdated();
        stylesWithUpdatedHighlightColor.push(currentStyle.name);
    }
}
export function init() {
    new StyleRegistry();
    $squareImg = $(".hero-image .square img");
    initSettingPanel();
    setupCustomizeEvents();
    // updateSchemeColor(schemeColor.hex);
    // updateHighlightColor(highlightColor.hex);
}
function initSettingPanel() {
    $("#scheme-color-picker").attr('value', schemeColor.hex);
    $("#highlight-color-picker").attr('value', highlightColor.hex);
    $('#border-radius').attr('value', borderRadius);
    $("#border-radius").next('.range-slider__value').html(borderRadius.toString());
}
function setupCustomizeEvents() {
    $("#color-switcher .pallet-button").on('click', function () {
        $("#color-switcher .color-pallet").toggleClass('show');
        $(this).toggleClass('active');
    });
    $('.theme-skin .pill-button').on('click', event => {
        $('.theme-skin .pill-button').removeClass('active');
        $(event.currentTarget).addClass('active');
    });
    setupColorPickerEvents();
    setupRangeSliderEvents();
}
function setupColorPickerEvents() {
    $("#highlight-color-picker").on('input', function (event) {
        updateHighlightColor(event.target.value);
    });
    $("#scheme-color-picker").on('input', function (event) {
        updateSchemeColor(event.target.value);
    });
    $("#colorfull1-picker").on('input', function (event) {
        colorfull1.setHex(event.target.value);
        updateColorfull(1);
    });
    $("#colorfull2-picker").on('input', function (event) {
        colorfull2.setHex(event.target.value);
        updateColorfull(2);
    });
    $("#colorfull3-picker").on('input', function (event) {
        colorfull3.setHex(event.target.value);
        updateColorfull(3);
    });
}
function setupRangeSliderEvents() {
    $("#border-radius").on('input', (event) => {
        const newValue = event.target.value;
        $("#" + event.target.id).next('.range-slider__value').text(newValue);
        switch (event.target.id) {
            case 'border-radius':
                borderRadius = parseInt(newValue);
                break;
        }
        updateBorder();
    });
}
function updateBorder() {
    $(Selectors.borderRadiusSelectors).css('border-radius', borderRadius);
    $('.background-item').css('border-radius', borderRadius * 6); // since its zoom is 1/6
    StyleRuleStore.Instance.getTrackScrollbarRule().style.setProperty('border-radius', `${borderRadius}px`, 'important');
    StyleRuleStore.Instance.getThumbScrollbarRule().style.setProperty('border-radius', `${borderRadius}px`, 'important');
}
function updateColorfull(colorfullNumber) {
    let colorfull;
    let timelineSelector;
    if (colorfullNumber == 1) {
        colorfull = colorfull1;
        timelineSelector = '#education-timeline';
    }
    if (colorfullNumber == 2) {
        colorfull = colorfull2;
        timelineSelector = '#experience-timeline';
    }
    if (colorfullNumber == 3) {
        colorfull = colorfull3;
        timelineSelector = '#achievements-timeline';
    }
    $(`.colorfull${colorfullNumber}, .background-colorfull${colorfullNumber}>.badge`).css('color', colorfull.hex);
    $(`.background-colorfull${colorfullNumber}`).css('background-color', colorfull.hex);
    $(`.background-colorfull${colorfullNumber}`).css('color', colorfull.getInvertBlackWhite());
    $(`${timelineSelector} .timeline-item`).css('border-left-color', colorfull.hex);
    $(`.badge-pill.background-colorfull${colorfullNumber} .badge`).css('background', colorfull.getInvertBlackWhite());
}
;
function updateHighlightColor(hex) {
    highlightColor.setHex(hex);
    $(Selectors.backgroundHighlightColorSelectors).css("background-color", highlightColor.hex);
    $(Selectors.colorHighlightColorSelectors).css("color", highlightColor.hex);
    StyleRuleStore.Instance.getPagePillingSpanActiveRule().style.setProperty('background-color', highlightColor.hex, 'important');
    setupCommonHoverEvents();
    currentStyle.onHighlightColorUpdated();
    stylesWithUpdatedHighlightColor.length = 0;
    stylesWithUpdatedHighlightColor.push(currentStyle.name);
}
function updateSchemeColor(hex) {
    schemeColor.setHex(hex);
    updateBaseColor();
    updateCommonElements();
    updatePseudoElements();
    setupCommonHoverEvents();
    currentStyle.onSchemeColorUpdated();
    stylesWithUpdatedSchemeColor.length = 0;
    stylesWithUpdatedSchemeColor.push(currentStyle.name);
}
function setupCommonHoverEvents() {
    // lazily setup
    if (hoverEventsAreSetup)
        return;
    hoverEventsAreSetup = true;
    $(".portfolio .portfolio-icon a, .list-inline.socials li a i, #myMenu li a, .social a i,.overlay-menu-toggler").on('mouseenter', (event) => {
        $(event.currentTarget).css('color', highlightColor.hex);
    });
    $(".social a i,.overlay-menu-toggler, .portfolio .portfolio-icon a").on('mouseleave', function () {
        $(this).css('color', baseColor);
    });
    $(".list-inline.socials li a i, #myMenu li a").on('mouseleave', function () {
        $(this).css('color', 'white');
    });
}
function updateCommonElements() {
    $(Selectors.backgroundSchemeColorSelectors).css("background-color", schemeColor.hex);
    $(Selectors.colorBaseColorSelectors).css("color", baseColor);
    $(Selectors.backgroundBaseColorSelectors).css("background-color", baseColor);
    $(Selectors.colorMutedBaseColorSelectors).css("color", mutedBaseColor);
}
function updatePseudoElements() {
    StyleRuleStore.Instance.getThumbScrollbarRule().style.background = schemeColor.hex;
    StyleRuleStore.Instance.getPlaceholderRule().style.color = mutedBaseColor;
    StyleRuleStore.Instance.getPagePillingSpanActiveRule().style.color = baseColor;
}
function updateBaseColor() {
    const lastBaseColor = baseColor;
    baseColor = schemeColor.getInvertBlackWhite();
    if (lastBaseColor != baseColor)
        onBaseColorChanged();
}
function onBaseColorChanged() {
    mutedBaseColor = (baseColor == 'white') ? lightMutedBaseColor : darkMutedBaseColor;
    const heroImg = (baseColor == 'white') ? "light-element_square" : "dark-element_square";
    $squareImg.attr('src', `assets/img/${heroImg}.png`);
    StyleRuleStore.Instance.getPagePillingSpanInactiveRule().style.setProperty('background-color', baseColor, 'important');
    StyleRuleStore.Instance.getPagePillingTooltipRule().style.color = baseColor;
    StyleRuleStore.Instance.getPlaceholderRule().style.color = mutedBaseColor;
    currentStyle.onBaseColorUpdated();
}
