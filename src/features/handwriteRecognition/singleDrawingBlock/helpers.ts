export function getScaleForSize(size: number, maxSize: number) {
  const scale = Math.min(1, size / maxSize)
  return { x: scale, y: scale }
}
