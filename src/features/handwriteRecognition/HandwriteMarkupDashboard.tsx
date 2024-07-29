import React from 'react'
import styles from './styles.module.scss'
import DrawingsList from './drawingsList/DrawingsList'
import { currentDrawing } from './singleDrawingBlock/model'
import SingleDrawingHistoryBlock from './singleDrawingBlock/SingleDrawingHistoryBlock'

const HandwriteMarkupDashboard = () => {
  return (
    <div className={styles.Container}>
      <DrawingsList
        className={styles.DrawingsList}
        onItemSelect={currentDrawing.setItem}
      />
      <SingleDrawingHistoryBlock />
    </div>
  )
}

export default HandwriteMarkupDashboard
