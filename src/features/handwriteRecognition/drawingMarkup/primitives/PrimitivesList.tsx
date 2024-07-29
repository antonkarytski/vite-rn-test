import React from 'react'
import styles from '../styles.module.scss'
import PrimitivePreview, { PrimitiveProto } from './PrimitivePreview'
import { useStore } from 'effector-react'
import { Store } from 'effector'
import { Typography } from 'antd'

type PrimitivesListProps<T extends PrimitiveProto> = {
  $list: Store<T[]>
  title?: string
  onItemPress?: (item: T) => void
  onItemRemovePress?: (item: T) => void
}

const PrimitivesList = <T extends PrimitiveProto>({
  $list,
  title,
  onItemPress,
  onItemRemovePress,
}: PrimitivesListProps<T>) => {
  const marked = useStore($list)

  if (!marked.length) return
  return (
    <div>
      {title && <Typography.Title level={3}>{title}</Typography.Title>}
      <div className={styles.PrimitivesList}>
        {marked.map((item, index) => (
          <PrimitivePreview
            onRemovePress={onItemRemovePress}
            onPress={onItemPress}
            key={index}
            width={50}
            height={50}
            item={item}
            className={styles.Primitive}
          />
        ))}
      </div>
    </div>
  )
}

export default PrimitivesList
