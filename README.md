# vinext template

Use this repository as a starter template for building and deploying a Next.js + vinext app to Cloudflare Pages.

- Template repository: `uratmangun/vinext-template`
- Live template homepage: https://vinext-template.pages.dev

## use this template

### option 1: github ui

1. Open: https://github.com/uratmangun/vinext-template
2. Click **Use this template**
3. Choose your owner/org, repo name, and visibility
4. Create repository and clone it locally

### option 2: github cli

```bash
gh repo create my-new-repo --template uratmangun/vinext-template --private --clone
```

For a public repository:

```bash
gh repo create my-new-repo --template uratmangun/vinext-template --public --clone
```

## local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## vinext workflow

```bash
npm run dev:vinext
npm run build:vinext
```

## deploy to cloudflare pages

This template is configured to export static output for Pages deployment.

```bash
npm run build
wrangler pages project create my-new-repo
wrangler pages deploy out --project-name my-new-repo --branch main
```

After deploy, your site will be available at:

- `https://my-new-repo.pages.dev`

## useful repository settings

Set your GitHub repo homepage to your Pages domain:

```bash
gh repo edit --homepage https://my-new-repo.pages.dev
```