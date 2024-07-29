import CanvasKitInit, { CanvasKit } from 'canvaskit-wasm'

type SkiaRef = {
  CanvasKit: CanvasKit | null
  onLoad: (callback: (kit: CanvasKit) => void) => () => void
}

const watchers = new Set<(kit: CanvasKit) => void>()
function watchLoad(callback: (kit: CanvasKit) => void) {
  if (Skia.CanvasKit) {
    callback(Skia.CanvasKit)
    return () => {}
  }
  const fn = (kit: CanvasKit) => {
    watchers.delete(fn)
    callback(kit)
  }
  watchers.add(fn)
  return () => watchers.delete(fn)
}

export const Skia: SkiaRef = {
  CanvasKit: null,
  onLoad: watchLoad,
}

CanvasKitInit({
  locateFile: (file) => '/node_modules/canvaskit-wasm/bin/' + file,
})
  .then((CanvasKit) => {
    Skia.CanvasKit = CanvasKit
    watchers.forEach((fn) => fn(CanvasKit))
  })
  .catch((e) => {})
