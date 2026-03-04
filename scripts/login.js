import fetch from "node-fetch";

export async function loginScratch(username, password) {
  // 1. CSRFトークン取得
  const csrfReq = await fetch("https://scratch.mit.edu/csrf_token/");
  const csrfCookie = csrfReq.headers.raw()["set-cookie"].find(c => c.startsWith("scratchcsrftoken="));
  const csrfToken = csrfCookie.split("=")[1].split(";")[0];

  // 2. ログイン
  const loginRes = await fetch("https://scratch.mit.edu/accounts/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
      "Cookie": `scratchcsrftoken=${csrfToken};`
    },
    body: JSON.stringify({
      username,
      password,
      useMessages: true
    })
  });

  const loginCookies = loginRes.headers.raw()["set-cookie"];
  if (!loginCookies) throw new Error("ログイン失敗");

  let session = "";
  for (const c of loginCookies) {
    if (c.startsWith("scratchsessionsid=")) {
      session = c.split(";")[0];
    }
  }

  if (!session) throw new Error("sessionid が取得できませんでした");

  // 3. /session を叩いて scratchtoken を取得
  const sessionRes = await fetch("https://scratch.mit.edu/session/", {
    headers: {
      "Cookie": `${session}; scratchcsrftoken=${csrfToken};`
    }
  });

  const sessionCookies = sessionRes.headers.raw()["set-cookie"];
  if (!sessionCookies) throw new Error("session API から Cookie が取得できませんでした");

  let xtoken = "";
  for (const c of sessionCookies) {
    if (c.startsWith("scratchtoken=")) {
      xtoken = c.split(";")[0].split("=")[1];
    }
  }

  if (!xtoken) {
    throw new Error("X-Token（scratchtoken）が取得できませんでした");
  }

  return {
    cookie: `${session}; scratchcsrftoken=${csrfToken}; scratchtoken=${xtoken};`,
    token: csrfToken,
    xtoken
  };
}
