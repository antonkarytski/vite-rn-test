import Konva from 'konva'

export class Selection {
  public x1: number = 0
  public y1: number = 0
  public x2: number = 0
  public y2: number = 0

  public readonly rect = new Konva.Rect({
    fill: 'rgba(0,0,255,0.5)',
    visible: false,
  })

  public get isVisible() {
    return this.rect.visible()
  }

  public start(position: Konva.Vector2d) {
    this.x1 = position.x
    this.y1 = position.y
    this.x2 = position.x
    this.y2 = position.y
    this.rect.visible(true)
    this.rect.width(0)
    this.rect.height(0)
  }

  public move(position: Konva.Vector2d) {
    this.x2 = position.x
    this.y2 = position.y

    const rect = {
      x: Math.min(this.x1, this.x2),
      y: Math.min(this.y1, this.y2),
      width: Math.abs(this.x2 - this.x1),
      height: Math.abs(this.y2 - this.y1),
    }
    this.rect.setAttrs(rect)
  }

  public end() {
    setTimeout(() => {
      this.rect.visible(false)
    })
  }
}
