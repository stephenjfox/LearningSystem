import os
from playwright.sync_api import sync_playwright, expect

def test_rendering():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the tracker.html file
        file_path = "file://" + os.path.abspath("tracker.html")
        page.goto(file_path)

        # 1. Verify Dashboard is visible by default
        expect(page.locator("#view-dashboard")).to_be_visible()
        expect(page.locator("h1")).to_have_text("Mastery Optimization Dashboard")

        # 2. Verify View Switching
        page.click("#nav-checklist")
        expect(page.locator("#view-checklist")).to_be_visible()
        expect(page.locator("#view-dashboard")).to_be_hidden()

        page.click("#nav-walkthrough")
        expect(page.locator("#view-walkthrough")).to_be_visible()
        expect(page.get_by_text("The 60-Minute Mastery Sprint")).to_be_visible()

        # Switch back to Dashboard for mobile test
        page.click("#nav-dashboard")
        expect(page.locator("#view-dashboard")).to_be_visible()

        # 3. Verify Mobile Responsiveness (Subject column hidden)
        # Set viewport to mobile size
        page.set_viewport_size({"width": 375, "height": 667})
        subject_header = page.locator("#view-dashboard th:has-text('Subject')")
        expect(subject_header).to_be_hidden()

        # Set viewport to desktop size
        page.set_viewport_size({"width": 1280, "height": 720})
        expect(subject_header).to_be_visible()

        # 4. Verify Global Stats (Initial state)
        expect(page.locator("#mh-value")).to_have_text("0.0")
        expect(page.locator("#ingestion-count")).to_have_text("0 / 0")

        print("All rendering tests passed!")
        browser.close()

if __name__ == "__main__":
    test_rendering()
