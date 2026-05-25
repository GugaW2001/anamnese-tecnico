import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db, Patient } from '@/lib/mock-db'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Save, Send, Loader2, Stethoscope, FileText } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function PatientEvaluation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  const [dadosTriagem, setDadosTriagem] = useState<any>({})
  const [dadosExame, setDadosExame] = useState<any>({})
  const [nomeTecnica, setNomeTecnica] = useState('')

  const [savingTriagem, setSavingTriagem] = useState(false)
  const [savingExame, setSavingExame] = useState(false)
  const [finalizing, setFinalizing] = useState(false)

  useEffect(() => {
    const loadPatient = async () => {
      if (!id) return
      const data = await db.getPatient(id)
      if (data) {
        setPatient(data)
        setDadosTriagem(data.dadosTriagem || {})
        setDadosExame(data.dadosExame || {})
        setNomeTecnica(data.nomeTecnica || '')
      }
      setLoading(false)
    }
    loadPatient()
  }, [id])

  const handleSaveTriagem = async () => {
    if (!id) return
    setSavingTriagem(true)
    try {
      await db.updatePatient(id, { dadosTriagem })
      toast({ title: 'Sucesso', description: 'Dados da triagem salvos localmente.' })
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a triagem.',
        variant: 'destructive',
      })
    } finally {
      setSavingTriagem(false)
    }
  }

  const handleSaveExame = async () => {
    if (!id) return
    setSavingExame(true)
    try {
      await db.updatePatient(id, { dadosExame, nomeTecnica })
      toast({ title: 'Sucesso', description: 'Formulário de avaliação física salvo.' })
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a avaliação.',
        variant: 'destructive',
      })
    } finally {
      setSavingExame(false)
    }
  }

  const handleFinalize = async () => {
    if (!id || !patient) return
    if (!nomeTecnica.trim()) {
      toast({
        title: 'Atenção',
        description: 'O Nome da técnica é obrigatório para finalizar.',
        variant: 'destructive',
      })
      return
    }

    setFinalizing(true)
    try {
      await db.updatePatient(id, { dadosTriagem, dadosExame, nomeTecnica })

      const payload = {
        registroId: patient.id,
        nomeCompleto: patient.nomeCompleto,
        telefone: patient.telefone,
        idade: patient.idade,
        dataAtendimento: patient.dataAtendimento,
        nomeTecnica,
        dadosTriagem,
        dadosExame,
      }

      const webhookUrl = import.meta.env.VITE_WEBHOOK_N8N
      const webhookToken = import.meta.env.VITE_WEBHOOK_TOKEN

      if (webhookUrl && webhookToken) {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${webhookToken}`,
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) throw new Error('Falha no Webhook')
      } else {
        await new Promise((res) => setTimeout(res, 1200))
      }

      await db.updatePatient(id, { status: 'finalizado' })

      toast({
        title: 'Procedimento Concluído!',
        description: 'Avaliação finalizada com sucesso. Documentação enviada.',
      })
      navigate('/')
    } catch (err) {
      toast({
        title: 'Erro de Integração',
        description: 'Ocorreu um erro ao comunicar com o servidor final.',
        variant: 'destructive',
      })
    } finally {
      setFinalizing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-[250px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Paciente não encontrado no sistema.
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up max-w-4xl mx-auto">
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl shadow-sm border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0 hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{patient.nomeCompleto}</h1>
          <p className="text-muted-foreground text-sm font-medium mt-0.5">
            {patient.idade} anos • Contato: {patient.telefone}
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-muted">
        <CardHeader className="bg-muted/30 border-b pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Revisão da Triagem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Motivo da Consulta</Label>
              <Input
                value={dadosTriagem.motivoConsulta || ''}
                onChange={(e) =>
                  setDadosTriagem({ ...dadosTriagem, motivoConsulta: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Histórico Familiar</Label>
              <Input
                value={dadosTriagem.historicoFamiliar || ''}
                onChange={(e) =>
                  setDadosTriagem({ ...dadosTriagem, historicoFamiliar: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Cirurgias Prévias</Label>
              <Input
                value={dadosTriagem.cirurgiasPrevias || ''}
                onChange={(e) =>
                  setDadosTriagem({ ...dadosTriagem, cirurgiasPrevias: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Alergias</Label>
              <Input
                value={dadosTriagem.alergias || ''}
                onChange={(e) => setDadosTriagem({ ...dadosTriagem, alergias: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-muted-foreground">Medicamentos em Uso</Label>
              <Textarea
                value={dadosTriagem.medicamentosUso || ''}
                onChange={(e) =>
                  setDadosTriagem({ ...dadosTriagem, medicamentosUso: e.target.value })
                }
                className="resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={handleSaveTriagem} disabled={savingTriagem}>
              {savingTriagem ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Triagem
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted">
        <CardHeader className="bg-primary/5 border-b pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-primary">
            <Stethoscope className="h-5 w-5" />
            Formulário de Exame Físico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>
                Nome da técnica <span className="text-destructive">*</span>
              </Label>
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

          <div>
            <Label className="text-base font-semibold mb-4 block text-foreground">
              Achados Clínicos
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: 'mamasNormais', label: 'Mamas normais ao exame' },
                { id: 'retracao', label: 'Retração' },
                { id: 'verrugas', label: 'Verrugas' },
                { id: 'nodulo', label: 'Nódulo' },
                { id: 'cicatriz', label: 'Cicatriz' },
                { id: 'sinaisCutaneos', label: 'Sinais cutâneos' },
                { id: 'micronodularidade', label: 'Micronodularidade' },
                { id: 'areaPuncionada', label: 'Área puncionada' },
                { id: 'adensamento', label: 'Adensamento' },
                { id: 'linfonodosAxilares', label: 'Linfonodos axilares' },
                { id: 'derramePapilar', label: 'Derrame papilar' },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 bg-muted/30 p-3 rounded-lg border hover:border-primary/40 transition-colors"
                >
                  <Checkbox
                    id={item.id}
                    checked={!!dadosExame[item.id]}
                    onCheckedChange={(checked) =>
                      setDadosExame({ ...dadosExame, [item.id]: checked === true })
                    }
                    className="h-5 w-5 rounded data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor={item.id}
                    className="text-sm font-medium leading-none cursor-pointer select-none flex-1 py-1"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Descrição dos nódulos palpáveis</Label>
              <Textarea
                placeholder="Detalhe a localização, tamanho, formato e consistência..."
                value={dadosExame.descricaoNodulos || ''}
                onChange={(e) => setDadosExame({ ...dadosExame, descricaoNodulos: e.target.value })}
                className="min-h-[120px] resize-y"
              />
            </div>
            <div className="space-y-2">
              <Label>Observações gerais</Label>
              <Textarea
                placeholder="Adicione quaisquer outras observações relevantes sobre o exame..."
                value={dadosExame.observacoes || ''}
                onChange={(e) => setDadosExame({ ...dadosExame, observacoes: e.target.value })}
                className="min-h-[100px] resize-y"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 bg-card p-4 rounded-xl border shadow-sm sticky bottom-4 z-20">
        <Button
          variant="outline"
          size="lg"
          onClick={handleSaveExame}
          disabled={savingExame || finalizing}
          className="w-full sm:w-auto"
        >
          {savingExame ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Save className="mr-2 h-5 w-5" />
          )}
          Salvar Avaliação
        </Button>
        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto shadow-md"
          onClick={handleFinalize}
          disabled={finalizing}
        >
          {finalizing ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Send className="mr-2 h-5 w-5" />
          )}
          GERAR PDF E ENVIAR
        </Button>
      </div>
    </div>
  )
}
