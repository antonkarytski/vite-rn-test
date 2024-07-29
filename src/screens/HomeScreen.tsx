import React from 'react'
import { View } from 'react-native'
import { DrawBoard } from '@magmamath/react-native-draw-board'

const HomeScreen = () => {
  return (
     <View style={{flex: 1, width: '100vw', height: '100vh'}}>
       <DrawBoard />
     </View>
  )
}

export default HomeScreen
