import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If deploying to GitHub Pages at https://kcicek.github.io/mykitchen/
// set base to the repo name so built asset URLs are correct.
export default defineConfig({
  base: '/mykitchen/',
  plugins: [react()],
})
