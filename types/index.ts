export interface PredictionResponse {
  emotion: string
  confidence: number
  probabilities: Record<string, number>
  processing_time_ms: number
  model_used: string
}

export interface ModelInfoResponse {
  model_name: string
  num_classes: number
  class_names: string[]
  total_params: number
  trainable_params: number
  val_accuracy: number
  architecture_summary: string
}

export interface HistoryResponse {
  train_loss: number[]
  val_loss: number[]
  train_acc: number[]
  val_acc: number[]
  lr: number[]
}

export type EmotionType =
  | "angry"
  | "disgust"
  | "fear"
  | "happy"
  | "neutral"
  | "sad"
  | "surprise"

export const EMOTION_EMOJIS: Record<EmotionType, string> = {
  angry: "😠",
  disgust: "🤢",
  fear: "😨",
  happy: "😊",
  neutral: "😐",
  sad: "😢",
  surprise: "😲",
}

export const EMOTION_COLORS: Record<EmotionType, string> = {
  angry: "#ef4444",
  disgust: "#84cc16",
  fear: "#8b5cf6",
  happy: "#facc15",
  neutral: "#94a3b8",
  sad: "#3b82f6",
  surprise: "#f97316",
}
