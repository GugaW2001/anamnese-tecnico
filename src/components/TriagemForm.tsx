import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

interface TriagemFormProps {
  dados: any
  onChange: (dados: any) => void
}

export function TriagemForm({ dados, onChange }: TriagemFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...dados, [field]: value })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="space-y-2">
        <Label>Motivo do Exame</Label>
        <Input
          value={dados.motivoExame || ''}
          onChange={(e) => handleChange('motivoExame', e.target.value)}
          placeholder="Ex: rotina, dor, nódulo"
        />
      </div>
      <div className="space-y-2">
        <Label>Idade da Menarca</Label>
        <Input
          type="number"
          value={dados.idadeMenarca || ''}
          onChange={(e) => handleChange('idadeMenarca', Number(e.target.value))}
        />
      </div>

      <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border">
        <Checkbox
          id="menopausa"
          checked={dados.menopausa || false}
          onCheckedChange={(v) => handleChange('menopausa', !!v)}
        />
        <div className="space-y-2 flex-1">
          <Label htmlFor="menopausa" className="cursor-pointer">
            Menopausa
          </Label>
          {dados.menopausa && (
            <Input
              type="number"
              placeholder="Idade da menopausa"
              value={dados.idadeMenopausa || ''}
              onChange={(e) => handleChange('idadeMenopausa', Number(e.target.value))}
            />
          )}
        </div>
      </div>

      <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border">
        <Checkbox
          id="cirurgia"
          checked={dados.cirurgiaPrevia || false}
          onCheckedChange={(v) => handleChange('cirurgiaPrevia', !!v)}
        />
        <div className="space-y-2 flex-1">
          <Label htmlFor="cirurgia" className="cursor-pointer">
            Cirurgia Prévia na Mama
          </Label>
          {dados.cirurgiaPrevia && (
            <Input
              placeholder="Motivo da cirurgia"
              value={dados.motivoCirurgia || ''}
              onChange={(e) => handleChange('motivoCirurgia', e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border">
        <Checkbox
          id="radioterapia"
          checked={dados.radioterapia || false}
          onCheckedChange={(v) => handleChange('radioterapia', !!v)}
        />
        <div className="space-y-2 flex-1">
          <Label htmlFor="radioterapia" className="cursor-pointer">
            Radioterapia
          </Label>
          {dados.radioterapia && (
            <Input
              type="date"
              value={dados.dataRadioterapia || ''}
              onChange={(e) => handleChange('dataRadioterapia', e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border">
        <Checkbox
          id="quimioterapia"
          checked={dados.quimioterapia || false}
          onCheckedChange={(v) => handleChange('quimioterapia', !!v)}
        />
        <div className="space-y-2 flex-1">
          <Label htmlFor="quimioterapia" className="cursor-pointer">
            Quimioterapia
          </Label>
          {dados.quimioterapia && (
            <Input
              type="date"
              value={dados.dataQuimioterapia || ''}
              onChange={(e) => handleChange('dataQuimioterapia', e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border">
        <Checkbox
          id="braquiterapia"
          checked={dados.braquiterapia || false}
          onCheckedChange={(v) => handleChange('braquiterapia', !!v)}
        />
        <div className="space-y-2 flex-1">
          <Label htmlFor="braquiterapia" className="cursor-pointer">
            Braquiterapia
          </Label>
          {dados.braquiterapia && (
            <Input
              type="date"
              value={dados.dataBraquiterapia || ''}
              onChange={(e) => handleChange('dataBraquiterapia', e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border">
        <Checkbox
          id="histFamiliar"
          checked={dados.historicoFamiliar || false}
          onCheckedChange={(v) => handleChange('historicoFamiliar', !!v)}
        />
        <div className="space-y-2 flex-1">
          <Label htmlFor="histFamiliar" className="cursor-pointer">
            Histórico Familiar Câncer
          </Label>
          {dados.historicoFamiliar && (
            <Input
              placeholder="Grau de parentesco"
              value={dados.grauParentescoFamiliar || ''}
              onChange={(e) => handleChange('grauParentescoFamiliar', e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border md:col-span-2">
        <Checkbox
          id="tabagismo"
          checked={dados.tabagismo || false}
          onCheckedChange={(v) => handleChange('tabagismo', !!v)}
        />
        <Label htmlFor="tabagismo" className="cursor-pointer mt-1">
          Tabagismo
        </Label>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label>Exames Anteriores</Label>
        <Input
          placeholder="Mamografia, Ultrassom..."
          value={dados.examesAnteriores || ''}
          onChange={(e) => handleChange('examesAnteriores', e.target.value)}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label>Medicações Atuais</Label>
        <Textarea
          value={dados.medicacoesAtuais || ''}
          onChange={(e) => handleChange('medicacoesAtuais', e.target.value)}
          className="resize-none"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label>Observações e Queixas Atuais</Label>
        <Textarea
          value={dados.observacoesQueixas || ''}
          onChange={(e) => handleChange('observacoesQueixas', e.target.value)}
          className="resize-none"
        />
      </div>
    </div>
  )
}
