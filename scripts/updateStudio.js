import fetch from "node-fetch";

const STUDIO_ID = 51407751;

export async function clearStudio(cookie, token) {
  const url = `https://api.scratch.mit.edu/studios/${STUDIO_ID}/projects/`;
  const res = await fetch(url);
  const list = await res.json();

  for (const p of list) {
    await fetch(`https://scratch.mit.edu/site-api/projects/in/${STUDIO_ID}/${p.id}/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": token,
        "Cookie": cookie
      }
    });
  }
}

export async function addProject(cookie, token, id) {
  await fetch(`https://scratch.mit.edu/site-api/projects/in/${STUDIO_ID}/${id}/`, {
    method: "PUT",
    headers: {
      "X-CSRFToken": token,
      "Cookie": cookie
    }
  });
}
