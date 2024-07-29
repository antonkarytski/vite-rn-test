module.exports = {
  plugins: [
    'effector/babel-plugin',
    '@babel/plugin-transform-flow-strip-types',
  ],
  presets: ['metro-react-native-babel-preset', '@babel/preset-typescript'],
}
