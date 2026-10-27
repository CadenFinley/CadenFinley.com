"""Check custom error status codes with a local Apache server."""

from pathlib import Path
import shutil
import socket
import subprocess
import tempfile
import time
from urllib.error import HTTPError, URLError
from urllib.request import build_opener, HTTPRedirectHandler

ROOT = Path(__file__).resolve().parents[1]
CODES = (400, 401, 403, 404, 410, 500, 503)


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, response, code, message, headers, url):
        return None


def main():
    executable = shutil.which("httpd") or shutil.which("apache2")
    if not executable:
        executable = next((str(path) for path in (Path("/usr/sbin/httpd"), Path("/usr/sbin/apache2")) if path.is_file()), None)
    if not executable:
        raise SystemExit("Apache is required for the HTTP error checks.")
    modules = next(path for path in (Path("/usr/libexec/apache2"), Path("/usr/lib/apache2/modules")) if path.is_dir())
    compiled = subprocess.check_output([executable, "-l"], text=True)
    loads = []
    for name in ("mpm_event", "unixd", "authz_core", "mime", "dir", "rewrite"):
        if f"{name}.c" not in compiled:
            loads.append(f'LoadModule {name}_module "{modules / ("mod_" + name + ".so")}"')
    with tempfile.TemporaryDirectory(prefix="portfolio-errors-") as temporary:
        directory = Path(temporary)
        public = directory / "public"
        public.mkdir()
        for name in ("home", "images", "errors"):
            shutil.copytree(ROOT / name, public / name)
        shutil.copy2(ROOT / "home.html", public / "home.html")
        for code in CODES:
            shutil.copy2(ROOT / "errors" / f"{code}.html", public / f"{code}.shtml")
        rules = (ROOT / ".htaccess").read_text() + "\n"
        for code in CODES:
            rules += f"RewriteRule ^__status/{code}$ - [R={code},L]\n"
        (public / ".htaccess").write_text(rules)
        with socket.socket() as probe:
            probe.bind(("127.0.0.1", 0))
            port = probe.getsockname()[1]
        config = directory / "httpd.conf"
        (directory / "mime.types").write_text("")
        config.write_text(f'''ServerRoot "{directory}"
ServerName 127.0.0.1
Listen 127.0.0.1:{port}
PidFile "{directory / 'httpd.pid'}"
ErrorLog "{directory / 'error.log'}"
DefaultRuntimeDir "{directory}"
{chr(10).join(loads)}
DocumentRoot "{public}"
TypesConfig "{directory / 'mime.types'}"
AddType text/html .html .shtml
AddType text/css .css
AddType text/javascript .js
<Directory "{public}">
  AllowOverride All
  Options FollowSymLinks
  Require all granted
</Directory>
''')
        subprocess.run([executable, "-t", "-f", str(config)], check=True, capture_output=True)
        opener = build_opener(NoRedirect())

        def request(path):
            try:
                response = opener.open(f"http://127.0.0.1:{port}{path}", timeout=5)
            except HTTPError as error:
                response = error
            with response:
                return response.code, response.headers, response.read().decode()

        process = subprocess.Popen([executable, "-f", str(config), "-DFOREGROUND"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        try:
            for attempt in range(50):
                if process.poll() is not None:
                    raise AssertionError((directory / "error.log").read_text())
                try:
                    assert request("/")[0] == 200
                    break
                except URLError:
                    time.sleep(0.1)
            else:
                raise AssertionError("The test server did not start.")
            for code in CODES:
                status, headers, body = request(f"/__status/{code}")
                assert status == code, f"Expected HTTP {code}, received {status}."
                assert f"<h1>{code}</h1>" in body and 'href="/"' in body
                assert "Location" not in headers, f"Error {code} must not redirect."
                assert "noindex" in body
            assert request("/nested/missing/page")[0] == 404
            assert request("/acu-journey")[0] == 410
            assert request("/co-curricular")[0] == 410
            assert request("/home/pages/journey.js")[0] == 404
            assert request("/home/pages/community.js")[0] == 404
            assert request("/home/styles/home-styles.css")[0] == 200
            assert request("/errors/theme.js")[0] == 200
            print("PASS: seven custom error statuses, retired pages, and error assets.")
        finally:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()


if __name__ == "__main__":
    main()
