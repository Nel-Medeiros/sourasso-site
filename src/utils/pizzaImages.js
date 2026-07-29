const pcViewModules = import.meta.glob('../assets/*-pc-view.png', { eager: true })

const pcViewImages = Object.fromEntries(
  Object.entries(pcViewModules).map(([path, mod]) => {
    const filename = path.split('/').pop().replace('.png', '')
    return [filename, mod.default]
  })
)

export function getPcViewImage(filename) {
  if (!filename) return null
  return pcViewImages[filename] ?? null
}
