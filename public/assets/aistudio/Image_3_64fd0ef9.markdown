---
name: Wallflower Lo-Fi Lounge
colors:
  surface: '#fbf8ff'
  surface-dim: '#dbd9e1'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fb'
  surface-container: '#efecf5'
  surface-container-high: '#eae7ef'
  surface-container-highest: '#e4e1ea'
  on-surface: '#1b1b21'
  on-surface-variant: '#424844'
  inverse-surface: '#303036'
  inverse-on-surface: '#f2eff8'
  outline: '#727974'
  outline-variant: '#c2c8c3'
  surface-tint: '#4a6458'
  primary: '#486156'
  on-primary: '#ffffff'
  primary-container: '#607a6e'
  on-primary-container: '#f5fff8'
  inverse-primary: '#b1cdbe'
  secondary: '#9a442d'
  on-secondary: '#ffffff'
  secondary-container: '#fc9174'
  on-secondary-container: '#742814'
  tertiary: '#4a6156'
  on-tertiary: '#ffffff'
  tertiary-container: '#627a6e'
  on-tertiary-container: '#f5fff8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce9da'
  primary-fixed-dim: '#b1cdbe'
  on-primary-fixed: '#062017'
  on-primary-fixed-variant: '#334c41'
  secondary-fixed: '#ffdbd2'
  secondary-fixed-dim: '#ffb4a1'
  on-secondary-fixed: '#3c0800'
  on-secondary-fixed-variant: '#7c2e19'
  tertiary-fixed: '#cee9da'
  tertiary-fixed-dim: '#b3ccbf'
  on-tertiary-fixed: '#092017'
  on-tertiary-fixed-variant: '#354c41'
  background: '#fbf8ff'
  on-background: '#1b1b21'
  surface-variant: '#e4e1ea'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 34px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 23px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 19px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies a cozy, lo-fi editorial lounge aesthetic crafted specifically for introverts seeking respite, subtle social navigation, and witty solidarity in overwhelming environments. The interface balances the tactile comfort of warm paper ephemera with the modern restraint of an intimate digital sanctuary.

### Personality & Tone
- **Atmospheric & Grounded:** Evoking the calm hush of a corner booth in an indie bookstore café, late-evening ambient lamplight, and linen-bound journals.
- **Witty & Observant:** Sardonic yet compassionate microcopy paired with thoughtful interactions that treat social battery drainage with humor and gentle care.
- **Tactile & Unhurried:** Subtle layered paper weights, warm ink borders, soft micro-interactions, and spacious layouts that actively lower sensory overload.

### Design Movement
**Warm Editorial Minimalism with Tactile Touches.** High-contrast literary typography anchored against soothing oatmeal paper tones, restrained hairline borders, and gentle physical cues that make digital cards feel like pocket notebooks and conversational escape passes.

## Colors

The color palette is calibrated around low sensory fatigue, utilizing natural fiber neutrals and soothing plant pigments accented by a warm ceramic terracotta for spirited focal points.

### Palette Architecture
- **Canvas Base:** Soft oatmeal and warm cream (`#F7F5F0` base canvas; `#EFECE6` elevated paper containers) replace harsh clinical whites, delivering an immediate reduction in screen glare.
- **Ink & Typography:** Deep charcoal ink (`#1E1E24`) provides optimal reading contrast without the jarring edge of pure black. Secondary copy uses a softer ink wash (`#5A585F`).
- **Primary (Calm Action):** Muted sage (`#728D80` primary, with `#8FA89B` tint) represents relief, grounding states, sanctuary prompts, and affirmative calm actions.
- **Secondary (Witty Accents):** Terracotta coral (`#E07A5F`, shading to `#C86147`) acts as the spark—used sparingly for battery level warnings, witty footnotes, interactive delights, and urgent "escape" triggers.
- **Structural Dividers:** Soft warm border tones (`#E2DDD5`) maintain clear spatial boundaries without heavy shadows or aggressive visual division.

## Typography

The type system pairs the literary prestige of **Playfair Display** with the approachable ergonomics of **Plus Jakarta Sans**.

### Roles & Execution
- **Headlines & Display:** Playfair Display delivers an editorial, magazine-spread tone. It turns headings into witty observations and thought-provoking statements rather than dry utility headers. Italics are encouraged for humorous emphasis and introspective remarks.
- **Body & Functional Labels:** Plus Jakarta Sans provides clean, legible, human-centric prose that scales seamlessly across dense lists, interactive tooltips, and state tracking.
- **Hierarchy Rules:** Keep letter-spacing tightened on larger Playfair Display titles to enhance the printed book cover feel. Never use all-caps for Playfair Display; reserve uppercase treatment strictly for `label-sm` category stamps or battery meter status tags in Plus Jakarta Sans.

## Layout & Spacing

Layouts favor an intimate, focused column structure reminiscent of a personal journal or essay layout rather than an overwhelming edge-to-edge dashboard.

### Layout Model
- **Grid Architecture:** 8-column layout for desktop (max-width capped at 1040px to preserve comfortable reading line lengths) and a fluid 4-column layout for mobile viewport configurations.
- **Negative Space Strategy:** Generous canvas margins and intentional breathability prevent sensory crowding. Content blocks never fight for edge boundaries; generous vertical pacing (`space-xl`) isolates interactive topics to sustain user tranquility.
- **Adaptive Reflow:** 
  - **Desktop (≥ 1024px):** Centered reader layout with dedicated side margins for peripheral status (e.g., social battery widget, quick exit triggers).
  - **Tablet (768px – 1023px):** Compact fluid columns, pinning auxiliary actions to contextual drawer trays.
  - **Mobile (< 768px):** Single-column stacked stream with condensed vertical gutters and thumb-friendly interaction anchors.

## Elevation & Depth

Visual hierarchy rejects sharp drop-shadows and synthetic 3D lighting, adopting a tangible **tonal paper layering** approach.

### Surface Strategy
- **Layer 0 (Canvas):** Warm Oatmeal (`#F7F5F0`).
- **Layer 1 (Cards & Modules):** Pressed Linen Cream (`#EFECE6`) defined by a continuous 1px warm structural border (`#E2DDD5`).
- **Layer 2 (Interactive Floating Surfaces / Overlays):** `#FFFFFF` paper stock with an ultra-diffused, ambient drop-shadow tinted with raw umber: `0 4px 20px -2px rgba(30, 30, 36, 0.05), 0 1px 3px 0 rgba(30, 30, 36, 0.03)`.
- **Active Tactile Depress:** When interacting with buttons and selection modules, elements gently press inward with a subtle translate-y shift (1px) and border tone darkening (`#D2CBC1`), mirroring the physical sensation of a vintage stamp or typewriter key.

## Shapes

The geometric form language is rounded and friendly without being childishly bulbous, striking a tailored, handcrafted feel.

### Geometry Hierarchy
- **Standard Cards & Containers:** Medium corner radii (`0.5rem` / `rounded-md`) providing a tidy, stationery-card feel.
- **Outer Shells & Modal Paper Sheets:** Large radii (`1rem` / `rounded-lg`) to soften view boundaries and comfort the eye.
- **Badges, Pills, & Primary CTA Anchors:** Full capsule radius (`9999px`) to emphasize touch-friendliness and dynamic status tagging (e.g., "Social Battery: 24%").

## Components

### Buttons
- **Primary ("Take a Breath"):** Solid muted sage (`#728D80`) with white or deep cream text, styled as a pill button. Hover yields a soothing darkening to `#627B6E`.
- **Secondary / Witty Action ("Emergency Exit / Fake Call"):** Terracotta accent (`#E07A5F`) fill with warm white text; micro-animations feature an eyebrow-raise or gentle pulse.
- **Ghost ("Observe Silently"):** 1px border of `#E2DDD5` over `#EFECE6` background, charcoal ink text, settling into a gentle cream lift on interaction.

### Chips & Badges
- **Status Pills:** Compact capsule shapes with a 1px border. Low battery alerts render in faint terracotta wash with `#C86147` text; calm statuses render in soft sage wash with `#556E62` text.
- **Topic Tags:** Warm cream background, deep charcoal ink, non-intrusive padding (`space-xs` vertical, `space-sm` horizontal).

### Cards
- **Stationery Cards:** Layered `#EFECE6` background with a 1px `#E2DDD5` outline, padded generously with `space-lg`. 
- **Interactive Prompts ("Pocket Excuse Generator"):** Top section crowned with a Playfair Display headline, followed by a subtle 1px dashed divider mimicking a tear-off slip, concluding with quick-copy witty snippets.

### Input Fields
- Understated input panels with `#FFFFFF` or `#F7F5F0` interior, outlined in `#E2DDD5`. 
- Focus transitions softly into a 1.5px `#728D80` border without harsh exterior glow rings. Placeholder copy uses italicized conversational prompts (e.g., *"Quietly type your excuse here..."*).

### Checkboxes & Radios
- Rounded squares (`roundedness: 1`) for checkboxes; soft circles for radios.
- Unchecked state features an oatmeal fill with `#E2DDD5` boundary. Active state fills with sage `#728D80` and reveals an ink-toned cream glyph mark.

### Dedicated Niche Components
- **The Social Battery Barometer:** Segmented lo-fi gauge with smooth organic pill segments stepping down from soft sage to terracotta.
- **"Irish Exit" Speed Dial:** Floating action pill in the lower screen corner allowing one-tap dismissal of active screens into an innocuous "reading article" decoy skin.