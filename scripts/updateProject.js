import fetch from "node-fetch";

export async function updateInstructions(projectId, session, csrftoken, text) {
  const cookie = `scratchsessionsid=${session}; scratchcsrftoken=${csrftoken};`;

  const res = await fetch(`https://api.scratch.mit.edu/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
      "X-Requested-With": "XMLHttpRequest",
      "Cookie": cookie,
      "Referer": "https://scratch.mit.edu/"
    },
    body: JSON.stringify({
      instructions: text
    })
  });

  console.log("instructions update:", res.status);
}
