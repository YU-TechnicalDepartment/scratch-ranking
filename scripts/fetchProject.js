import fetch from "node-fetch";

export async function fetchProjectData(id) {
  const url = `https://api.scratch.mit.edu/projects/${id}/`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return await res.json();
}
