import fetch from "node-fetch";

async function oldLogin(username, password) {
  // 1. CSRF token を取得
  const csrfRes = await fetch("https://scratch.mit.edu/csrf_token/");
  const csrfCookie = csrfRes.headers.raw()["set-cookie"].find(c => c.startsWith("scratchcsrftoken="));
  const csrfToken = csrfCookie.split("=")[1].split(";")[0];

  // 2. /accounts/login/ に POST
  const loginRes = await fetch("https://scratch.mit.edu/accounts/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
      "X-Requested-With": "XMLHttpRequest",
      "Referer": "https://scratch.mit.edu/",
      "Cookie": `scratchcsrftoken=${csrfToken};`
    },
    body: JSON.stringify({
      username,
      password,
      useMessages: true
    })
  });

  const body = await loginRes.text();
  console.log("レスポンス本文:", body);

  const cookies = loginRes.headers.raw()["set-cookie"];
  console.log("Cookie:", cookies);

  return body;
}

oldLogin("USERNAME", "PASSWORD");
