import React from 'react'
import { useStore } from 'effector-react'
import { Button, Input, Space } from 'antd'
import { primitiveInput } from './model.primitiveInput'
import { primitiveMarkupModel } from './model.primitiveMarkup'
import MarkupKeyboard from '../../../../ui/keyboard/MarkupKeyboard'
import styles from '../styles.module.scss'

type PrimitiveValueInputProps = {}

const PrimitiveValueInput = ({}: PrimitiveValueInputProps) => {
  const value = useStore(primitiveInput.$value)

  return (
    <div>
      <Space.Compact>
        <Input
          onChange={(event) => primitiveInput.setValue(event.target.value)}
          value={value}
          defaultValue='Combine input and button'
        />
        <Button
          onClick={() => {
            primitiveMarkupModel.sendCurrent().catch((e) => {})
          }}
          type='primary'
        >
          Submit
        </Button>
      </Space.Compact>
      <MarkupKeyboard
        onPress={(value) => {
          primitiveInput.setValue(value)
        }}
        className={styles.MarkupKeyboard}
      />
    </div>
  )
}

export default PrimitiveValueInput
