import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function getScratchTokens(username, password) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto("https://scratch.mit.edu/login", { waitUntil: "networkidle2" });

  await page.type("input[name='username']", username);
  await page.type("input[name='password']", password);

  await page.click("button[type='submit']");
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  const cookies = await page.cookies();
  await browser.close();

  const get = name => cookies.find(c => c.name === name)?.value;

  return {
    session: get("scratchsessionsid"),
    csrftoken: get("scratchcsrftoken"),
    xtoken: get("scratchtoken")
  };
}
