// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  postcss: {
    plugins: {
      'postcss-nested': {},
      tailwindcss: {},
    }
  },
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css', integrity: 'sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==', crossorigin: 'anonymous', referrerpolicy: 'no-referrer' }
      ],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: " | Local Weather"
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  runtimeConfig: {
    API_KEY: process.env.API_KEY
  }
})
