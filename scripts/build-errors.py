"""Generate static error pages that use the portfolio's existing styles."""

import argparse
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ERRORS = {
    400: ("Bad Request", "The server could not understand this request. Check the address, then try again."),
    401: ("Authentication Required", "This page requires authentication. Return to the homepage or contact me if you need access."),
    403: ("Access Restricted", "You do not have permission to access this page. Return to the homepage or contact me if you need access."),
    404: ("Page Not Found", "The address may be incorrect, or the page may have moved. Check the URL or return to the homepage."),
    410: ("Page Removed", "This page is no longer available. You can find my current work on the homepage."),
    500: ("Server Error", "The server could not complete this request. Try again later or return to the homepage."),
    503: ("Temporarily Unavailable", "The site is temporarily unavailable. Try again later."),
}


def render(code, title, description):
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>{code} · {escape(title)} · Caden Finley</title>
  <link rel="icon" href="/images/cadenfinleylogo.ico">
  <link rel="stylesheet" href="/home/styles/home-styles.css">
  <script src="/errors/theme.js" defer></script>
</head>
<body>
  <div class="container">
    <nav class="navbar" aria-label="Error page navigation">
      <div class="nav-left"><a href="/">Caden Finley</a></div>
      <div class="nav-center"></div>
      <div class="nav-right"><a href="https://github.com/CadenFinley">GitHub</a></div>
    </nav>
    <main class="error-page">
      <h1>{code}</h1>
      <h2>{escape(title)}</h2>
      <p>{escape(description)}</p>
      <a class="btn primary" href="/">Return Home</a>
      <p class="error-contact"><a href="mailto:caden.finley0789@gmail.com">Contact me by email.</a></p>
    </main>
    <footer class="footer"><p>© <span data-year>2026</span> Caden Finley</p></footer>
  </div>
</body>
</html>
'''


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check generated pages without changing files.")
    args = parser.parse_args()
    for code, (title, description) in ERRORS.items():
        target = ROOT / "errors" / f"{code}.html"
        content = render(code, title, description)
        if args.check:
            if not target.is_file() or target.read_text() != content:
                raise SystemExit(f"Error page {code} requires regeneration. Run python3 scripts/build-errors.py.")
        else:
            target.parent.mkdir(exist_ok=True)
            target.write_text(content)
    print(f"{'Checked' if args.check else 'Generated'} {len(ERRORS)} error pages.")
