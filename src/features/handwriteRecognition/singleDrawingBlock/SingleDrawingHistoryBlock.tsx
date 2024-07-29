import React from 'react'
import styles from './styles.module.scss'
import DrawingMarkupBlock from '../drawingMarkup/DrawingMarkupBlock'
import MyScriptRecognitionController from './MyScriptRecognitionController'

type SingleDrawingHistoryBlockProps = {}

const SingleDrawingHistoryBlock = ({}: SingleDrawingHistoryBlockProps) => {
  return (
    <div className={styles.SingleDrawingHistoryBlock}>
      <MyScriptRecognitionController />
      <DrawingMarkupBlock />
      {/*<DrawingChart />*/}
    </div>
  )
}

export default SingleDrawingHistoryBlock
