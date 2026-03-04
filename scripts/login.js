import fetch from "node-fetch";

export async function loginScratch(username, password) {
  // CSRFトークン取得
  const csrfReq = await fetch("https://scratch.mit.edu/csrf_token/");
  const csrfCookie = csrfReq.headers.raw()["set-cookie"].find(c => c.startsWith("scratchcsrftoken="));
  const csrfToken = csrfCookie.split("=")[1].split(";")[0];

  // ログイン
  const res = await fetch("https://scratch.mit.edu/accounts/login/", {
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

  const cookies = res.headers.raw()["set-cookie"];
  if (!cookies) throw new Error("ログイン失敗");

  let session = "";
  let token = csrfToken;
  let xtoken = "";

  for (const c of cookies) {
    if (c.startsWith("scratchsessionsid=")) {
      session = c.split(";")[0];
    }
    if (c.startsWith("scratchtoken=")) {
      xtoken = c.split(";")[0].split("=")[1];
    }
  }

  if (!xtoken) {
    throw new Error("X-Token が取得できませんでした");
  }

  return {
    cookie: `${session}; scratchcsrftoken=${token}; scratchtoken=${xtoken};`,
    token,
    xtoken
  };
}
