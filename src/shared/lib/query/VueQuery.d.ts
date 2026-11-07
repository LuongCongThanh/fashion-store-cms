import '@tanstack/vue-query'

declare module '@tanstack/vue-query' {
  interface Register {
    mutationMeta: { errorHandling?: 'global' | 'local' }
  }
}
