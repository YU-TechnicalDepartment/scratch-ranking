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

  // Shadow DOM 内の input に直接値を入れる
  await page.evaluate((username, password) => {
    const root = document.querySelector("scratch-app")?.shadowRoot;
    if (!root) throw new Error("shadowRoot が見つからない");

    const userInput = root.querySelector("input[name='username']");
    const passInput = root.querySelector("input[name='password']");
    const loginBtn = root.querySelector("button[type='submit']");

    if (!userInput || !passInput || !loginBtn) {
      throw new Error("ログインフォームが見つからない");
    }

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
