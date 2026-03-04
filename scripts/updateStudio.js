import fetch from "node-fetch";

const STUDIO_ID = 51407751;

function buildCookie(tokens) {
  return (
    `scratchsessionsid=${tokens.session}; ` +
    `scratchcsrftoken=${tokens.csrftoken}; ` +
    `scratchtoken=${tokens.xtoken};`
  );
}

export async function clearStudio(tokens) {
  const cookie = buildCookie(tokens);

  const list = await fetch(
    `https://api.scratch.mit.edu/studios/${STUDIO_ID}/projects/`
  ).then(r => r.json());

  console.log("削除対象作品数:", list.length);

  for (const p of list) {
    const res = await fetch(
      `https://api.scratch.mit.edu/studios/${STUDIO_ID}/project/${p.id}`,
      {
        method: "DELETE",
        headers: {
          "X-Token": tokens.xtoken,
          "X-CSRFToken": tokens.csrftoken,
          "X-Requested-With": "XMLHttpRequest",
          "Cookie": cookie,
          "Referer": "https://scratch.mit.edu/"
        }
      }
    );

    console.log("DELETE", p.id, res.status);
  }
}

export async function addProject(tokens, id) {
  const cookie = buildCookie(tokens);

  const res = await fetch(
    `https://api.scratch.mit.edu/studios/${STUDIO_ID}/project/${id}`,
    {
      method: "PUT",
      headers: {
        "X-Token": tokens.xtoken,
        "X-CSRFToken": tokens.csrftoken,
        "X-Requested-With": "XMLHttpRequest",
        "Cookie": cookie,
        "Referer": "https://scratch.mit.edu/"
      }
    }
  );

  console.log("PUT", id, res.status);
}
