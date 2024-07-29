import { MyScriptRestRecognitionModule } from './rest/MyScriptRestRecognitionModule'
import { currentDrawing } from '../handwriteRecognition/singleDrawingBlock/model'
import {
  getPrimitivesFromJIIX,
  MM_TO_PX,
  transformJIIXBoxes,
} from './jiixParser'

export const myScriptRestRecognizer = new MyScriptRestRecognitionModule({
  hmac: '644075f2-8abc-4f94-b096-f1e4587f5a71',
  appKey: 'fae08ff0-852d-4db7-8862-b1ae9251d1f2',
  host: 'https://cloud.myscript.com/',
}).bindHistoryStore(currentDrawing.$item)

myScriptRestRecognizer.recognizeFx.done.watch(({ result, params }) => {
  if (!result.jiix || !params) return
  console.log(result.jiix)
  try {
    const primitive = getPrimitivesFromJIIX(result.jiix.expressions).map(
      (glyph) => transformJIIXBoxes(glyph, { scale: MM_TO_PX })
    )
    currentDrawing.setGlyphs(primitive)
  } catch (e) {
    console.log(e)
  }
})
