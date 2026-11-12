#!/usr/bin/env python3
"""
Generate GIGWIRE brand assets from source vectors.

  python3 scripts/brand-assets.py

Outputs into public/:
  icon-16.png  icon-32.png  icon-48.png  icon-192.png  icon-512.png
  apple-touch-icon.png  favicon.ico  og.png

Requires Playwright (the Homebrew python that owns the `playwright` CLI):

  /opt/homebrew/opt/python@3.13/bin/python3.13 scripts/brand-assets.py
"""

from __future__ import annotations

import pathlib
import struct

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
ICON_SVG = PUBLIC / "icon.svg"
TMP = ROOT / ".brand-tmp"
TMP.mkdir(exist_ok=True)

INK = "#171310"
PAPER = "#f1e4cd"
PAPER_2 = "#fbf2df"
PAPER_3 = "#e7d6b8"
TOMATO = "#e03c24"
MARIGOLD = "#f7ab1e"
BUTTER = "#ffd85e"
MOSS = "#16764f"
COBALT = "#2a3fd6"
BUBBLEGUM = "#ff4d8d"
SKY = "#9fdcea"

SIZES = {
    "icon-16.png": 16,
    "icon-32.png": 32,
    "icon-48.png": 48,
    "icon-192.png": 192,
    "icon-512.png": 512,
    "apple-touch-icon.png": 180,
}


def icon_page(svg: str) -> str:
    return f"""<!doctype html>
<html><head><meta charset="utf-8"><style>
  html,body{{margin:0;padding:0;background:transparent}}
  svg{{display:block}}
</style></head>
<body>{svg}</body></html>"""


def render_icons(browser) -> None:
    svg = ICON_SVG.read_text()
    # Strip fixed width/height so the viewBox scales to the container.
    page = browser.new_page(viewport={"width": 512, "height": 512}, device_scale_factor=1)
    page.set_content(icon_page(svg), wait_until="load")

    for name, size in SIZES.items():
        page.set_viewport_size({"width": size, "height": size})
        page.evaluate(
            """(size) => {
                const svg = document.querySelector('svg');
                svg.setAttribute('width', size);
                svg.setAttribute('height', size);
            }""",
            size,
        )
        page.screenshot(
            path=str(PUBLIC / name),
            clip={"x": 0, "y": 0, "width": size, "height": size},
            omit_background=True,
        )
        print("wrote", name, f"{size}x{size}")

    page.close()


def write_ico() -> None:
    """Build an ICO container holding 16/32/48 PNG frames (PNG-in-ICO)."""
    frames = [(16, PUBLIC / "icon-16.png"), (32, PUBLIC / "icon-32.png"), (48, PUBLIC / "icon-48.png")]
    blobs = [(size, path.read_bytes()) for size, path in frames]

    header = struct.pack("<HHH", 0, 1, len(blobs))
    offset = 6 + 16 * len(blobs)
    entries = b""
    payload = b""
    for size, blob in blobs:
        entries += struct.pack(
            "<BBBBHHII",
            size if size < 256 else 0,
            size if size < 256 else 0,
            0,
            0,
            1,
            32,
            len(blob),
            offset,
        )
        payload += blob
        offset += len(blob)

    (PUBLIC / "favicon.ico").write_bytes(header + entries + payload)
    print("wrote favicon.ico")


def og_html() -> str:
    return f"""<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  *{{box-sizing:border-box;margin:0;padding:0}}
  html,body{{width:1200px;height:630px;overflow:hidden}}
  body{{
    background:{PAPER};
    color:{INK};
    font-family:"Space Grotesk",sans-serif;
    position:relative;
  }}
  .grain{{
    position:absolute;inset:0;pointer-events:none;opacity:.45;mix-blend-mode:multiply;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.32'/%3E%3C/svg%3E");
  }}
  .halftone{{
    position:absolute;inset:0;pointer-events:none;opacity:.5;color:{INK};
    background-image:radial-gradient(currentColor 1.4px, transparent 1.5px);
    background-size:9px 9px;
    -webkit-mask-image:radial-gradient(circle at 90% 8%, #000 0%, transparent 52%);
            mask-image:radial-gradient(circle at 90% 8%, #000 0%, transparent 52%);
  }}
  .frame{{position:absolute;inset:22px;border:4px solid {INK}}}
  .top{{position:absolute;top:44px;left:52px;right:52px;display:flex;justify-content:space-between;align-items:flex-start}}
  .brand{{display:flex;align-items:center;gap:14px}}
  .brand .mark{{width:56px;height:56px;border:4px solid {INK};background:{TOMATO};display:grid;place-items:center}}
  .brand .mark svg{{width:38px;height:38px}}
  .brand .name{{font-family:"Anton",sans-serif;font-size:36px;line-height:.8;letter-spacing:.02em}}
  .brand .sub{{font-family:"Space Mono",monospace;font-size:10px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;margin-top:7px}}
  .tag{{
    font-family:"Space Mono",monospace;font-size:11px;font-weight:700;letter-spacing:.16em;
    text-transform:uppercase;border:3px solid {INK};background:{BUTTER};padding:9px 14px;transform:rotate(2deg);
  }}
  .hero{{position:absolute;left:52px;top:148px;width:640px}}
  .kicker{{
    display:inline-flex;align-items:center;gap:9px;font-family:"Space Mono",monospace;
    font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
    border:3px solid {INK};background:{PAPER_2};padding:7px 12px;
  }}
  .kicker .dot{{width:8px;height:8px;background:{TOMATO};border:2px solid {INK};border-radius:999px}}
  h1{{
    font-family:"Anton",sans-serif;font-weight:400;text-transform:uppercase;
    font-size:88px;line-height:.82;letter-spacing:.005em;margin-top:18px;
  }}
  h1 .accent{{color:{TOMATO}}}
  .lede{{
    margin-top:20px;font-family:"Instrument Serif",serif;font-style:italic;
    font-size:24px;line-height:1.24;max-width:520px;
  }}
  .cities{{position:absolute;left:52px;bottom:74px;display:flex;gap:9px;flex-wrap:wrap;max-width:660px}}
  .city{{
    font-family:"Space Mono",monospace;font-size:11px;font-weight:700;letter-spacing:.08em;
    text-transform:uppercase;border:3px solid {INK};background:{PAPER_2};padding:7px 11px;
  }}
  .city:nth-child(1){{background:{SKY}}}
  .city:nth-child(3){{background:{MARIGOLD}}}
  .city:nth-child(5){{background:{BUBBLEGUM};color:{PAPER_2}}}
  .stamp{{
    position:absolute;right:64px;top:478px;transform:rotate(-6deg);
    border:4px solid {MOSS};color:{MOSS};padding:9px 16px;
    font-family:"Space Mono",monospace;font-size:13px;font-weight:700;
    letter-spacing:.16em;text-transform:uppercase;background:{PAPER};
  }}
  .flyer{{
    position:absolute;right:52px;top:148px;width:352px;
    background:{PAPER_2};border:4px solid {INK};
    box-shadow:13px 13px 0 {INK};
    transform:rotate(2.2deg);
    padding:22px;
  }}
  .flyer .tape{{
    position:absolute;top:-15px;left:118px;width:112px;height:28px;
    background:rgba(255,216,94,.85);border-left:2px solid rgba(23,19,16,.12);
    border-right:2px solid rgba(23,19,16,.12);transform:rotate(-4deg);
  }}
  .flyer .head{{display:flex;justify-content:space-between;align-items:center;gap:8px}}
  .flyer .head .who{{font-family:"Space Mono",monospace;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}}
  .flyer .head .night{{font-family:"Space Mono",monospace;font-size:9px;font-weight:700;border:2px solid {INK};padding:3px 6px;background:{BUTTER}}}
  .flyer h2{{font-family:"Anton",sans-serif;font-size:33px;line-height:.87;text-transform:uppercase;margin-top:13px}}
  .flyer .pay{{
    margin-top:13px;border:3px solid {INK};background:{MOSS};color:{PAPER_2};
    padding:10px 12px;display:flex;flex-direction:column;gap:3px;
  }}
  .flyer .pay b{{font-family:"Anton",sans-serif;font-size:33px;line-height:.82;letter-spacing:.01em}}
  .flyer .pay span{{font-family:"Space Mono",monospace;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}}
  .flyer .row{{
    margin-top:9px;display:flex;justify-content:space-between;align-items:center;gap:8px;
    border-bottom:2px dashed rgba(23,19,16,.3);padding-bottom:6px;
    font-family:"Space Mono",monospace;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
  }}
  .flyer .need{{margin-top:11px;display:flex;gap:6px;flex-wrap:wrap}}
  .flyer .need i{{
    font-style:normal;font-family:"Space Mono",monospace;font-size:9px;font-weight:700;
    letter-spacing:.05em;text-transform:uppercase;border:2px solid {INK};background:{COBALT};
    color:{PAPER_2};padding:4px 6px;
  }}
  .flyer .need i:nth-child(2){{background:{TOMATO}}}
  .footer{{
    position:absolute;left:52px;right:52px;bottom:32px;display:flex;justify-content:space-between;
    align-items:center;font-family:"Space Mono",monospace;font-size:10.5px;font-weight:700;
    letter-spacing:.16em;text-transform:uppercase;
  }}
  .footer .url{{background:{INK};color:{PAPER_2};padding:6px 11px}}
</style></head>
<body>
  <div class="frame"></div>
  <div class="halftone"></div>
  <div class="grain"></div>

  <div class="top">
    <div class="brand">
      <span class="mark">
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path d="M37.5 8.5 17.5 36.5h11.8L26.6 55.5 46.5 27.2H34.8z" fill="{PAPER_2}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>
        </svg>
      </span>
      <div>
        <div class="name">GIGWIRE</div>
        <div class="sub">The gig board</div>
      </div>
    </div>
    <div class="tag">India &middot; live music</div>
  </div>

  <div class="hero">
    <span class="kicker"><span class="dot"></span> No agents. No commission.</span>
    <h1>Somebody&rsquo;s<br>bar needs<br><span class="accent">a band</span> tonight.</h1>
    <p class="lede">Bars and restaurants post the vacancy. Musicians send a one-sheet. Everybody gets paid on the night.</p>
  </div>

  <div class="flyer">
    <span class="tape"></span>
    <div class="head">
      <span class="who">Third Wave Taproom</span>
      <span class="night">SAT</span>
    </div>
    <h2>Bassist for a<br>disco night</h2>
    <div class="pay"><b>&#8377;12,000</b><span>flat &middot; paid on the night</span></div>
    <div class="row"><span>Two 45s</span><span>9:00 &amp; 10:30</span></div>
    <div class="row"><span>Backline</span><span>Yes</span></div>
    <div class="need"><i>Bass</i><i>Horns</i><i>Any level</i></div>
  </div>

  <div class="stamp">Apply in 30 seconds</div>

  <div class="cities">
    <span class="city">Mumbai</span>
    <span class="city">Bengaluru</span>
    <span class="city">New Delhi</span>
    <span class="city">Anjuna</span>
    <span class="city">Pune</span>
    <span class="city">Kolkata</span>
  </div>

  <div class="footer">
    <span>gigs &middot; rooms &middot; one-sheets</span>
    <span class="url">gigwire.in</span>
  </div>
</body></html>"""


def render_og(browser) -> None:
    page = browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
    page.set_content(og_html(), wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(600)
    page.screenshot(path=str(PUBLIC / "og.png"))
    print("wrote og.png 1200x630")
    page.close()


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        render_icons(browser)
        write_ico()
        render_og(browser)
        browser.close()

    for leftover in TMP.glob("*"):
        leftover.unlink()
    TMP.rmdir()
    print("done")


if __name__ == "__main__":
    main()
