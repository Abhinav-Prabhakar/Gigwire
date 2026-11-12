# GIGWIRE — Design System

> **The one rule:** if a new screen could be mistaken for a SaaS dashboard, it is wrong. GIGWIRE should look like a gig flyer taped to the inside of a bar window: paper, ink, tomato red, marigold, hard edges, and one loud thing per screen.

This document is the source of truth for every colour, type ramp, border, shadow, texture, component and spacing decision in the product. Read it before adding a component. If you need a value that is not here, add a token — do not improvise a one-off hex or a rounded corner.

---

## 1. Concept

| | |
| --- | --- |
| **Metaphor** | A physical pinboard in a venue's back office: flyers, polaroids, tape, rubber stamps, marker underlines. |
| **Audience** | Indian bar, café and taproom bookers; working musicians and session players. |
| **Feeling** | Loud, warm, handmade, trustworthy. A noticeboard, not a marketplace. |
| **Anti-goals** | Glassmorphism, gradients, soft cards, pastel SaaS blue, generic stock icons, corporate stock copy. |
| **Currency of trust** | Numbers up front — pay, set lengths, curfew, capacity. |

### Brand voice

- Short sentences. Concrete nouns. Numbers before adjectives.
- Write like a booker talking to a player: *“Two 45s at 9 and 10:30. ₹12,000 flat. Backline here.”*
- Never use: *listing, employer, candidate, job posting, leverage, seamless, solution, platform*.
- Use instead: *night, flyer, room, player, one-sheet, the board, the pile, load-in, load-out*.
- Sentence case for prose. **UPPERCASE** for labels, chips, stamps, buttons and eyebrows. Serif italic for asides and pull-quotes.
- The em dash is a design element: use it for the turn in a sentence. Do not use it as a decorator.

---

## 2. Colour

All tokens live in `src/app/globals.css` inside `@theme`. Tailwind generates `bg-*`, `text-*`, `border-*` from them.

| Token | Hex | Role | Notes |
| --- | --- | --- | --- |
| `paper` | `#f1e4cd` | Page background | The default canvas. |
| `paper-2` | `#fbf2df` | Cards, forms, light panels | One step lighter than the page. |
| `paper-3` | `#e7d6b8` | Recessed bands, chips, table headers | One step darker. |
| `ink` | `#171310` | Text, borders, dark bands | Never pure black. |
| `ink-soft` | `#463b32` | Secondary copy, meta | 8.65:1 on `paper`. |
| `tomato` | `#e03c24` | Primary action, accents, warnings | The brand red. |
| `marigold` | `#f7ab1e` | Date blocks, highlights, stamps | The festival yellow-orange. |
| `butter` | `#ffd85e` | Tape, stickers, soft highlights | Lighter than marigold. |
| `bubblegum` | `#ff4d8d` | Stickers, playful accents | Use sparingly. |
| `cobalt` | `#2a3fd6` | Links, "need" chips, info | Dark blue, not corporate. |
| `moss` | `#16764f` | Money, success, pay panels | Deep green. |
| `plum` | `#6a2a70` | Gig-detail hero, stat cards | Nightclub purple. |
| `sky` | `#9fdcea` | Perks, info panels, tags | Pale blue. |
| `tangerine` | `#ff7a1a` | Rare accent | Keep for one-off energy. |

### Contrast rules (measured, not vibes)

| Pair | Ratio | Use |
| --- | --- | --- |
| `ink` on `paper` | **14.7** | Body copy — always safe |
| `ink` on `paper-2` | **16.6** | Body copy — always safe |
| `ink-soft` on `paper` | **8.7** | Secondary copy — safe |
| `paper-2` on `ink` | **16.6** | Dark bands — safe |
| `ink` on `marigold` | **9.5** | Date blocks, stamps — safe |
| `ink` on `butter` | **13.4** | Tape, stickers — safe |
| `paper-2` on `cobalt` | **6.8** | Info chips — safe |
| `paper-2` on `moss` | **5.1** | Pay panels — safe |
| `paper-2` on `plum` | **8.7** | Gig hero — safe |
| `ink` on `bubblegum` | **5.9** | Stickers — safe |
| `ink` on `sky` | **12.2** | Perk chips — safe |
| `paper-2` on `tomato` | **3.9** | **Large text only** (≥ 24px, or ≥ 18.66px bold) |
| `ink` on `tomato` | **4.3** | Large text / UI only; not body copy |
| `ink` on `cobalt` | **2.5** | **Never.** Use `paper-2`. |

**Tomato rule:** tomato is a surface for heavy display type, stamps, buttons and accents. Body paragraphs never sit on tomato. If you need small text on tomato, switch to `paper-2` and increase size/weight, or move the copy onto paper.

### Colour allocation per screen

1. **One dominant surface** — paper, ink, plum, cobalt or moss.
2. **One accent** — tomato is the default. Use marigold, bubblegum or cobalt as the second voice.
3. **One money colour** — moss. Pay is always moss on a light surface, or butter on a dark one.
4. Never place two saturated full-bleed bands directly next to each other without a 3–4px ink rule or a paper gap.

---

## 3. Typography

Loaded from Google Fonts in `src/app/layout.tsx`. Declared as Tailwind theme tokens.

| Token | Family | Use |
| --- | --- | --- |
| `font-display` | **Anton** | Headlines, page titles, numbers, pay figures |
| `font-heavy` | **Archivo Black** | Card titles, buttons, stickers, small loud labels |
| `font-serif` | **Instrument Serif** | Italic asides, pull-quotes, captions, ledes |
| `font-mono` | **Space Mono** | Eyebrows, labels, meta, chips, stamps, data |
| `font-body` | **Space Grotesk** | Paragraphs, form values, nav, UI |

### Ramp

| Role | Family | Size | Case | Tracking | Line-height |
| --- | --- | --- | --- | --- | --- |
| Hero display | Anton | `clamp(3.2rem, 11vw, 8.4rem)` | UPPER | `-0.02em` | `0.82` |
| Page hero | Anton | `clamp(2.2rem, 6vw, 4.4rem)` | UPPER | `0.01em` | `0.85` |
| Section title | Anton | `clamp(1.8rem, 4vw, 3rem)` | UPPER | `0.01em` | `0.88` |
| Card title | Archivo Black | `17px` | Sentence | `0` | `1.15` |
| Button | Archivo Black | `13px` | UPPER | `0.08em` | `1` |
| Sticker | Archivo Black | `12–13px` | UPPER | `0.02em` | `1` |
| Body | Space Grotesk | `15–19px` | Sentence | `0` | `1.5–1.7` |
| Serif aside | Instrument Serif italic | `18–21px` | Sentence | `0` | `1.2–1.35` |
| Label | Space Mono bold | `10px` | UPPER | `0.18em` | `1.2` |
| Meta | Space Mono bold | `10–11px` | UPPER | `0.1–0.16em` | `1.3` |
| Eyebrow | Space Mono bold | `11px` | UPPER | `0.28em` | `1` |

### Type rules

- **Anton is always uppercase** and always tight (`leading < 1`). Never use Anton for body copy or long labels.
- **Archivo Black is the small-loud voice.** Use it for card titles, buttons, sticker text and 12–14px labels. It is never used for paragraphs.
- **Instrument Serif is only italic.** It carries the human aside: a caption, a quote, a one-line lede. Never use it for UI labels.
- **Space Mono is the data voice.** All meta, pay units, dates, statuses and form labels. Always bold, always uppercase, always tracked.
- **Space Grotesk is the reading voice.** 15px minimum for UI copy, 17–19px for hero ledes.
- Use `text-ink-soft` for secondary copy, never grey. There is no grey token.
- Do not centre long paragraphs. Centre only short pull-quotes, empty states and the footer.
- Headline line breaks are intentional. Use `<br />` to control the break at desktop; let it wrap on mobile.
- The outline treatment (`.stroke-text`) is reserved for one word in a hero — usually *tonight*. Never outline a whole heading.

---

## 4. Layout & spacing

### The grid

| Thing | Value |
| --- | --- |
| Base unit | `4px` (Tailwind default scale) |
| Container | `max-w-[1240px]` |
| Page gutter | `16px` mobile · `32px` from `md` |
| Section vertical rhythm | `48px` mobile · `56–64px` desktop |
| Hero vertical rhythm | `pt-12 pb-16` mobile · `lg:pt-20 lg:pb-24` |
| Grid gap | `20–32px` (`gap-5` / `gap-8`) |
| Card inner padding | `14–20px` (`p-3.5` / `p-5`) |
| Form field gap | `16px` (`space-y-4`) |
| Sticky rail offset | `lg:top-24` |

### Spacing scale in practice

| Token | px | Where |
| --- | --- | --- |
| `1` | 4 | icon gaps, chip internals |
| `1.5` | 6 | chip groups, inline meta |
| `2` | 8 | small stacks |
| `2.5` | 10 | card padding, footer strips |
| `3` | 12 | button gaps, tight stacks |
| `3.5` | 14 | card padding |
| `4` | 16 | form stacks, panel padding |
| `5` | 20 | card padding, rail spacing |
| `6` | 24 | grid gaps |
| `8` | 32 | column gaps, section inner |
| `10` | 40 | hero element spacing |
| `12` | 48 | section padding |
| `14` | 56 | large section padding |
| `16` | 64 | hero bottom |
| `20` | 80 | desktop hero top |
| `24` | 96 | desktop hero bottom |

### Page archetypes

| Page | Layout |
| --- | --- |
| Home | Full-bleed collage hero → marquee → alternating paper/ink/cobalt sections → CTA slab → footer |
| Gig board | Dark title band → `lg:grid-cols-[290px_1fr]` filter + results |
| Gig detail | Plum hero → `lg:grid-cols-[1fr_380px]` flyer + sticky apply rail |
| Rooms | Orange halftone hero → marquee → `md:grid-cols-2` venue cards |
| Dashboard | Ink hero with stat strip → `lg:grid-cols-[1.15fr_0.85fr]` nights + pile |
| Profile | Cobalt hero → `lg:grid-cols-[1fr_380px]` tracker + edit form |
| Post | Moss hero → `lg:grid-cols-[1fr_400px]` form + live preview |
| Auth | Split hero/copy + form card, `lg:grid-cols-[1.05fr_0.95fr]` |

### Breakpoints

`sm 640` · `md 768` · `lg 1024` · `xl 1280`.

- `lg` is the real layout switch: nav becomes inline, sidebars become sticky, the mobile filter collapses.
- `sm` is where stickers, save buttons and some meta appear.
- Never design a layout that only works at exactly 1440px. Test 390, 768, 1024, 1440.

### Alignment rules

- Left-align almost everything. Centre only: empty states, auth gates, footer credit, short pull-quotes.
- Numbers and pay align on the baseline, not the top.
- Date blocks are always left of the title, never above it.
- Meta rows use `flex flex-wrap items-center gap-x-3 gap-y-1`.
- Section headings use `.max-w-3xl` so the line length stays readable.
- Sticky rails: `lg:sticky lg:top-24 lg:self-start` — always add `self-start` or the rail stretches.

---

## 5. Surface, border, shadow, shape

### Borders

| Width | Use |
| --- | --- |
| `2px` | Chips, tape edges, inner image frames, meta separators |
| `3px` | **The default** — cards, buttons, fields, panels, stickers |
| `4px` | Section rules, hero dividers, thick accents |
| `border-dashed` | Stamps, non-negotiables, form-as-paper, empty states |
| `border-dotted` | Almost never; prefer dashed |

**Every interactive surface has an ink border.** There are no borderless cards.

### Hard shadows

| Class | Offset | Use |
| --- | --- | --- |
| `.shadow-hard-sm` | `3px 3px 0 ink` | Small buttons, mini cards |
| `.shadow-hard` | `5px 5px 0 ink` | Default cards, forms, panels |
| `.shadow-hard-lg` | `9px 9px 0 ink` | Polaroids, hero cards, modals |
| `.shadow-hard-color` | `6px 6px 0 tomato` | Rare emphasis |

Shadows are **always hard-edged and offset down-right**. No blur, no spread, no coloured glow.

### Radii

- **Default: `0`.** Cards, buttons, fields, chips, images are square.
- The only rounded things are the decorative blobs (`.blob-cut`, `.soft-cut`) and circular badges/spinners.
- Never round a card to look friendly. The squareness is the identity.

### Textures

| Class | What it does | Where |
| --- | --- | --- |
| `.paper-grain` | SVG fractal noise, multiply, 50% | Body, cards, forms |
| `.halftone` | 1.1px dots on a 7px grid | Hero bands, overlays |
| `.halftone-lg` | 2px dots on a 14px grid | Decorative circles |
| `.grid-lines` | 1px ink grid, 28px | Hero background |
| `.ruled` | Blue rule every 28px | Login form, "non-negotiables" |
| `.stripes` | 45° ink stripes | Rare warning texture |

Textures are **multiply overlays**, never full-opacity patterns. If text sits on a texture, the texture must be behind the text layer and low-contrast.

### Paper bits

| Element | Spec |
| --- | --- |
| `.tape` | 116×30px butter strip, dashed side edges, multiply, rotated −3° to 2° |
| `.sticker` | 3px ink border, heavy uppercase, `3px 3px 0 ink`, rotated −8° to 6° |
| `.torn` / `.torn-x` | Clip-path torn paper edge for section transitions |
| `.underline-hand` | 6px wavy tomato underline, 8px offset |
| `.stroke-text` | 2px ink outline, transparent fill |

Tape always sits at the top edge of a polaroid or form, centred or slightly off-centre. Stickers always overlap an edge — never float in the middle of empty space.

---

## 6. Components

### Buttons — `.btn`

```
.btn                  inline-flex, 3px ink border, 20px/12px padding,
                      Archivo Black 13px uppercase, tracking .08em,
                      3px hard shadow, active:translate-y-[2px]
.btn-ink              ink surface, paper text; hover plum
.btn-tomato           tomato surface, paper text; hover #c22c17
.btn-marigold         marigold surface, ink text; hover butter
.btn-ghost            transparent, ink text; hover ink/paper
```

- **Sizes:** default is the size. Override with `!px-7 !py-4 !text-[15px]` for hero CTAs, `!py-2` for header CTAs, `!py-3.5` for form submits.
- **Icons:** 16–20px, always after or before the label with `gap-2`. Never icon-only unless it is the bookmark.
- **Full width:** `w-full` on mobile forms and rails.
- **Disabled:** `disabled:opacity-60`, no colour change.
- **Never** use a text link styled as a button, or a button without an ink border.

### Chips — `<Chip tone>`

| Tone | Surface | Text | Use |
| --- | --- | --- | --- |
| `default` | `paper-3` | ink | Genres, cities, neutral tags |
| `ink` | `ink` | paper | Status, filters, "need" meta |
| `moss` | `moss` | paper | Pay, success, open |
| `cobalt` | `cobalt` | paper | Lineup needs, links, info |
| `tomato` | `tomato` | paper | Genres on a flyer, warnings |

Spec: 2px ink border, `px-2 py-[3px]`, Space Mono 10px bold uppercase, tracking `.1em`. Icons inside are 12px.

### Fields — `.field` + `.label`

- `.field`: 3px ink border, `paper-2` background, 15px semibold, `px-3 py-2.5`, no radius.
- Focus: `4px 4px 0 cobalt` shadow and white background. This is the only focus treatment.
- `.label`: Space Mono 10px bold uppercase, tracking `.18em`, `ink-soft`, `mb-1.5`.
- Textareas: `rows={4}`, `resize-y`.
- Selects use the same field class; keep the native arrow.
- Group related fields in a `.space-y-4` stack. Two-up fields use `grid grid-cols-2 gap-3`.
- Never use placeholder as the only label. Placeholders are examples, not labels.

### Cards

Base: `.card` = 3px ink border, `paper-2`, `5px 5px 0 ink`.

Variants:

- **Gig card** — see anatomy below.
- **Form card** — `.paper-grain border-[3px] border-ink bg-paper-2 p-5 shadow-hard`.
- **Dark card** — `border-[3px] border-ink bg-ink p-5 text-paper-2`.
- **Colour card** — `border-[3px] border-ink bg-{sky|butter|moss|plum} p-4`.
- **Polaroid** — 3px border, 10px padding, image with 2px inner border, caption below in serif italic, `9px 9px 0 ink`, rotated.
- **Empty state** — `.card` with centred icon, heavy title, 15px body, one button.

### Gig card anatomy

```
┌──────────────────────────────────────────┐
│ [DATE]  VENUE NAME            [STICKER]  │  header: paper-3/70, border-b-3
│         Gig title (heavy 17px)           │
│         📍 city, state   🕘 9:00 – 12:30 │
├──────────────────────────────────────────┤
│ [genre] [genre] [need]                   │  body: p-3.5, flex-col gap-3
│ Two-line description…                    │
│ ✦ Backline provided  ✦ Meal on arrival   │
├──────────────────────────────────────────┤
│ ₹18,000  flat · 3 sets       👥 2   [🔖] │  footer: paper-3/80, border-t-3
└──────────────────────────────────────────┘
```

- Date block is `w-[74px]`, marigold by default.
- The relative sticker (`IN 3 DAYS`) is **absolute** at `-top-5 -right-3`; it must not consume layout width.
- Title is a link with `after:absolute after:inset-0` so the whole card is clickable.
- The bookmark sits in a 36px square button with `relative z-20` so it stays clickable above the title link.
- The card always declares `text-ink` on its own light surface — it is dropped onto dark cobalt/ink bands, and inherited `text-paper-2` would make the title and date block invisible.
- Pay amount is `font-display text-[22px] text-moss`; the unit label is mono 9.5px and `whitespace-nowrap`. It never repeats the amount suffix: `flat · 3 sets`, `hourly · 2 sets`, `4 sets`.
- Cards lift on hover: `hover:-translate-y-1 hover:shadow-hard-lg`, 200ms.
- Featured cards on the home cobalt band rotate at `md:` only; below that they stay square so they never clip the viewport.

### Date block — `<DateBlock>`

`74px` wide, 3px ink border, marigold (or paper-3/sky), weekday + day + month stacked. Weekday/month are mono 10px tracked; the day is Anton 30px. Used on cards, dashboard nights and the gig hero.

### Sticker — `<Sticker>`

`sticker` class + a colour pair + a rotation. Used for relative dates, "3 open nights", "weekly gig", "2 total". Always overlaps a card edge. Never use it for navigation or actions.

### Stamp — `<Stamp>`

Dashed 3px border in `currentColor`, mono 10px bold uppercase, tracking `.2em`, `px-3 py-1`. Used for form numbers, statuses, "paid on the night", "form 12-B". Stamps are decorative labels, not buttons.

### Eyebrow — `<Eyebrow>`

Mono 11px bold uppercase, tracking `.28em`, with a 10px tomato diamond. Always the first line of a section or hero. On dark surfaces use `!text-marigold` or `!text-butter`.

### Section heading — `<SectionHeading>`

Kicker + Anton `clamp(2.4rem,6.5vw,4.6rem)` + optional 17px intro. Max width `3xl`. Use it for marketing sections, not for dashboard panels.

### Header

- Ticker bar: ink, 11px mono, marquee.
- Sticky bar: `paper-2/95` with backdrop blur, 3px bottom border.
- Logo: 36px tomato square with bolt, wordmark in Anton with tomato "WIRE".
- Desktop nav: mono 11px uppercase, hover butter block with ink border.
- Mobile nav: horizontal scroll row of 2px-bordered chips. Never wrap it into multiple rows.
- Auth state: sky chip with a moss dot + name; "Sign out" ghost button.

### Footer

Ink band, 4px top border, marquee strip above it. Columns: brand + blurb + city chips, then two link columns. All links are paper-2 with marigold hover. Bottom line is mono 9px uppercase.

### Apply rail

Right-hand sticky column on gig detail. Order: apply card → save strip → pledge card. On mobile it becomes a normal stacked section after the flyer. The primary CTA is tomato; secondary is ghost.

### Gates & empty states

Auth gates use a centred `.card` with tape, Anton title, 16px body and two buttons. Empty states use a card with a 28px icon, heavy title, 15px body and one CTA. Never leave a blank panel.

### Icons

24×24 viewBox, 1.9px stroke, round caps and joins, `currentColor`, no fill except `IconBookmark` when saved. Sizes: 12, 14, 16, 20, 24px. Never mix icon families.

---

## 7. Motion

| Motion | Spec |
| --- | --- |
| Hover lift | `transform 160ms cubic-bezier(0.2,0.8,0.3,1)`, `translate(-3px,-3px)` + `shadow-hard-lg` |
| Card hover | `hover:-translate-y-1 hover:shadow-hard-lg`, 200ms |
| Button press | `active:translate-y-[2px]` (kills the shadow offset) |
| Marquee | `34s linear infinite`, `58s` for slow |
| Spin badge | `18s linear infinite` |
| Jitter | `0.35s ease-in-out 2` on hover, for stickers only |
| Page scroll | `scroll-behavior: smooth` |

Rules:

- Animate **position and shadow only**. Never animate colour gradients.
- Nothing loops faster than 18s except the marquee.
- Motion is feedback, not decoration. If it does not clarify a state change, remove it.
- `prefers-reduced-motion: reduce` disables marquee, spin, jitter and transitions.

---

## 8. Content & data conventions

### Money

- Always `₹` with Indian digit grouping: `₹18,000`, `₹2,500`, `₹1,20,000`.
- Use `formatPay(amount, unit)` → `₹18,000 flat`, `₹2,500/hr`, `₹10,000/set`.
- Use `formatPayShort()` only in tight stats: `₹8k`, `₹1.4L`, `₹1.2Cr`.
- The pay number is never hidden behind "competitive" or "negotiable". If a room will not state it, the flyer is not ready.

### Dates & time

- Dates are ISO `YYYY-MM-DD` in data, anchored to `NEXT_PUBLIC_BUILD_DAY`.
- Display: `SUN / 15 / NOV` in date blocks; `Sun, 15 Nov` in prose; `9:00 PM – 12:30 AM` in meta.
- Relative labels: `TONIGHT`, `TOMORROW`, `IN 3 DAYS`, `NEXT WEEK`, `IN 2 WEEKS`, `PASSED`.
- Never show a year in a card. The board is always about the next fortnight.

### Places

`Mumbai, MH` · `Bengaluru, KA` · `New Delhi, DL` · `Anjuna, GA` · `Pune, MH` · `Kolkata, WB`.

Use `Bengaluru`, not Bangalore, in UI copy. `New Delhi` is the city label; `Delhi` is fine in prose.

### Vocabulary

| Use | Not |
| --- | --- |
| gig, night, slot | job, posting, listing |
| room, venue | employer, client |
| player, musician, act | candidate, applicant (in UI) |
| one-sheet | résumé, CV, profile |
| flyer | ad, campaign |
| the board | the marketplace |
| the pile | the inbox |
| paid on the night | competitive compensation |

### Genres & lineup

Genres: Bollywood, Sufi / Qawwali, Ghazal, Carnatic, Hindustani, Jazz, Blues, Soul / Funk, Folk / Acoustic, Rock / Indie, Pop / Cover, Hip-Hop / R&B, EDM / House, DJ Set, Latin, Gospel / Choir, Karaoke Host.

Lineup: Solo act, Duo, Trio, 4-piece band, 5+ piece band, Horns, Singer, Pianist / Keys, Guitarist, Bassist, Drummer, Percussion, DJ, Opening act, Backing vocals.

### Statuses

`open` (moss) · `interviewing` (cobalt) · `filled` (ink) · `closed` (ink) · `pending` · `viewed` · `accepted` · `declined` · `withdrawn`.

---

## 9. Accessibility

- **Skip link** is the first focusable element: `sr-only` until focused, then a marigold block at top-left.
- **Focus**: fields get the cobalt hard shadow. Links/buttons rely on the browser outline plus their own hover; do not remove outlines globally.
- **Hit targets**: minimum 36×36px for icon buttons, 44px for primary mobile actions.
- **Labels**: every input has a `<label>` or an `aria-label`. Icon-only buttons have `title` and `aria-label`.
- **State**: the bookmark uses `aria-pressed`; nav toggles use `aria-expanded`.
- **Decoration**: every texture, blob, tape, sticker and icon that carries no meaning is `aria-hidden`.
- **Contrast**: follow the table in §2. Tomato is large-text only.
- **Motion**: honour `prefers-reduced-motion`.
- **Images**: decorative images use `alt=""`; meaningful images get a short noun phrase.
- **Language**: `lang="en"` on the document, `en-IN` in metadata and manifest.

---

## 10. Responsive behaviour

| Element | Mobile | Desktop |
| --- | --- | --- |
| Header nav | horizontal scroll chips, no wrap | inline links |
| Hero collage | stacked; photos below copy | absolute polaroid collage |
| Gig filters | collapsed behind a **Filters** button | 290px sticky rail |
| Gig grid | 1 column | 2 at `md`, 3 at `xl` |
| Gig detail | single column, rail after flyer | 2 columns, sticky rail |
| Dashboard | stacked nights → pile | 2 columns |
| Section padding | 48px | 56–64px |
| Headline | `clamp()` handles it | intentional `<br />` |
| Decorative blobs | hide the ones that sit behind body copy | show all |

**Rule:** if a decorative element reduces text contrast on mobile, hide it on mobile. Never let decoration win over reading.

---

## 11. Page recipe

A new marketing page should look like this:

```tsx
<div>
  {/* 1. Full-bleed hero band */}
  <section className="relative border-b-[4px] border-ink bg-plum px-4 py-12 text-paper-2 md:px-8">
    <div aria-hidden className="absolute inset-0 halftone text-ink opacity-25" />
    <div className="relative mx-auto max-w-[1240px]">
      <Eyebrow className="!text-butter">Section name</Eyebrow>
      <h1 className="mt-3 text-[clamp(2.2rem,6vw,4.4rem)] uppercase leading-[0.85]">
        A loud, short title
      </h1>
      <p className="mt-3 max-w-xl font-serif text-[19px] italic text-paper-3">
        One human sentence about why this page exists.
      </p>
    </div>
  </section>

  {/* 2. Content on paper */}
  <div className="mx-auto max-w-[1240px] px-4 py-12 md:px-8">
    <SectionHeading kicker="Kicker" title="Section title" intro="Two lines max." />
    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {/* cards */}
    </div>
  </div>

  {/* 3. One dark or coloured CTA slab */}
  <section className="border-t-[4px] border-ink bg-ink px-4 py-14 text-paper-2 md:px-8">
    <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6">
      <h2 className="text-[clamp(1.8rem,4vw,3rem)] uppercase">Put it on the wire</h2>
      <Link href="/gigs" className="btn btn-marigold">Find a gig</Link>
    </div>
  </section>
</div>
```

Hero band colour rotation: plum, cobalt, moss, ink, marigold. Do not use the same band colour twice on one page.

---

## 12. Checklist for a new component

- [ ] Uses an existing colour token — no new hex.
- [ ] 3px ink border (or 2px for chips/inner frames).
- [ ] Square corners.
- [ ] Hard shadow, not blur.
- [ ] Anton for display, Archivo Black for loud small, Space Mono for meta, Space Grotesk for body.
- [ ] Uppercase label tracking is between `.1em` and `.28em`.
- [ ] Works at 390px without horizontal scroll.
- [ ] Text contrast passes the table in §2.
- [ ] Focus state is visible (cobalt shadow or browser outline).
- [ ] Decorative elements are `aria-hidden`.
- [ ] Hover/press states exist and are 160–200ms.
- [ ] No gradients, no glass, no rounded cards, no grey text.
- [ ] Copy uses the vocabulary in §8.

---

## 13. Do / Don't

| Do | Don't |
| --- | --- |
| Put the number on the flyer | Hide pay behind "competitive" |
| Use one loud colour per band | Stack three saturated bands |
| Let type be huge and tight | Use 14px headings |
| Rotate a sticker 3–8° | Rotate every element |
| Use a hard 5px shadow | Use a soft blurred shadow |
| Use `paper-3` for a recessed panel | Use grey |
| Write "Saturday night cover band" | Write "Senior Music Executive" |
| Use the serif italic for a human aside | Use it for buttons |
| Keep the mobile filter collapsed | Force a 12-field form above results |
| Show a date block | Show a plain "15/11/2026" string |
| Let the collage overlap | Let text be covered by the collage |

---

## 14. Quick reference

```
COLOURS   paper #f1e4cd · paper-2 #fbf2df · paper-3 #e7d6b8
          ink #171310 · ink-soft #463b32
          tomato #e03c24 · marigold #f7ab1e · butter #ffd85e
          bubblegum #ff4d8d · cobalt #2a3fd6 · moss #16764f
          plum #6a2a70 · sky #9fdcea · tangerine #ff7a1a

TYPE      Anton · Archivo Black · Instrument Serif · Space Grotesk · Space Mono

BORDER    3px ink (default) · 2px (chips) · 4px (section rules)
SHADOW    3 / 5 / 9px hard ink offset
RADIUS    0 (except decorative blobs)
CONTAINER 1240px · gutter 16/32px
MOTION    160–200ms · cubic-bezier(.2,.8,.3,1)
```

---

<p align="center"><sub>GIGWIRE design system · v1.0 · keep the board loud.</sub></p>
