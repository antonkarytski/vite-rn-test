import * as THREE from 'three'
import { FULL } from 'sqlite3'

type CreateGroupProps = {
  geometry: THREE.BoxGeometry
  material: THREE.MeshPhongMaterial
  level?: number
  position?: { x: number; y: number; z: number }
  maxDepth?: number
}

const GAP = 2
const COUNT = 3
const FULL_SIZE = COUNT * GAP

export class SpongeSceneModel {
  private currentLoop: number | null = null
  private parent: HTMLElement | null = null

  public readonly scene = new THREE.Scene()
  public readonly camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  public readonly renderer = new THREE.WebGLRenderer()

  private elements = new Map<string, THREE.Object3D>()

  public constructor() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private createGroup({
    geometry,
    material,
    level = 0,
    position = { x: 0, y: 0, z: 0 },
    maxDepth = 0,
  }: CreateGroupProps) {
    const group = new THREE.Group()
    let smallGeometry: THREE.BoxGeometry | undefined = undefined
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          if (
            (x === 1 && y === 1) ||
            (x === 1 && z === 1) ||
            (y === 1 && z === 1)
          ) {
            continue
          }
          const posX = position.x + x * geometry.parameters.width
          const posY = position.y + y * geometry.parameters.height
          const posZ = position.z + z * geometry.parameters.depth
          if (level === maxDepth) {
            const cube = new THREE.Mesh(geometry, material)
            cube.position.x = posX * GAP
            cube.position.y = posY * GAP
            cube.position.z = posZ * GAP
            group.add(cube)
          } else {
            group.add(
              this.createGroup({
                geometry:
                  smallGeometry ||
                  (smallGeometry = new THREE.BoxGeometry(
                    geometry.parameters.width / COUNT,
                    geometry.parameters.height / COUNT,
                    geometry.parameters.depth / COUNT
                  )),
                material,
                level: level + 1,
                position: { x: posX, y: posY, z: posZ },
                maxDepth,
              })
            )
          }
        }
      }
    }
    return group
  }

  private createBasics() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({ color: 0xffff16 })
    const group = this.createGroup({ geometry, material, maxDepth: 2 })
    const color = 0xffffff
    const intensity = 4
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)

    this.scene.add(group)
    this.scene.add(light)

    this.elements.set('cube', group)
    this.elements.set('light', light)

    this.camera.position.z = 10
  }

  private animation(time: number) {
    const cube = this.elements.get('cube') as THREE.Group
    cube.rotation.x += 0.005
    cube.rotation.y += 0.008
    cube.rotation.z += 0.006
  }

  private readonly loop = (time: number) => {
    this.animation(time)
    this.renderer.render(this.scene, this.camera)
    this.currentLoop = requestAnimationFrame(this.loop)
  }

  private stopLoop() {
    if (this.currentLoop) {
      cancelAnimationFrame(this.currentLoop)
    }
    this.currentLoop = null
  }

  public readonly init = (element: HTMLElement | null) => {
    if (this.parent === element) return
    if (this.parent) {
      this.parent.removeChild(this.renderer.domElement)
    }
    this.parent = element
    if (!element) return this.stopLoop()
    element.appendChild(this.renderer.domElement)
    this.createBasics()
    requestAnimationFrame(this.loop)
  }
}
