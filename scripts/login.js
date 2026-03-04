import fetch from "node-fetch";

export async function loginScratch(username, password) {
  // 1. CSRF token を取得
  const csrfRes = await fetch("https://scratch.mit.edu/csrf_token/");
  const csrfCookie = csrfRes.headers.raw()["set-cookie"].find(c => c.startsWith("scratchcsrftoken="));
  const csrftoken = csrfCookie.split("=")[1].split(";")[0];

  // 2. ログイン
  const loginRes = await fetch("https://scratch.mit.edu/accounts/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
      "X-Requested-With": "XMLHttpRequest",
      "Referer": "https://scratch.mit.edu/",
      "Cookie": `scratchcsrftoken=${csrftoken};`
    },
    body: JSON.stringify({
      username,
      password,
      useMessages: true
    })
  });

  const cookies = loginRes.headers.raw()["set-cookie"];
  const session = cookies.find(c => c.startsWith("scratchsessionsid="))
    .split("=")[1].split(";")[0];

  return { session, csrftoken };
}
