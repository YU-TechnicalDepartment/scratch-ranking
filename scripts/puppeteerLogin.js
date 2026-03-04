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

  // Shadow DOM 内の input を取得する関数
  async function queryShadow(selector) {
    return await page.evaluateHandle(sel => {
      const root = document.querySelector("scratch-app")?.shadowRoot;
      if (!root) return null;
      return root.querySelector(sel);
    }, selector);
  }

  // ユーザー名入力
  const userInput = await queryShadow("input[name='username']");
  await userInput.type(username);

  // パスワード入力
  const passInput = await queryShadow("input[name='password']");
  await passInput.type(password);

  // ログインボタン
  const loginBtn = await queryShadow("button[type='submit']");
  await loginBtn.click();

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
