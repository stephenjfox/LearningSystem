from playwright.sync_api import sync_playwright
import os

def test_view_switching():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the app
        file_path = "file://" + os.path.abspath("tracker.html")
        page.goto(file_path)

        # Verify initial view
        dashboard = page.locator("#view-dashboard")
        assert dashboard.is_visible()

        # Switch to Checklist
        page.click("text=Lecture Checklist")
        checklist = page.locator("#view-checklist")
        assert checklist.is_visible()
        assert dashboard.is_hidden()

        # Switch to Walkthrough
        page.click("text=Walkthrough")
        walkthrough = page.locator("#view-walkthrough")
        assert walkthrough.is_visible()
        assert checklist.is_hidden()

        browser.close()

def test_state_persistence():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        file_path = "file://" + os.path.abspath("tracker.html")
        page.goto(file_path)

        # Add a topic
        page.click("topic-mastery-view button:has-text('Add Topic')")
        page.fill("#topic-name", "Persistence Topic")
        page.click("#topic-submit-btn")

        # Reload page
        page.reload()

        # Verify topic still exists
        assert "Persistence Topic" in page.content()

        browser.close()
