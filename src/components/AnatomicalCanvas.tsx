import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Undo, Trash2 } from 'lucide-react'

type Point = { x: number; y: number }
export type Stroke = { points: Point[]; color: string; width: number }

interface AnatomicalCanvasProps {
  type: 'frontal' | 'profile'
  value?: Stroke[]
  onChange?: (strokes: Stroke[]) => void
}

export function AnatomicalCanvas({ type, value = [], onChange }: AnatomicalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<Stroke[]>(value)
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null)

  useEffect(() => {
    setStrokes(value || [])
  }, [value])

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = '#94a3b8' // slate-400
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (type === 'frontal') {
      ctx.beginPath()
      ctx.arc(width * 0.28, height * 0.5, width * 0.2, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(width * 0.28, height * 0.5, width * 0.04, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fillStyle = '#94a3b8'
      ctx.beginPath()
      ctx.arc(width * 0.28, height * 0.5, 3, 0, 2 * Math.PI)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(width * 0.72, height * 0.5, width * 0.2, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(width * 0.72, height * 0.5, width * 0.04, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(width * 0.72, height * 0.5, 3, 0, 2 * Math.PI)
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.moveTo(width * 0.2, height * 0.1)
      ctx.lineTo(width * 0.2, height * 0.9)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(width * 0.2, height * 0.25)
      ctx.bezierCurveTo(
        width * 0.8,
        height * 0.3,
        width * 0.8,
        height * 0.7,
        width * 0.2,
        height * 0.8,
      )
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(width * 0.2, height * 0.25)
      ctx.quadraticCurveTo(width * 0.4, height * 0.15, width * 0.5, height * 0.05)
      ctx.stroke()
    }
  }

  const drawStrokes = (ctx: CanvasRenderingContext2D) => {
    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes
    allStrokes.forEach((stroke) => {
      if (stroke.points.length === 0) return
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.beginPath()
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      if (stroke.points.length === 1) {
        ctx.fillStyle = stroke.color
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.width / 2, 0, 2 * Math.PI)
        ctx.fill()
      } else {
        stroke.points.forEach((p) => ctx.lineTo(p.x, p.y))
        ctx.stroke()
      }
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawBackground(ctx, canvas.width, canvas.height)
    drawStrokes(ctx)
  }, [strokes, currentStroke, type])

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoordinates(e)
    setIsDrawing(true)
    setCurrentStroke({ points: [{ x, y }], color: '#ef4444', width: 4 })
  }

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return
    const { x, y } = getCoordinates(e)
    setCurrentStroke({ ...currentStroke, points: [...currentStroke.points, { x, y }] })
  }

  const stopDrawing = () => {
    if (!isDrawing || !currentStroke) return
    setIsDrawing(false)
    const newStrokes = [...strokes, currentStroke]
    setStrokes(newStrokes)
    setCurrentStroke(null)
    onChange?.(newStrokes)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {type === 'frontal' ? 'Visão Frontal (Bilateral)' : 'Visão Perfil'}
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const newStrokes = strokes.slice(0, -1)
              setStrokes(newStrokes)
              onChange?.(newStrokes)
            }}
            disabled={strokes.length === 0}
          >
            <Undo className="h-4 w-4 mr-1" /> Desfazer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setStrokes([])
              onChange?.([])
            }}
            disabled={strokes.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Limpar
          </Button>
        </div>
      </div>
      <div className="border bg-white rounded-lg overflow-hidden touch-none flex justify-center bg-slate-50 shadow-inner">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="max-w-full h-auto cursor-crosshair touch-none"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerOut={stopDrawing}
        />
      </div>
    </div>
  )
}
