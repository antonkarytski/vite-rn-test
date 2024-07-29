import { ISize } from '../../../lib/units/types'

export const INITIAL_CONTENT_SIZE: ISize = {
  width: 800,
  height: 1023,
}
export const initialPackagePayload = (size: ISize) => ({
  xDpi: 90,
  yDpi: 90,
  viewSizeHeight: size.height,
  viewSizeWidth: size.width,
})
