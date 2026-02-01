from playwright.sync_api import sync_playwright
import os

def test_topic_mastery_screenshot():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(f"file://{os.getcwd()}/tracker.html")

        # Add a topic to see the table
        page.evaluate("""() => {
            if (state.blocks.length === 0) {
                state.blocks.push({ id: 'b1', name: 'Block 1', masteryGoal: 10 });
                state.activeBlockId = 'b1';
            }
            const topic = {
                id: Date.now(),
                name: 'Test Topic',
                blockId: state.activeBlockId,
                subject: 'Science',
                passes: [0, 0, 0, 0],
                last_review: null,
                next_review: null,
                interval: 1,
                ease: 2.5
            };
            state.topics.push(topic);
            save();
            render();
        }""")

        page.click('button:has-text("Topic Mastery")')
        page.screenshot(path="verification/topic_mastery_added.png")
        browser.close()

if __name__ == "__main__":
    test_topic_mastery_screenshot()
