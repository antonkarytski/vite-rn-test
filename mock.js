export default function codegenNativeComponent(viewConfig) {
  // Return a stub or partial implementation as needed
  return {}
}

export const TurboModuleRegistry = {
  get: (name) => {
    console.log(`TurboModuleRegistry.get called for: ${name}`)
    return undefined
  },
  // Add other methods if needed
}
