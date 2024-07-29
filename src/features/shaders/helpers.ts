export const createRectDrawMatrix = (width: number, height: number) => {
  return [0, 0, width, 0, width, height, 0, height, 0, 0]
}
