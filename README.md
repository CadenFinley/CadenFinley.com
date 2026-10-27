# CadenFinley.com

This repository contains the static website at <https://cadenfinley.com>.
The site uses HTML, CSS, and JavaScript modules. It requires no build step.

## Project files

| Path | Purpose |
| --- | --- |
| `home.html` | Website entry page |
| `home/body.js` | Application entry module and routes |
| `home/pages/` | Page modules |
| `home/components/` | Shared components |
| `home/styles/` | Stylesheets |
| `images/` | Images, icons, and resume |
| `.htaccess` | Apache entry page, errors, and rewrite rules |
| `.cpanel.yml` | cPanel deployment tasks |

## Local preview

1. Run `python3 -m http.server 8000 --bind 127.0.0.1` from this directory.
2. Open <http://127.0.0.1:8000/home.html>.

Python's HTTP server does not process `.htaccess`.
Check Apache redirects and error responses on the hosting server.

## Checks and contributions

1. Create a branch for the change.
2. Run `bash scripts/check-site.sh` with Node.js and Python 3 installed.
3. Check the affected pages in a browser.
4. Create a pull request into `main`.

GitHub Actions checks JavaScript syntax, the sitemap XML, and whitespace.
These checks do not execute the website in a browser or check external services.
The workflow does not deploy the website.

## cPanel deployment

The existing `.cpanel.yml` copies the website to
`/home/llirhcywukjh/public_html/cadenfinley.com/`.
The cPanel Domains page matches this document root as of October 26, 2026.
Check the document root again if the hosting configuration changes.

The cPanel repository display name is `CadenFinley.com`.
Its repository directory is `/home/llirhcywukjh/repositories/CadenFinley.com_V2`.
It tracks `main` from <https://github.com/CadenFinley/CadenFinley.com>.

For a cPanel repository that retrieves changes from GitHub:

1. Merge the reviewed change into `main`.
2. Open **Files > Git Version Control** in cPanel.
3. Select **Manage** for this website's repository.
4. Select **Pull or Deploy**.
5. Check that the selected branch is `main`.
6. Select **Update from Remote**.
7. Check the commit that cPanel retrieved.
8. Select **Deploy HEAD Commit**.
9. Check <https://cadenfinley.com>.

The cPanel repository and deployment controls were present during the account check on October 26, 2026.
Pushing to GitHub does not itself run these deployment tasks.
A direct push to a cPanel-managed repository can deploy automatically.
See the [cPanel deployment guide](https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-deployment/).

The deployment copies only the listed website files and directories.
It does not remove old files from the destination.
Before deployment, preserve a copy of the current website outside `public_html`.
To restore a previous version, retrieve that commit and deploy its website files.
Remove obsolete public files separately after review.

## SSH access

1. Open the hosting account's GoDaddy dashboard.
2. Open **Settings**.
3. Select **Manage** beside **SSH access**.
4. Enable SSH access.
5. Check the server IP and cPanel username against the dashboard.

GoDaddy documents port `22` for Web Hosting (cPanel).
See [Enable SSH](https://www.godaddy.com/help/enable-ssh-for-my-web-hosting-cpanel-account-16102)
and [Connect with SSH](https://www.godaddy.com/help/connect-to-my-web-hosting-cpanel-account-with-ssh-secure-shell-31865).

To use a local SSH key, import its public `.pub` file through
**Security > SSH Access > Manage SSH Keys** in cPanel.
Authorize the imported public key.
Keep the private key on your computer.
Check the server's host key fingerprint through the provider before accepting it.

Keep passwords, private SSH keys, and account tokens outside this repository.
