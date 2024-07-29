import { createBrowserRouter, RouteObject } from 'react-router-dom'
import React from 'react'
import { Screens } from './routes'
import HomeScreen from '../../screens/HomeScreen'
import HandwriteMarkupScreen from '../../screens/HandwriteMarkupScreen'
import ShadersScreen from '../../screens/ShadersScreen'
import ThreeScreen from '../../screens/ThreeScreen'
import PurpleRainScreen from '../../screens/PurpleRainScreen'

type ExtendedRouteObject = RouteObject & {
  name: string
  path: Screens
}

export const ROUTES_LIST: ExtendedRouteObject[] = [
  {
    name: 'Home',
    path: Screens.HOME,
    element: <HomeScreen />,
  },
  {
    name: 'Handwrite',
    path: Screens.HANDWRITING,
    element: <HandwriteMarkupScreen />,
  },
  {
    name: 'Shaders',
    path: Screens.SHADERS,
    element: <ShadersScreen />,
  },
  {
    name: 'Three',
    path: Screens.THREE,
    element: <ThreeScreen />,
  },
  {
    name: 'Purple rain',
    path: Screens.PURPLE_RAIN,
    element: <PurpleRainScreen />,
  },
]

export const router = createBrowserRouter(ROUTES_LIST)
