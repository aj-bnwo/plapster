import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

/**
 * Vite plugin: scans public/videos/ at build time (and dev server start)
 * and writes public/video-manifest.json so the app can fetch it at runtime.
 * Videos are served as static files from public/ — never bundled as assets.
 */
function viteVideoManifest() {
  const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov'])

  function buildManifest(publicDir) {
    const videosDir = path.join(publicDir, 'videos')
    if (!fs.existsSync(videosDir)) {
      fs.writeFileSync(
        path.join(publicDir, 'video-manifest.json'),
        JSON.stringify({ videos: [] }, null, 2),
        'utf-8'
      )
      return
    }

    const videos = []

    for (const category of fs.readdirSync(videosDir)) {
      if (category.startsWith('.')) continue
      const categoryPath = path.join(videosDir, category)
      const stat = fs.statSync(categoryPath)
      if (!stat.isDirectory()) continue

      for (const filename of fs.readdirSync(categoryPath)) {
        if (filename.startsWith('.')) continue
        const ext = path.extname(filename).toLowerCase()
        if (!VIDEO_EXTS.has(ext)) continue

        videos.push({
          category,
          filename,
          // Relative URL path — works with Vite base: './' for GitHub Pages
          src: `videos/${encodeURIComponent(category)}/${encodeURIComponent(filename)}`,
        })
      }
    }

    // Sort: category, then filename
    videos.sort((a, b) =>
      a.category === b.category
        ? a.filename.localeCompare(b.filename)
        : a.category.localeCompare(b.category)
    )

    fs.writeFileSync(
      path.join(publicDir, 'video-manifest.json'),
      JSON.stringify({ videos }, null, 2),
      'utf-8'
    )

    console.log(`[video-manifest] Written ${videos.length} video entries.`)
  }

  return {
    name: 'vite-video-manifest',
    // Runs before the build / dev server
    configResolved(config) {
      buildManifest(config.publicDir)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    viteVideoManifest(),
    tailwindcss(),
    react(),
  ],
})
