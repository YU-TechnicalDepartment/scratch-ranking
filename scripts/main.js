import { loginScratch } from "./login.js";
import { fetchValidComments } from "./fetchComments.js";
import { fetchProjectData } from "./fetchProject.js";
import { calcScore } from "./calcScore.js";
import { clearStudio, addProject } from "./updateStudio.js";

async function main() {
  const username = process.env.SCRATCH_USERNAME;
  const password = process.env.SCRATCH_PASSWORD;

  console.log("ログイン中…");
  const { cookie, token, xtoken } = await loginScratch(username, password);

  console.log("コメント取得中…");
  const ids = await fetchValidComments();

  if (ids.length === 0) {
    console.log("今日のコメントなし → ランキング更新せず終了");
    return;
  }

  console.log("対象作品:", ids);

  const projects = [];
  for (const id of ids) {
    const p = await fetchProjectData(id);
    if (p) projects.push(p);
  }

  if (projects.length === 0) {
    console.log("作品データが取得できませんでした");
    return;
  }

  const scored = projects.map(p => ({
    id: p.id,
    score: calcScore(p)
  }));

  scored.sort((a, b) => b.score - a.score);

  const top10 = scored.slice(0, 10);

  console.log("ランキング上位10:", top10);

  console.log("スタジオ作品削除中…");
  await clearStudio(cookie, token, xtoken);

  console.log("スタジオに作品追加中…");
  for (let i = top10.length - 1; i >= 0; i--) {
    await addProject(cookie, token, xtoken, top10[i].id);
  }

  console.log("ランキング更新完了！");
}

main();
