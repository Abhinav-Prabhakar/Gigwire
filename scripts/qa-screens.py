#!/usr/bin/env python3
"""Screenshot every route for visual QA. Serves the built `out/` folder."""
from __future__ import annotations

import json
import pathlib
import subprocess
import time

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / ".qa"
OUT.mkdir(exist_ok=True)
BASE = "http://localhost:4321/Gigwire"

ROUTES = [
    ("home", "/"),
    ("gigs", "/gigs/"),
    ("gig-detail", "/gigs/1/"),
    ("rooms", "/rooms/"),
    ("how-it-works", "/how-it-works/"),
    ("signup", "/signup/"),
    ("login", "/login/"),
    ("post-gate", "/post/"),
    ("dashboard-gate", "/dashboard/"),
    ("profile-gate", "/profile/"),
]

MOBILE = [("home-mobile", "/"), ("gigs-mobile", "/gigs/"), ("gig-detail-mobile", "/gigs/1/")]


def scroll_through(page) -> None:
    """Walk the page so lazy images load before a full-page screenshot."""
    page.evaluate(
        """async () => {
            const step = Math.round(window.innerHeight * 0.8);
            for (let y = 0; y < document.body.scrollHeight; y += step) {
                window.scrollTo(0, y);
                await new Promise((r) => setTimeout(r, 120));
            }
            window.scrollTo(0, 0);
            await new Promise((r) => setTimeout(r, 250));
        }"""
    )
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(300)


def main() -> None:
    issues: list[str] = []
    with sync_playwright() as p:
        browser = p.chromium.launch()

        ctx = browser.new_context(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
        page = ctx.new_page()
        page.on("console", lambda m: issues.append(f"console[{m.type}] {page.url}: {m.text}") if m.type in ("error",) else None)
        page.on("pageerror", lambda e: issues.append(f"pageerror {page.url}: {e}"))

        for name, route in ROUTES:
            page.goto(BASE + route, wait_until="networkidle")
            scroll_through(page)
            page.screenshot(path=str(OUT / f"{name}.png"), full_page=True)
            print("shot", name)

        # signed-in views: log in through the demo button on /login
        page.goto(BASE + "/login/", wait_until="networkidle")
        page.get_by_role("button", name="Rohan Mehta · The Kala Ghoda Room (room)").click()
        page.wait_for_url("**/dashboard/", timeout=10000)
        page.wait_for_timeout(800)
        page.screenshot(path=str(OUT / "dashboard.png"), full_page=True)
        print("shot dashboard (signed in)")

        page.goto(BASE + "/post/", wait_until="networkidle")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT / "post.png"), full_page=True)
        print("shot post (signed in)")

        page.goto(BASE + "/profile/", wait_until="networkidle")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT / "profile.png"), full_page=True)
        print("shot profile (room)")

        # player view
        page.goto(BASE + "/login/", wait_until="networkidle")
        page.get_by_role("button", name="Ira Sen · neo-soul trio (player)").click()
        page.wait_for_timeout(1200)
        page.goto(BASE + "/profile/", wait_until="networkidle")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT / "profile-player.png"), full_page=True)
        print("shot profile (player)")

        ctx.close()

        mctx = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True)
        mpage = mctx.new_page()
        mpage.on("pageerror", lambda e: issues.append(f"pageerror {mpage.url}: {e}"))
        for name, route in MOBILE:
            mpage.goto(BASE + route, wait_until="networkidle")
            scroll_through(mpage)
            mpage.screenshot(path=str(OUT / f"{name}.png"), full_page=True)
            print("shot", name)
        mctx.close()

        browser.close()

    print(json.dumps({"issues": issues}, indent=2))


if __name__ == "__main__":
    main()
