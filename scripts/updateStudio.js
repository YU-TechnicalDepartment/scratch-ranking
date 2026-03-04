import fetch from "node-fetch";

const STUDIO_ID = 51407751;

async function getStudioProjects() {
  const url = `https://api.scratch.mit.edu/studios/${STUDIO_ID}/projects/`;
  const res = await fetch(url);
  return await res.json();
}

export async function clearStudio(cookie, token, xtoken) {
  const list = await getStudioProjects();
  console.log("削除対象作品数:", list.length);

  for (const p of list) {
    const url = `https://api.scratch.mit.edu/studios/${STUDIO_ID}/project/${p.id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": token,
        "X-Token": xtoken,
        "Cookie": cookie,
        "Referer": `https://scratch.mit.edu/studios/${STUDIO_ID}/projects/`
      }
    });

    console.log("DELETE", p.id, "→", res.status);
    if (!res.ok) console.log("DELETE失敗詳細:", await res.text());
  }
}

export async function addProject(cookie, token, xtoken, id) {
  const url = `https://api.scratch.mit.edu/studios/${STUDIO_ID}/project/${id}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "X-CSRFToken": token,
      "X-Token": xtoken,
      "Cookie": cookie,
      "Referer": `https://scratch.mit.edu/studios/${STUDIO_ID}/projects/`
    }
  });

  console.log("PUT", id, "→", res.status);
  if (!res.ok) console.log("PUT失敗詳細:", await res.text());
}
