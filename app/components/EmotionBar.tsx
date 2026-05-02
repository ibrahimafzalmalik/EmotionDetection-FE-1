"use client"

import clsx from "clsx"
import type { EmotionType } from "@/types"
import { EMOTION_COLORS, EMOTION_EMOJIS } from "@/types"

const EMOTION_TAILWIND: Record<EmotionType, string> = {
  angry: "text-angry",
  disgust: "text-disgust",
  fear: "text-fear",
  happy: "text-happy",
  neutral: "text-neutral",
  sad: "text-sad",
  surprise: "text-surprise",
}

function isEmotionType(name: string): name is EmotionType {
  return name in EMOTION_COLORS
}

export interface EmotionBarProps {
  emotion: string
  probability: number
  isTop: boolean
  index: number
}

export function EmotionBar({ emotion, probability, isTop, index }: EmotionBarProps) {
  const pct = Math.round(probability * 1000) / 10
  const widthPct = Math.min(100, Math.max(0, probability * 100))
  const typed = isEmotionType(emotion) ? emotion : "neutral"
  const color = EMOTION_COLORS[typed]
  const emoji = isEmotionType(emotion) ? EMOTION_EMOJIS[typed] : "·"
  const labelClass = isEmotionType(emotion) ? EMOTION_TAILWIND[typed] : "text-muted"

  return (
    <div
      className={clsx("bar-row-animate flex items-center gap-3 py-1.5")}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={clsx("w-28 shrink-0 text-sm font-medium", labelClass)}>
        <span className="mr-1.5" aria-hidden>
          {emoji}
        </span>
        <span className="capitalize">{emotion}</span>
      </div>
      <div className="relative h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${widthPct}%`,
            backgroundColor: color,
            boxShadow: isTop ? `0 0 12px 1px ${color}` : undefined,
          }}
        />
      </div>
      <div className="w-14 shrink-0 text-right text-sm tabular-nums text-text">{pct}%</div>
    </div>
  )
}
