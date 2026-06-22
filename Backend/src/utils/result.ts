export type Result<T, Int, E = string> = 
  | { success: true; data: T, meta?: T }
  | { success: false; code: Int; message: E };