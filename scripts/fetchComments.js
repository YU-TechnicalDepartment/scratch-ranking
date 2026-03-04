import fetch from "node-fetch";

const COMMENT_PROJECT_ID = 1286429603;

export async function fetchValidComments() {
  const url = `https://api.scratch.mit.edu/projects/${COMMENT_PROJECT_ID}/comments?offset=0&limit=40`;
  const res = await fetch(url);
  const comments = await res.json();

  const regex = /^✦\s*https:\/\/scratch\.mit\.edu\/projects\/(\d+)\/\s*✦\s*(\d{4})\/(\d{1,2})\/(\d{1,2})$/;

  const today = new Date();
  const utcY = today.getUTCFullYear();
  const utcM = today.getUTCMonth() + 1;
  const utcD = today.getUTCDate();

  const results = [];

  for (const c of comments) {
    const text = c.content.trim();
    const match = text.match(regex);
    if (!match) continue;

    const projectId = match[1];
    const y = Number(match[2]);
    const m = Number(match[3]);
    const d = Number(match[4]);

    if (y === utcY && m === utcM && d === utcD) {
      results.push(projectId);
    }
  }

  return results;
}
