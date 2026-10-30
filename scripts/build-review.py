"""Build a private, local-only review page for picking Hall of Shame entries.

Usage: python3 -I scripts/build-review.py private/rejections
Reads scored.json and text/NNN.txt, writes review.html in the same folder.
Never publish the output: it contains real email text.
"""
import html, json, os, sys

root = sys.argv[1]
rows = json.load(open(os.path.join(root, "scored.json")))
ATS = ("myworkday.com", "greenhouse-mail.io", "greenhouse.io", "ashbyhq.com", "lever.co", "gem.com", "icims.com",
       "successfactors.com", "smartrecruiters.com", "jobvite.com", "workablemail.com", "bamboohr.com", "taleo.net", "rippling.com")

def is_ats(addr):
    return any(addr.endswith("@" + d) or addr.endswith("." + d) for d in ATS)

def company_addr(r):
    for a in (r.get("reply_to") or "", r.get("from_addr") or ""):
        if "@" in a and not is_ats(a) and not a.split("@")[0].startswith(("no-reply", "noreply", "donotreply", "do-not-reply")):
            return a
    return r.get("from_addr") or ""

def blur(addr):
    if "@" not in addr:
        return "**"
    local, domain = addr.split("@", 1)
    labels = domain.split(".")
    name, tld = (labels[-2], labels[-1]) if len(labels) >= 2 else (labels[0], "")
    return f"{local[:2]}**@***{name[-3:]}.{tld}"

for r in rows:
    r["company_addr"] = company_addr(r)
    r["blur"] = blur(r["company_addr"])
    r["body"] = open(os.path.join(root, "text", r["n"] + ".txt")).read()

data = json.dumps(rows).replace("</", "<\\/")
page = """<!doctype html><html><head><meta charset="utf-8"><title>Hall of Shame picker (private)</title>
<style>
body{font:15px -apple-system,Helvetica,Arial,sans-serif;margin:0;background:#fff8ee;color:#111}
header{position:sticky;top:0;background:#111;color:#fff8ee;padding:12px 20px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;z-index:2}
header b{color:#d4ff3a}button{font:inherit;font-weight:700;border:0;border-radius:999px;padding:8px 16px;background:#ff2e88;color:#fff;cursor:pointer}
select,input[type=search]{font:inherit;padding:6px 10px;border-radius:8px;border:1px solid #999}
.row{border-bottom:1px solid #ddd;padding:12px 20px;display:grid;grid-template-columns:28px 64px 1fr;gap:12px}
.row.sel{background:#f4ffd0}.score{font-size:28px;font-weight:900;color:#ff2e88}
.meta{color:#555;font-size:13px}.tells span{display:inline-block;background:#111;color:#d4ff3a;border-radius:999px;padding:1px 8px;margin:2px 4px 0 0;font-size:12px}
details pre{white-space:pre-wrap;font:13px/1.5 Menlo,monospace;background:#fff;border:1px solid #ddd;padding:10px;border-radius:8px;max-height:360px;overflow:auto}
input.label{font:600 14px Menlo,monospace;width:220px;padding:4px 8px}
</style></head><body>
<header><span>PRIVATE. Never publish this file.</span><span><b id="count">0</b> selected</span>
<label>Sort <select id="sort"><option value="score">Score</option><option value="tells">Tells</option><option value="date">Newest</option><option value="words">Longest</option></select></label>
<input type="search" id="q" placeholder="Filter by name, subject, text">
<button id="export">Export manifest.json</button></header>
<main id="list"></main>
<script>
const rows = __DATA__;
const sel = new Map();
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function render() {
  const key = document.getElementById("sort").value, q = document.getElementById("q").value.toLowerCase();
  const list = rows.filter((r) => !q || (r.from_name + r.subject + r.body + r.company_addr).toLowerCase().includes(q))
    .sort((a, b) => key === "date" ? String(b.date).localeCompare(String(a.date)) : b[key] - a[key]);
  document.getElementById("list").innerHTML = list.map((r) => `
    <div class="row ${sel.has(r.n) ? "sel" : ""}" data-n="${r.n}">
      <input type="checkbox" ${sel.has(r.n) ? "checked" : ""}>
      <div class="score">${r.score}</div>
      <div><div><b>${esc(r.from_name)}</b> &lt;${esc(r.from_addr)}&gt; · ${esc(r.date)} · ${r.words} words · ${r.tells} tells</div>
        <div class="meta">${esc(r.subject)} · company address: ${esc(r.company_addr)}</div>
        <div>Public label: <input class="label" value="${esc(sel.get(r.n) ?? r.blur)}"></div>
        <div class="tells">${r.top.map((t) => `<span>${esc(t.label)} ×${t.count}</span>`).join("")}</div>
        <details><summary>Email text</summary><pre>${esc(r.body)}</pre></details></div>
    </div>`).join("");
  document.getElementById("count").textContent = sel.size;
}
document.getElementById("list").addEventListener("change", (e) => {
  const row = e.target.closest(".row"); if (!row) return;
  const n = row.dataset.n, label = row.querySelector("input.label").value;
  if (e.target.type === "checkbox") { e.target.checked ? sel.set(n, label) : sel.delete(n); render(); }
  else if (sel.has(n)) sel.set(n, label);
});
document.getElementById("sort").onchange = render;
document.getElementById("q").oninput = render;
document.getElementById("export").onclick = () => {
  const manifest = Object.fromEntries([...sel].map(([n, company]) => [n + ".txt", { company, kind: "rejection" }]));
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" }));
  a.download = "manifest.json"; a.click();
};
render();
</script></body></html>"""
open(os.path.join(root, "review.html"), "w").write(page.replace("__DATA__", data))
print("wrote", os.path.join(root, "review.html"))
print("sample labels:", sorted({r["blur"] for r in rows})[:8])
