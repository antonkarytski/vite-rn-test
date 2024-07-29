import React from 'react'
import { KEYBOARD_KEYS } from './keys'
import { Button } from 'antd'
import styles from './styles.module.scss'

type MarkupKeyboardProps = {
  className?: string
  onPress?: (key: string) => void
}

const MarkupKeyboard = ({ className, onPress }: MarkupKeyboardProps) => {
  return (
    <div className={className}>
      {KEYBOARD_KEYS.map((block, index) => {
        return (
          <div className={styles.Row} key={`row${index}`}>
            {block.map((key, buttonIndex) => {
              return (
                <Button
                  onClick={() => {
                    onPress?.(key.value)
                  }}
                  style={{
                    background: key.color,
                  }}
                  className={styles.Key}
                  shape='circle'
                  type={'default'}
                  size={'small'}
                  key={`row${index}${buttonIndex}`}
                >
                  {key.value}
                </Button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default MarkupKeyboard
