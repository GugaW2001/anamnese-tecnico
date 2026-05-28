import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const achadosClinicosOpcoes = [
  { id: 'retracao', label: 'Retração' },
  { id: 'verrugas', label: 'Verrugas' },
  { id: 'nodulo', label: 'Nódulo' },
  { id: 'cicatriz', label: 'Cicatriz' },
  { id: 'sinais_cutaneos', label: 'Sinais cutâneos' },
  { id: 'linfonodos_axilares', label: 'Linfonodos axilares' },
  { id: 'derrame_papila', label: 'Derrame da papila' },
  { id: 'retro_vertido', label: 'Retro vertido' },
]

const lateralidades = [
  { value: 'none', label: 'Nenhum' },
  { value: 'direito', label: 'Direito' },
  { value: 'esquerdo', label: 'Esquerdo' },
  { value: 'bilateral', label: 'Bilateral' },
]

export function ExameFisicoForm({ dados, onChange }: { dados: any; onChange: (d: any) => void }) {
  const handleAchado = (id: string, value: string) => {
    const newVal = value === 'none' ? undefined : value
    onChange({
      ...dados,
      achadosClinicos: {
        ...(dados.achadosClinicos || {}),
        [id]: newVal,
      },
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <Label className="text-base font-semibold mb-4 block">Achados Clínicos</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {achadosClinicosOpcoes.map((achado) => (
            <div key={achado.id} className="space-y-1.5 p-3 border rounded-lg bg-muted/10">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {achado.label}
              </Label>
              <Select
                value={dados.achadosClinicos?.[achado.id] || 'none'}
                onValueChange={(val) => handleAchado(achado.id, val)}
              >
                <SelectTrigger className="h-8 bg-background">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {lateralidades.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Descrição técnica das imagens para ficha de anamnese de mamografia</Label>
          <Textarea
            value={dados.descricaoTecnicaImagens || ''}
            onChange={(e) => onChange({ ...dados, descricaoTecnicaImagens: e.target.value })}
            className="min-h-[120px] resize-y"
            placeholder="Descreva detalhadamente os achados técnicos das imagens, incluindo localização, tamanho, forma, contorno, densidade, calcificações, distorções arquiteturais, assimetrias e outros achados relevantes..."
          />
        </div>
        <div className="space-y-2">
          <Label>Observações gerais e complementares</Label>
          <Textarea
            value={dados.observacoes || ''}
            onChange={(e) => onChange({ ...dados, observacoes: e.target.value })}
            className="min-h-[100px] resize-y"
            placeholder="Adicione quaisquer outras observações relevantes sobre o exame clínico..."
          />
        </div>
      </div>
    </div>
  )
}
