export type HandwritePrimitive = {
  points: number[][][]
  value: string
  feature_path_count: string
  feature_points_count: string
  origin_drawing_id: string
}

export type GetByOriginDrawingIdParams = {
  origin_drawing_id: string
}
