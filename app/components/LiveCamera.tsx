"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Camera } from "lucide-react"

export interface LiveCameraProps {
  onCapture: (blob: Blob) => void
}

type CamStatus = "idle" | "active" | "error"

export function LiveCamera({ onCapture }: LiveCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<CamStatus>("idle")
  const [message, setMessage] = useState<string | null>(null)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function start() {
      setMessage(null)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setStatus("active")
      } catch {
        if (!cancelled) {
          setStatus("error")
          setMessage(
            "Camera access was denied or is unavailable. Allow the browser to use your webcam and try again.",
          )
        }
      }
    }
    void start()
    return () => {
      cancelled = true
      stopStream()
    }
  }, [stopStream])

  const capture = useCallback(() => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) {
      setMessage("Video is not ready yet. Wait a moment and try again.")
      return
    }
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(blob)
        else setMessage("Could not capture frame. Please try again.")
      },
      "image/jpeg",
      0.92,
    )
  }, [onCapture])

  const statusColor = status === "active" ? "bg-success" : status === "error" ? "bg-angry" : "bg-muted"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`} aria-hidden />
          <span>
            {status === "active" ? "Camera active" : status === "error" ? "Camera error" : "Starting…"}
          </span>
        </div>
        <button
          type="button"
          onClick={capture}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Camera className="h-4 w-4" aria-hidden />
          Capture &amp; Analyze
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-inner">
        <video ref={videoRef} className="aspect-video w-full object-cover" playsInline muted />
      </div>
      {message && <p className="text-sm text-warning">{message}</p>}
    </div>
  )
}
