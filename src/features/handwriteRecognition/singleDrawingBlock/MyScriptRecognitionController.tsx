import React from 'react'
import styles from './styles.module.scss'
import { Button } from 'antd'
import { myScriptRestRecognizer } from '../../myScript/model'
import { useStoreMap } from 'effector-react'
import { currentDrawing } from './model'
import { noop } from '@heyheyjude/toolkit'

const MyScriptRecognitionController = () => {
  const isSendAvailable = useStoreMap(
    currentDrawing.$convertedGlyphs,
    (glyphs) => !!glyphs.length
  )

  return (
    <div className={styles.DrawingControllerBlock}>
      <Button
        onClick={() => {
          myScriptRestRecognizer
            .recognizeCurrentHistory()
            .then(() => currentDrawing.convertGlyphsToPrimitives())
            .then(console.log)
            .catch(console.error)
        }}
      >
        Calculate
      </Button>
      <Button
        disabled={!isSendAvailable}
        onClick={() => {
          currentDrawing
            .sendAutoRecognizedGlyphs()
            .then(() => {
              console.log('SENT')
            })
            .catch(noop)
        }}
      >
        Send
      </Button>
    </div>
  )
}

export default MyScriptRecognitionController
