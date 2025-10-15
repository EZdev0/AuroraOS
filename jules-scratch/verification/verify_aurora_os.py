from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:3000")

        # Power On
        page.get_by_role("button", name="Power on AuroraOS").click()

        # Wait for BIOS and navigate
        page.wait_for_selector("text=AuroraBIOS Setup Utility", timeout=15000)
        page.get_by_role("button", name="Exit").click()
        page.get_by_role("button", name="Save & Install AuroraOS").click()

        # Installation and Setup
        page.wait_for_selector("text=Installing AuroraOS", timeout=15000)
        page.wait_for_selector("text=Welcome to AuroraOS", timeout=25000)
        page.get_by_role("button", name="Get Started").click()

        page.wait_for_selector("text=Select Language")
        page.get_by_role("button", name="Continue").click()

        page.wait_for_selector("text=Create your Account")
        page.get_by_label("Username").fill("Jules")
        page.get_by_role("button", name="Create Account").click()

        page.wait_for_selector("text=Finalizing Setup")

        # After restart, back to power on
        page.wait_for_selector("text=AuroraOS", timeout=30000)
        page.get_by_role("button", name="Power on AuroraOS").click()

        # Boot and Login
        page.wait_for_selector("text=Handing over to OS...")
        page.wait_for_selector("text=Jules", timeout=15000)
        page.get_by_role("button", name="Login").click()

        # Desktop
        page.wait_for_selector("text=Explorer", timeout=15000)

        page.screenshot(path="jules-scratch/verification/verification.png")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
