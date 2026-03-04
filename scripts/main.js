import { loginScratch } from "./login.js";
import { fetchValidComments } from "./fetchComments.js";
import { fetchProjectData } from "./fetchProject.js";
import { calcScore } from "./calcScore.js";
import { clearStudio, addProject } from "./updateStudio.js";

async function main() {
  const username = process.env.SCRATCH_USERNAME;
  const password = process.env.SCRATCH_PASSWORD;

  const { cookie, token } = await loginScratch(username, password);

  const ids = await fetchValidComments();
  if (ids.length === 0) {
    console.log("今日のコメントなし");
    return;
  }

  const projects = [];
  for (const id of ids) {
    const p = await fetchProjectData(id);
    if (p) projects.push(p);
  }

  const scored = projects.map(p => ({
    id: p.id,
    score: calcScore(p)
  }));

  scored.sort((a, b) => b.score - a.score);

  const top10 = scored.slice(0, 10);

  await clearStudio(cookie, token);

  for (let i = top10.length - 1; i >= 0; i--) {
    await addProject(cookie, token, top10[i].id);
  }

  console.log("ランキング更新完了！");
}

main();
