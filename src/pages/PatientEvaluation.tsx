import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db, Patient } from '@/lib/mock-db'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Save, FileDown, Loader2, ClipboardList, Stethoscope, PenTool, Image } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TriagemForm } from '@/components/TriagemForm'
import { ExameFisicoForm } from '@/components/ExameFisicoForm'
import { AnatomicalCanvas } from '@/components/AnatomicalCanvas'
import { generatePDF } from '@/lib/pdf-generator'

export default function PatientEvaluation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  const [triagem, setTriagem] = useState<any>({})
  const [dadosExame, setDadosExame] = useState<any>({ achadosClinicos: {}, descricaoTecnicaImagens: '', observacoes: '' })
  const [nomeTecnica, setNomeTecnica] = useState('')
  const [frontalStrokes, setFrontalStrokes] = useState<any[]>([])
  const [profileStrokes, setProfileStrokes] = useState<any[]>([])

  const [saving, setSaving] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  useEffect(() => {
    const loadPatient = async () => {
      if (!id) return
      const data = await db.getPatient(id)
      if (data) {
        setPatient(data)
        setTriagem(data.triagem || {})
        setDadosExame(data.dadosExame || { achadosClinicos: {}, descricaoTecnicaImagens: '', observacoes: '' })
        setNomeTecnica(data.nomeTecnica || '')
        setFrontalStrokes(data.frontalStrokes || [])
        setProfileStrokes(data.profileStrokes || [])
      }
      setLoading(false)
    }
    loadPatient()
  }, [id])

  const handleSave = async () => {
    if (!id) return
    setSaving(true)
    try {
      await db.updatePatient(id, { triagem, dadosExame, nomeTecnica, frontalStrokes, profileStrokes })
      toast({ title: 'Salvo', description: 'Dados salvos localmente com sucesso.' })
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível salvar.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (!id || !patient) return
    if (!nomeTecnica.trim()) {
      toast({ title: 'Atenção', description: 'Informe o nome da técnica antes de gerar o PDF.', variant: 'destructive' })
      return
    }
    setGeneratingPdf(true)
    try {
      await db.updatePatient(id, { triagem, dadosExame, nomeTecnica, frontalStrokes, profileStrokes, status: 'finalizado' })

      const frontalEl = document.querySelector<HTMLDivElement>('[data-canvas="frontal"] canvas')
      const profileEl = document.querySelector<HTMLDivElement>('[data-canvas="profile"] canvas')

      const pdfBlob = await generatePDF({
        nomeCompleto: patient.nomeCompleto,
        idade: patient.idade,
        telefone: patient.telefone,
        dataAtendimento: patient.dataAtendimento,
        nomeTecnica,
        triagem,
        dadosExame,
        frontalCanvas: frontalEl,
        profileCanvas: profileEl,
        returnBlob: true,
      }) as Blob

      const fileName = `anamnese_${patient.nomeCompleto.replace(/\s+/g, '_')}.pdf`

      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string

      if (webhookUrl) {
        const formData = new FormData()
        formData.append('file', pdfBlob, fileName)
        formData.append('pdfFileName', fileName)
        formData.append('nomeCompleto', patient.nomeCompleto)
        formData.append('idade', String(patient.idade))
        formData.append('dataAtendimento', patient.dataAtendimento)
        formData.append('nomeTecnica', nomeTecnica)

        const response = await fetch(webhookUrl, { method: 'POST', body: formData })
        if (!response.ok) throw new Error(`Webhook falhou: ${response.status}`)
      }

      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)

      toast({ title: 'PDF Gerado!', description: 'Arquivo enviado para o Drive e baixado localmente.' })
      navigate('/')
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro', description: 'Ocorreu um erro ao processar o PDF.', variant: 'destructive' })
    } finally {
      setGeneratingPdf(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    )
  }

  if (!patient) {
    return <div className="text-center py-10 text-muted-foreground">Paciente não encontrado.</div>
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up max-w-5xl mx-auto">
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl shadow-sm border">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground truncate">{patient.nomeCompleto}</h1>
          <p className="text-muted-foreground text-sm font-medium mt-0.5">
            {patient.idade} anos • Contato: {patient.telefone}
          </p>
          {triagem.motivo_exame && (
            <div className="mt-2 inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
              Motivo: {triagem.motivo_exame}
            </div>
          )}
        </div>
      </div>

      <Card className="shadow-sm border-muted">
        <CardHeader className="bg-muted/30 border-b pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Anamnese - Questionário da Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <TriagemForm dados={triagem} onChange={setTriagem} />
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted">
        <CardHeader className="bg-primary/5 border-b pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-primary">
            <Stethoscope className="h-5 w-5" />
            Exame Clínico - Achados Técnicos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Nome da técnica <span className="text-destructive">*</span></Label>
              <Input
                value={nomeTecnica}
                onChange={(e) => setNomeTecnica(e.target.value)}
                placeholder="Ex: Dra. Mariana Silva"
                className="bg-primary/5 border-primary/20 focus-visible:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Data da avaliação</Label>
              <Input
                type="date"
                value={new Date().toISOString().split('T')[0]}
                disabled
                className="bg-muted text-muted-foreground"
              />
            </div>
          </div>

          <Separator />

          <ExameFisicoForm dados={dadosExame} onChange={setDadosExame} />
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted">
        <CardHeader className="bg-amber-50 border-b pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
            <PenTool className="h-5 w-5" />
            Diagramas Anatômicos - Desenhe os Achados
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <div data-canvas="frontal">
            <div className="flex items-center gap-2 mb-3">
              <Image className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Símbolo Frontal das Mamas (Vista Anteroposterior)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Ilustração esquemática bilateral das mamas em vista frontal. Clique e arraste sobre a imagem
              para marcar nódulos, dor, cicatrizes, secreção papilar e alterações cutâneas.
            </p>
            <div className="flex justify-center">
              <AnatomicalCanvas type="frontal" value={frontalStrokes} onChange={setFrontalStrokes} />
            </div>
          </div>

          <Separator />

          <div data-canvas="profile">
            <div className="flex items-center gap-2 mb-3">
              <Image className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Símbolo em Perfil da Mama (Vista Lateral/Oblíqua)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Ilustração esquemática unilateral da mama em perfil, com extensão da cauda axilar de Spence.
              Permite anotação de achados em quadrantes posteriores e região axilar adjacente.
            </p>
            <div className="flex justify-center">
              <AnatomicalCanvas type="profile" value={profileStrokes} onChange={setProfileStrokes} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 bg-card p-4 rounded-xl border shadow-sm sticky bottom-4 z-20">
        <Button
          variant="outline"
          size="lg"
          onClick={handleSave}
          disabled={saving || generatingPdf}
          className="w-full sm:w-auto"
        >
          {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
          Salvar Avaliação
        </Button>
        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto shadow-md"
          onClick={handleGeneratePDF}
          disabled={generatingPdf || saving}
        >
          {generatingPdf ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <FileDown className="mr-2 h-5 w-5" />
          )}
          {generatingPdf ? 'Gerando...' : 'GERAR PDF COMPLETO'}
        </Button>
      </div>
    </div>
  )
}
