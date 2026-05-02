import type { HistoryResponse, ModelInfoResponse, PredictionResponse } from "@/types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const PATH_PREDICT = "/predict"
const PATH_PREDICT_B64 = "/predict/base64"
const PATH_MODEL_INFO = "/model/info"
const PATH_HISTORY = "/results/history"
const PATH_PLOTS = "/results/plots"

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text()
  let body: unknown
  try {
    body = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`Invalid JSON from API (${res.status})`)
  }
  if (!res.ok) {
    const detail =
      typeof body === "object" && body !== null && "detail" in body
        ? String((body as { detail: unknown }).detail)
        : res.statusText
    throw new Error(detail || `Request failed with status ${res.status}`)
  }
  return body as T
}

export async function predictEmotion(imageFile: File): Promise<PredictionResponse> {
  const form = new FormData()
  form.append("file", imageFile)
  const res = await fetch(`${API_BASE}${PATH_PREDICT}`, {
    method: "POST",
    body: form,
  })
  return parseJsonResponse<PredictionResponse>(res)
}

export async function predictFromBase64(b64: string): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE}${PATH_PREDICT_B64}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: b64 }),
  })
  return parseJsonResponse<PredictionResponse>(res)
}

export async function getModelInfo(): Promise<ModelInfoResponse> {
  const res = await fetch(`${API_BASE}${PATH_MODEL_INFO}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  })
  return parseJsonResponse<ModelInfoResponse>(res)
}

export async function getTrainingHistory(): Promise<HistoryResponse> {
  const res = await fetch(`${API_BASE}${PATH_HISTORY}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  })
  return parseJsonResponse<HistoryResponse>(res)
}

export function getPlotUrl(plotName: string): string {
  return `${API_BASE}${PATH_PLOTS}/${plotName}`
}
