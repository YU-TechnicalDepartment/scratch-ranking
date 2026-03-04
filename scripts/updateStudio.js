import fetch from "node-fetch";

const STUDIO_ID = 51407751;

// スタジオ内の作品一覧を取得
async function getStudioProjects() {
  const url = `https://api.scratch.mit.edu/studios/${STUDIO_ID}/projects/`;
  const res = await fetch(url);

  if (!res.ok) {
    console.log("スタジオ作品一覧取得失敗:", res.status, await res.text());
    return [];
  }

  return await res.json();
}

// スタジオから作品を削除
export async function clearStudio(cookie, token) {
  const list = await getStudioProjects();

  console.log("削除対象作品数:", list.length);

  for (const p of list) {
    const url = `https://api.scratch.mit.edu/studios/${STUDIO_ID}/project/${p.id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": token,
        "Cookie": cookie,
        "Referer": `https://scratch.mit.edu/studios/${STUDIO_ID}/projects/`
      }
    });

    console.log("DELETE", p.id, "→", res.status);

    if (!res.ok) {
      console.log("DELETE失敗詳細:", await res.text());
    }
  }
}

// スタジオに作品を追加
export async function addProject(cookie, token, id) {
  const url = `https://api.scratch.mit.edu/studios/${STUDIO_ID}/project/${id}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "X-CSRFToken": token,
      "Cookie": cookie,
      "Referer": `https://scratch.mit.edu/studios/${STUDIO_ID}/projects/`
    }
  });

  console.log("PUT", id, "→", res.status);

  if (!res.ok) {
    console.log("PUT失敗詳細:", await res.text());
  }
}
