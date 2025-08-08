# MusicHub

MusicHub is a web music app built using Next.js 14, App Router, and an unofficial music API. The user interface is styled with Tailwind CSS.

[![Follow me](https://img.shields.io/github/followers/r2hu1?style=social)](https://github.com/r2hu1)
[![Star this Repo](https://img.shields.io/github/stars/r2hu1/musichub?style=social)](https://github.com/r2hu1/musichub)

<br/>

![Homepage](/public/feed.png)

## Features

- Browse and listen to a wide variety of music.
- Light and Dark mode for user preference.
- Search for your favorite artists, albums, and tracks.
- Enjoy a seamless music listening experience.

## Screenshots

### Homepage

![Homepage](/public/feed.png)

### Search Page

![Search Page](/public/search-feed.png)

### Album Page

![Album Page](/public/album.png)

### Music Page

Player

![Music Page](/public/player-1.png)

Mobile Player

![Music Page](/public/player-2.png)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/r2hu1/musichub.git
cd musichub
```

2. Install dependencies:

```bash
git clone https://github.com/r2hu1/musichub.git
cd musichub
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

## Deployment

### Vercel Deployment Note

When deploying to Vercel, you might encounter errors related to static page generation for error pages (`/404` and `/500`). This is a known issue with the current configuration.

**Workaround for Vercel Deployment:**

1. In your Vercel project settings, go to the "Build & Development Settings" section.
2. Set the "Build Command" to: `npm run build || exit 0`
3. This will allow the build to complete successfully even with the error page generation warnings.

Alternatively, you can deploy using the Vercel CLI with the `--force` flag:

```bash
vercel --force
```

3. Run the development server:

```bash
npm run dev or pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to explore MusicHub.

## Setup Api

fork and deploy your own repo of `https://github.com/sumitkolhe/jiosaavn-api` get the deployment url and paste in .env file refer .env.example

## Contributing

Contributions are welcome! Please follow our [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).
