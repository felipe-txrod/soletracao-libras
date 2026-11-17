# Libras Fingerspelling Challenge

A static website for practicing the Brazilian Sign Language (Libras) manual alphabet, one letter at a time. The interface and learning content are in Brazilian Portuguese. The exercises teach fingerspelling rather than complete word signs.

## Features

- Five topics with 20 terms each: general vocabulary, computing, health, science, and tourism.
- Random word selection without repetition until each topic's 20 terms have been used.
- Answer checking, definition hints, and answer reveal.
- Playback at 0.5x, 1x, and 2x speed, with pause, replay, and manual advancement.
- Free practice with user-provided words or names.
- A browsable A–Z manual alphabet gallery.

## Local development

No package installation, build step, or environment variables are required. Open `index.html` directly in a browser, or serve the repository with Python 3:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit <http://127.0.0.1:8000>. Stop the server with `Ctrl+C`. All application assets are local, so the site also works offline when opened directly.

## GitHub Pages deployment

The workflow in `.github/workflows/pages.yml` publishes the static site after a push to `main` and can also be run manually. It stages only the application files, images, README, and license in the deployment artifact.

1. Create an empty GitHub repository without adding a README, license, or `.gitignore`.
2. Connect the local repository if `origin` has not been configured yet:

   ```bash
   git remote add origin https://github.com/felipe-txrod/soletracao-libras.git
   ```

3. Before pushing, open the GitHub repository's **Settings → Pages** and select **GitHub Actions** as the source under **Build and deployment**.
4. Push the project:

   ```bash
   git push -u origin main
   ```

5. Follow the **Deploy to GitHub Pages** workflow in the **Actions** tab. The published site is available at <https://felipe-txrod.github.io/soletracao-libras/> after a successful deployment.

The workflow follows the [GitHub Pages custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Asset paths are relative, supporting deployment under the repository's URL prefix.

## Project structure

```text
.github/workflows/pages.yml  GitHub Pages deployment
.editorconfig               Shared editor settings
.gitattributes              Text line endings and binary asset handling
.gitignore                  Local and generated file exclusions
index.html                  Page structure and accessible controls
estilo.css                  Styling and responsive layout
dados.js                    Topics, words, and definitions
app.js                      Selection, playback, and answer checking
imagens/                    Manual alphabet photographs (A.jpg–Z.jpg)
LICENSE                     GNU General Public License v3.0
```

Edit `dados.js` to update the learning content. Preserve the existing topic structure and word/definition fields. User-facing content should remain in Brazilian Portuguese; new code identifiers, comments, and technical documentation should be written in English.

## Credits and license

The 26 photographs were reused from the original material supplied for this adaptation. The source credited in that material is the [RoboLibras manual alphabet](https://github.com/ianderichalski/robo-libras/tree/main/docs/alphabet), distributed under [GPL-3.0](https://github.com/ianderichalski/robo-libras/blob/main/LICENSE). The license text is included in `LICENSE`; retain the license and attribution when redistributing this project.

These photographs show static hand configurations. Letters requiring movement, such as H, J, K, X, and Z, cannot be fully represented by a single image. Complement the exercises with a demonstration by someone familiar with Libras.
