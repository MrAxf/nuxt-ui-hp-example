const baseURL = process.env.NUXT_PUBLIC_API_URL
    // @ts-ignore
    ?? globalThis.__NUXT__?.config.public.apiUrl
    ?? '';

export default $fetch.create({
    baseURL
});