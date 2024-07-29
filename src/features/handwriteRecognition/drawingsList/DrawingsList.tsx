import React from 'react'
import styles from './styles.module.scss'
import { useStore } from 'effector-react'
import { drawingsListModel } from './model'
import { clsx } from 'clsx'
import DrawingListController from './DrawingListController'
import { DrawingHistory } from './types'

type ImagesListProps = {
  onItemHover?: (index: number) => void
  onItemSelect?: (item: DrawingHistory) => void
  className?: string
}

const DrawingsList = React.memo(
  ({ onItemHover, onItemSelect, className }: ImagesListProps) => {
    const db = useStore(drawingsListModel.$db)

    return (
      <div>
        <DrawingListController />
        <div className={clsx(styles.ImageList, className)}>
          {db.histories.map((item) => {
            return (
              <div
                onMouseEnter={() => {
                  onItemHover?.(item.id)
                }}
                onClick={() => {
                  onItemSelect?.(item)
                }}
                key={item.id}
                className={styles.Image}
              >
                <img
                  alt={'drawing sample'}
                  src={`../assets/drawings/${item.id}.png`}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

export default DrawingsList
