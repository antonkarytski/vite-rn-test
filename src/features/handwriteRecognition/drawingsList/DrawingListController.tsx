import React from 'react'
import { clsx } from 'clsx'
import styles from './styles.module.scss'
import { Button } from 'antd'
import { drawingsListModel } from './model'
import { useStore } from 'effector-react'

type DrawingListControllerProps = {}

const DrawingListController = ({}: DrawingListControllerProps) => {
  const page = useStore(drawingsListModel.$page)

  return (
    <div className={clsx(styles.ListController)}>
      <Button
        type={'primary'}
        onClick={() => {
          drawingsListModel.prevPage()
        }}
      >
        Prev
      </Button>
      <span>{page}</span>
      <Button
        type={'primary'}
        onClick={() => {
          drawingsListModel.nextPage()
        }}
      >
        Next
      </Button>
    </div>
  )
}

export default DrawingListController
