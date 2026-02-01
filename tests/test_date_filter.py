from playwright.sync_api import sync_playwright, expect
import os
import time

def test_lecture_catalog_date_filter():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        file_path = "file://" + os.path.abspath("tracker.html")
        page.goto(file_path)

        # Switch to Lecture Catalog
        page.click("button:has-text('Lecture Catalog')")

        # Add a lecture with a specific date
        page.click("button:has-text('Add Lecture')")
        page.fill("#lecture-title", "Old Lecture")
        page.fill("#lecture-date", "2025-01-01")
        page.click("#lecture-submit-btn")

        # Add another lecture
        page.click("button:has-text('Add Lecture')")
        page.fill("#lecture-title", "New Lecture")
        page.fill("#lecture-date", "2026-01-01")
        page.click("#lecture-submit-btn")

        # Verify both are present in the catalog
        catalog_list = page.locator("#lecture-list")
        expect(catalog_list.locator("text=Old Lecture")).to_be_visible()
        expect(catalog_list.locator("text=New Lecture")).to_be_visible()

        # Filter by date from 2025-06-01
        page.fill("#lecture-date-from", "2025-06-01")

        expect(catalog_list.locator("text=Old Lecture")).not_to_be_visible()
        expect(catalog_list.locator("text=New Lecture")).to_be_visible()

        # Filter by date to 2025-12-31
        page.fill("#lecture-date-from", "")
        page.fill("#lecture-date-to", "2025-12-31")

        expect(catalog_list.locator("text=Old Lecture")).to_be_visible()
        expect(catalog_list.locator("text=New Lecture")).not_to_be_visible()

        browser.close()

if __name__ == "__main__":
    test_lecture_catalog_date_filter()
