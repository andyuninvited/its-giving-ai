"""Extract plain-text bodies from exported .eml files for private scoring.

Usage: python3 -I scripts/extract-eml.py <eml_dir> <out_dir>
Writes <out_dir>/NNN.txt bodies and <out_dir>/index.json (date, sender, subject).
Everything it writes stays in the gitignored private/ folder.
"""
import email, email.policy, html, json, os, re, sys
from datetime import datetime, timezone

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)

def html_to_text(h):
    h = re.sub(r"(?is)<(script|style|head).*?</\1>", " ", h)
    h = re.sub(r"(?i)<br\s*/?>|</p>|</div>|</tr>|</li>|</h\d>", "\n", h)
    h = re.sub(r"<[^>]+>", " ", h)
    return html.unescape(h)

def body_of(msg):
    plain = msg.get_body(preferencelist=("plain",))
    if plain is not None:
        return plain.get_content()
    rich = msg.get_body(preferencelist=("html",))
    return html_to_text(rich.get_content()) if rich is not None else ""

QUOTE = re.compile(r"(?m)^(On .{0,200}wrote:|-{2,} ?Original Message|From: .+\nSent: )")

def clean(text):
    m = QUOTE.search(text)
    if m:
        text = text[: m.start()]
    lines = [l.rstrip() for l in text.splitlines() if not l.lstrip().startswith(">")]
    text = "\n".join(lines)
    text = re.sub(r"[ \t ]+", " ", text)
    return re.sub(r"\n{3,}", "\n\n", text).strip()

rows = []
for name in sorted(os.listdir(src)):
    if not name.endswith(".eml"):
        continue
    with open(os.path.join(src, name), "rb") as f:
        msg = email.message_from_binary_file(f, policy=email.policy.default)
    try:
        body = clean(body_of(msg))
    except Exception as e:  # malformed part: record and move on
        body = ""
        print(f"skip body {name}: {e}", file=sys.stderr)
    meta_path = os.path.join(src, name[:-4] + ".metadata.json")
    ts = None
    if os.path.exists(meta_path):
        ts = json.load(open(meta_path)).get("Payload", {}).get("Time")
    n = f"{len(rows) + 1:03d}"
    with open(os.path.join(out, n + ".txt"), "w") as f:
        f.write(body)
    sender = email.utils.parseaddr(str(msg.get("From", "")))
    rows.append({
        "n": n,
        "date": datetime.fromtimestamp(ts, timezone.utc).date().isoformat() if ts else None,
        "from_name": sender[0],
        "from_domain": sender[1].split("@")[-1].lower(),
        "from_addr": sender[1].lower(),
        "reply_to": email.utils.parseaddr(str(msg.get("Reply-To", "")))[1].lower(),
        "subject": str(msg.get("Subject", "")),
        "words": len(body.split()),
    })

json.dump(rows, open(os.path.join(out, "index.json"), "w"), indent=1)
print(f"{len(rows)} extracted, {sum(1 for r in rows if r['words'] < 25)} under 25 words")
