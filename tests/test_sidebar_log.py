from playwright.sync_api import sync_playwright
import os
import time

def test_sidebar_log_button():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the app
        file_path = "file://" + os.path.abspath("tracker.html")
        page.goto(file_path)

        # Wait for components to render
        page.wait_for_selector("topic-mastery-view button:has-text('Add Topic')")

        # Add a topic first so it appears in priority
        page.click("topic-mastery-view button:has-text('Add Topic')")

        # Wait for modal and fill
        page.wait_for_selector("#topic-modal", state="visible")
        page.fill("#topic-name", "Test Sidebar Topic")
        page.fill("#topic-subject", "Test Subject")
        page.click("#topic-submit-btn")

        # Wait for modal to close
        page.wait_for_selector("#topic-modal", state="hidden")

        # Verify it's in the priority sidebar
        page.wait_for_selector("priority-sidebar")
        # Give it a moment to update state and re-render
        time.sleep(0.5)

        priority_sidebar = page.locator("priority-sidebar")
        assert "Test Sidebar Topic" in priority_sidebar.inner_text()

        # Click the LOG button in the sidebar
        log_button = priority_sidebar.locator("button:has-text('LOG')")
        log_button.click()

        # Verify the Log Pass modal is open
        page.wait_for_selector("#pass-modal", state="visible")

        # Verify the topic is correctly selected in the dropdown
        selected_text = page.locator("#pass-topic-id option:checked").inner_text()
        assert "Test Sidebar Topic" in selected_text

        browser.close()
