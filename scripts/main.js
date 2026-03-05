import fs from "fs";
import { fetchValidComments } from "./fetchComments.js";
import { fetchProjectData } from "./fetchProject.js";
import { calcScore } from "./calcScore.js";

async function main() {
  console.log("コメント取得中…");
  const ids = await fetchValidComments();

  const projects = [];
  for (const id of ids) {
    const p = await fetchProjectData(id);
    if (p) projects.push(p);
  }

  // スコア付きデータに変換
  const scored = projects.map(p => ({
    id: p.id,
    username: p.author.username,
    score: calcScore(p)
  }));

  // ユーザーごとに最高スコアだけ残す
  const bestByUser = {};
  for (const p of scored) {
    if (!bestByUser[p.username] || p.score > bestByUser[p.username].score) {
      bestByUser[p.username] = p;
    }
  }

  // 配列化してソート
  const uniqueProjects = Object.values(bestByUser);

  const ranked = uniqueProjects
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  console.log("ランキング:", ranked);

  // README 用 Markdown（コードブロック形式）
  const md =
    "# 🏆 自動ランキング（上位10件）\n\n" +
    "```\n" +
    ranked
      .map(
        (p, i) =>
          `${i + 1} - @${p.username} (${p.score.toFixed(2)}Point)\nhttps://scratch.mit.edu/projects/${p.id}\n`
      )
      .join("\n") +
    "```\n\n" +
    "（毎日自動更新）\n";

  fs.writeFileSync("README.md", md);

  console.log("README.md を更新しました！");
}

main();
