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

  // Shadow DOM が出るまで待つ（最大10秒）
  await page.waitForFunction(() => {
    const app = document.querySelector("scratch-app");
    return app && app.shadowRoot;
  }, { timeout: 10000 });

  // Shadow DOM 内のフォームが出るまで待つ
  await page.waitForFunction(() => {
    const root = document.querySelector("scratch-app")?.shadowRoot;
    if (!root) return false;
    return root.querySelector("input[name='username']") &&
           root.querySelector("input[name='password']") &&
           root.querySelector("button[type='submit']");
  }, { timeout: 10000 });

  // Shadow DOM 内でログイン処理
  await page.evaluate((username, password) => {
    const root = document.querySelector("scratch-app").shadowRoot;

    const userInput = root.querySelector("input[name='username']");
    const passInput = root.querySelector("input[name='password']");
    const loginBtn = root.querySelector("button[type='submit']");

    userInput.value = username;
    userInput.dispatchEvent(new Event("input", { bubbles: true }));

    passInput.value = password;
    passInput.dispatchEvent(new Event("input", { bubbles: true }));

    loginBtn.click();
  }, username, password);

  // ログイン完了待ち
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  // Cookie 取得
  const cookies = await page.cookies();
  await browser.close();

  const get = name => cookies.find(c => c.name === name)?.value;

  return {
    session: get("scratchsessionsid"),
    csrftoken: get("scratchcsrftoken"),
    xtoken: get("scratchtoken")
  };
}
