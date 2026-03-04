import fetch from "node-fetch";

const COMMENT_PROJECT_ID = 1286429603;

export async function fetchValidComments() {
  // まずプロジェクト情報を取得して作者名を得る
  const projectInfo = await fetch(`https://api.scratch.mit.edu/projects/${COMMENT_PROJECT_ID}/`)
    .then(r => r.json())
    .catch(() => null);

  if (!projectInfo || !projectInfo.author || !projectInfo.author.username) {
    console.log("プロジェクト情報取得失敗");
    return [];
  }

  const username = projectInfo.author.username;

  // 正しいコメント API
  const url = `https://api.scratch.mit.edu/users/${username}/projects/${COMMENT_PROJECT_ID}/comments?limit=40&offset=0`;

  const res = await fetch(url);

  if (!res.ok) {
    console.log("コメント取得失敗:", res.status, await res.text());
    return [];
  }

  let comments;
  try {
    comments = await res.json();
  } catch (e) {
    console.log("JSON パース失敗:", e);
    return [];
  }

  if (!Array.isArray(comments)) {
    console.log("コメント API が配列を返さなかった:", comments);
    return [];
  }

  const regex = /^#\s*https:\/\/scratch\.mit\.edu\/projects\/(\d+)\/\s*#\s*(\d{4})\/(\d{1,2})\/(\d{1,2})$/;

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
