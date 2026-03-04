import fetch from "node-fetch";

export async function loginScratch(username, password) {
  const csrf = "a"; // 適当でOK

  const res = await fetch("https://scratch.mit.edu/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrf,
      "Cookie": `scratchcsrftoken=${csrf};`
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  const cookies = res.headers.raw()["set-cookie"];
  if (!cookies) throw new Error("ログイン失敗");

  let session = "";
  let token = "";

  for (const c of cookies) {
    if (c.startsWith("scratchsessionsid=")) {
      session = c.split(";")[0];
    }
    if (c.startsWith("scratchcsrftoken=")) {
      token = c.split(";")[0].split("=")[1];
    }
  }

  return {
    cookie: `${session}; scratchcsrftoken=${token};`,
    token
  };
}
