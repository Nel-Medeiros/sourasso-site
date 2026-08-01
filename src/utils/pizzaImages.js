const pcViewModules = import.meta.glob('../assets/*-pc-view.png', { eager: true })
const mobileViewModules = import.meta.glob('../assets/*-mobile-view.png', { eager: true })

function buildImageMap(modules) {
  return Object.fromEntries(
    Object.entries(modules).map(([path, mod]) => {
      const filename = path.split('/').pop().replace('.png', '')
      return [filename, mod.default]
    })
  )
}

const pcViewImages = buildImageMap(pcViewModules)
const mobileViewImages = buildImageMap(mobileViewModules)

export function getPcViewImage(filename) {
  if (!filename) return null
  return pcViewImages[filename] ?? null
}

export function getMobileViewImage(filename) {
  if (!filename) return null
  return mobileViewImages[filename] ?? null
}
