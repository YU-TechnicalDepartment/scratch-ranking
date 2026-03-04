import { getScratchTokens } from "./puppeteerLogin.js";
import { fetchValidComments } from "./fetchComments.js";
import { fetchProjectData } from "./fetchProject.js";
import { calcScore } from "./calcScore.js";
import { clearStudio, addProject } from "./updateStudio.js";

async function main() {
  const username = process.env.SCRATCH_USERNAME;
  const password = process.env.SCRATCH_PASSWORD;

  console.log("ログイン中（Puppeteer）…");
  const tokens = await getScratchTokens(username, password);

  console.log("コメント取得中…");
  const ids = await fetchValidComments();

  const projects = [];
  for (const id of ids) {
    const p = await fetchProjectData(id);
    if (p) projects.push(p);
  }

  const scored = projects
    .map(p => ({ id: p.id, score: calcScore(p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  console.log("ランキング:", scored);

  console.log("スタジオ作品削除中…");
  await clearStudio(tokens);

  console.log("スタジオに作品追加中…");
  for (let i = scored.length - 1; i >= 0; i--) {
    await addProject(tokens, scored[i].id);
  }

  console.log("完了！");
}

main();
