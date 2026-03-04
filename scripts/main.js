import { loginScratch } from "./login.js";
import { fetchValidComments } from "./fetchComments.js";
import { fetchProjectData } from "./fetchProject.js";
import { calcScore } from "./calcScore.js";
import { updateInstructions } from "./updateProject.js";

const TARGET_PROJECT = 1286736759;

async function main() {
  const username = process.env.SCRATCH_USERNAME;
  const password = process.env.SCRATCH_PASSWORD;

  console.log("ログイン中…");
  const { session, csrftoken } = await loginScratch(username, password);

  console.log("コメント取得中…");
  const ids = await fetchValidComments();

  const projects = [];
  for (const id of ids) {
    const p = await fetchProjectData(id);
    if (p) projects.push(p);
  }

  const ranked = projects
    .map(p => ({ id: p.id, score: calcScore(p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  console.log("ランキング:", ranked);

  const text =
    "🏆 自動ランキング（上位10件）\n\n" +
    ranked.map((p, i) => `${i + 1}. https://scratch.mit.edu/projects/${p.id} — ${p.score}pt`).join("\n") +
    "\n\n（毎日自動更新）";

  console.log("使い方欄を更新中…");
  await updateInstructions(TARGET_PROJECT, session, csrftoken, text);

  console.log("完了！");
}

main();
