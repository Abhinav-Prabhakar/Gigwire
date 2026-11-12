#!/usr/bin/env python3
"""Capture the screenshots used in README.md. Serve the built out/ folder first."""
from __future__ import annotations

import pathlib

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOCS = ROOT / "screenshots"
DOCS.mkdir(exist_ok=True)
BASE = "http://localhost:4321/Gigwire"


def settle(page) -> None:
    page.evaluate(
        """async () => {
            const step = Math.round(window.innerHeight * 0.7);
            for (let y = 0; y < document.body.scrollHeight; y += step) {
                window.scrollTo(0, y);
                await new Promise((r) => setTimeout(r, 100));
            }
            window.scrollTo(0, 0);
            await new Promise((r) => setTimeout(r, 300));
        }"""
    )
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(400)


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()

        ctx = browser.new_context(viewport={"width": 1440, "height": 960}, device_scale_factor=1)
        page = ctx.new_page()

        shots = [
            ("home", "/", 1080),
            ("gigs", "/gigs/", 1000),
            ("gig", "/gigs/1/", 1000),
            ("rooms", "/rooms/", 1000),
            ("how-it-works", "/how-it-works/", 1000),
            ("signup", "/signup/", 1000),
        ]
        for name, route, height in shots:
            page.set_viewport_size({"width": 1440, "height": height})
            page.goto(BASE + route, wait_until="networkidle")
            settle(page)
            page.screenshot(path=str(DOCS / f"{name}.png"))
            print("wrote screenshots/%s.png" % name)

        # signed-in room desk
        page.set_viewport_size({"width": 1440, "height": 1000})
        page.goto(BASE + "/login/", wait_until="networkidle")
        page.get_by_role("button", name="Rohan Mehta · The Kala Ghoda Room (room)").click()
        page.wait_for_url("**/dashboard/", timeout=10000)
        settle(page)
        page.screenshot(path=str(DOCS / "dashboard.png"))
        print("wrote docs/dashboard.png")

        ctx.close()

        mctx = browser.new_context(
            viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True
        )
        mpage = mctx.new_page()
        for name, route in [("mobile-home", "/"), ("mobile-gigs", "/gigs/"), ("mobile-gig", "/gigs/1/")]:
            mpage.goto(BASE + route, wait_until="networkidle")
            settle(mpage)
            mpage.screenshot(path=str(DOCS / f"{name}.png"))
            print("wrote screenshots/%s.png" % name)
        mctx.close()

        browser.close()


if __name__ == "__main__":
    main()
