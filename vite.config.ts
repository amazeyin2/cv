import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// 递归复制目录
function copyDirRecursive(src: string, dest: string) {
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true })
  const entries = readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-static-assets',
      closeBundle() {
        // 复制静态资源到 dist
        const staticDirs = ['img', 'css']
        const staticFiles = ['favicon.ico']
        
        staticDirs.forEach(dir => {
          if (existsSync(dir)) {
            copyDirRecursive(dir, join('dist', dir))
          }
        })
        
        staticFiles.forEach(file => {
          if (existsSync(file)) {
            copyFileSync(file, join('dist', file))
          }
        })
      }
    }
  ],
  publicDir: false,
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
