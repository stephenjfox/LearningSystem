from playwright.sync_api import sync_playwright, expect
import os

def test_goal_button_visibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))

        file_path = "file://" + os.path.abspath("tracker.html")
        page.goto(file_path)

        # Initial check
        expect(page.locator("button:has-text('Set Goal')")).to_have_count(1)

        # Change to "All Blocks (Longitudinal)"
        page.select_option("#block-controls select", "all")

        # Wait for potential re-render
        page.wait_for_timeout(500)

        # "Set Goal" should NOT be present.
        expect(page.locator("button:has-text('Set Goal')")).to_have_count(0)

        browser.close()

if __name__ == "__main__":
    test_goal_button_visibility()
