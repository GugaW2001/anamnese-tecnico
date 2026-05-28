import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface TriagemFormProps {
  dados: any
  onChange: (dados: any) => void
}

export function TriagemForm({ dados, onChange }: TriagemFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...dados, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label>Nome Completo da Paciente</Label>
          <Input
            value={dados.nome_completo || ''}
            onChange={(e) => handleChange('nome_completo', e.target.value)}
            placeholder="Ex: Maria da Silva"
          />
        </div>
        <div className="space-y-2">
          <Label>Idade da Paciente</Label>
          <Input
            type="number"
            value={dados.idade || ''}
            onChange={(e) => handleChange('idade', e.target.value)}
            placeholder="Ex: 45"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Motivo do Exame</Label>
          <Input
            value={dados.motivo_exame || ''}
            onChange={(e) => handleChange('motivo_exame', e.target.value)}
            placeholder="Ex: rotina, dor, nódulo"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-base font-semibold mb-4">Histórico Ginecológico</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>Idade da Menarca (primeira menstruação)</Label>
            <Input
              type="number"
              value={dados.idade_menarca || ''}
              onChange={(e) => handleChange('idade_menarca', e.target.value)}
              placeholder="Ex: 12"
            />
          </div>
          <div className="space-y-2 border p-4 rounded-lg bg-muted/10">
            <Label>Menopausa?</Label>
            <RadioGroup
              value={dados.menopausa || ''}
              onValueChange={(v) => handleChange('menopausa', v)}
              className="flex gap-6 mt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="sim" id="menopausa-sim" />
                <Label htmlFor="menopausa-sim" className="cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="nao" id="menopausa-nao" />
                <Label htmlFor="menopausa-nao" className="cursor-pointer">Não</Label>
              </div>
            </RadioGroup>
            {dados.menopausa === 'sim' && (
              <div className="mt-3">
                <Label>Idade da Menopausa</Label>
                <Input
                  type="number"
                  value={dados.idade_menopausa || ''}
                  onChange={(e) => handleChange('idade_menopausa', e.target.value)}
                  placeholder="Ex: 50"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-base font-semibold mb-4">Histórico de Tratamentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 border p-4 rounded-lg bg-muted/10">
            <Label>Cirurgia Prévia na Mama?</Label>
            <RadioGroup
              value={dados.cirurgia_previa_mama || ''}
              onValueChange={(v) => handleChange('cirurgia_previa_mama', v)}
              className="flex gap-6 mt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="sim" id="cirurgia-sim" />
                <Label htmlFor="cirurgia-sim" className="cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="nao" id="cirurgia-nao" />
                <Label htmlFor="cirurgia-nao" className="cursor-pointer">Não</Label>
              </div>
            </RadioGroup>
            {dados.cirurgia_previa_mama === 'sim' && (
              <div className="mt-3">
                <Label>Motivo da cirurgia</Label>
                <Input
                  value={dados.motivo_cirurgia || ''}
                  onChange={(e) => handleChange('motivo_cirurgia', e.target.value)}
                  placeholder="Descreva o motivo"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <div className="space-y-2 border p-4 rounded-lg bg-muted/10">
            <Label>Radioterapia?</Label>
            <RadioGroup
              value={dados.radioterapia || ''}
              onValueChange={(v) => handleChange('radioterapia', v)}
              className="flex gap-6 mt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="sim" id="radio-sim" />
                <Label htmlFor="radio-sim" className="cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="nao" id="radio-nao" />
                <Label htmlFor="radio-nao" className="cursor-pointer">Não</Label>
              </div>
            </RadioGroup>
            {dados.radioterapia === 'sim' && (
              <div className="mt-3">
                <Label>Período da radioterapia</Label>
                <Input
                  value={dados.periodo_radioterapia || ''}
                  onChange={(e) => handleChange('periodo_radioterapia', e.target.value)}
                  placeholder="Ex: 2019 - 2020"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <div className="space-y-2 border p-4 rounded-lg bg-muted/10">
            <Label>Braquiterapia?</Label>
            <RadioGroup
              value={dados.braquiterapia || ''}
              onValueChange={(v) => handleChange('braquiterapia', v)}
              className="flex gap-6 mt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="sim" id="braqui-sim" />
                <Label htmlFor="braqui-sim" className="cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="nao" id="braqui-nao" />
                <Label htmlFor="braqui-nao" className="cursor-pointer">Não</Label>
              </div>
            </RadioGroup>
            {dados.braquiterapia === 'sim' && (
              <div className="mt-3">
                <Label>Período da braquiterapia</Label>
                <Input
                  value={dados.periodo_braquiterapia || ''}
                  onChange={(e) => handleChange('periodo_braquiterapia', e.target.value)}
                  placeholder="Ex: 2020 - 2021"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <div className="space-y-2 border p-4 rounded-lg bg-muted/10">
            <Label>Quimioterapia?</Label>
            <RadioGroup
              value={dados.quimioterapia || ''}
              onValueChange={(v) => handleChange('quimioterapia', v)}
              className="flex gap-6 mt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="sim" id="quimio-sim" />
                <Label htmlFor="quimio-sim" className="cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="nao" id="quimio-nao" />
                <Label htmlFor="quimio-nao" className="cursor-pointer">Não</Label>
              </div>
            </RadioGroup>
            {dados.quimioterapia === 'sim' && (
              <div className="mt-3">
                <Label>Período da quimioterapia</Label>
                <Input
                  value={dados.periodo_quimioterapia || ''}
                  onChange={(e) => handleChange('periodo_quimioterapia', e.target.value)}
                  placeholder="Ex: 2019 - 2020"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-base font-semibold mb-4">Hábitos e Histórico Familiar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 border p-4 rounded-lg bg-muted/10">
            <Label>Tabagismo?</Label>
            <RadioGroup
              value={dados.tabagismo || ''}
              onValueChange={(v) => handleChange('tabagismo', v)}
              className="flex gap-6 mt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="sim" id="tabagismo-sim" />
                <Label htmlFor="tabagismo-sim" className="cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="nao" id="tabagismo-nao" />
                <Label htmlFor="tabagismo-nao" className="cursor-pointer">Não</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2 border p-4 rounded-lg bg-muted/10">
            <Label>Histórico Familiar de Câncer de Mama?</Label>
            <RadioGroup
              value={dados.historico_familiar_cancer_mama || ''}
              onValueChange={(v) => handleChange('historico_familiar_cancer_mama', v)}
              className="flex gap-6 mt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="sim" id="hist-sim" />
                <Label htmlFor="hist-sim" className="cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="nao" id="hist-nao" />
                <Label htmlFor="hist-nao" className="cursor-pointer">Não</Label>
              </div>
            </RadioGroup>
            {dados.historico_familiar_cancer_mama === 'sim' && (
              <div className="mt-3">
                <Label>Grau de Parentesco</Label>
                <Input
                  value={dados.grau_parentesco || ''}
                  onChange={(e) => handleChange('grau_parentesco', e.target.value)}
                  placeholder="Ex: Mãe, Irmã, Tia"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Exames Anteriores (mamografia, ultrassom?)</Label>
            <Input
              value={dados.exames_anteriores || ''}
              onChange={(e) => handleChange('exames_anteriores', e.target.value)}
              placeholder="Descreva os exames anteriores realizados"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-base font-semibold mb-4">Medicações e Observações</h3>
        <div className="grid grid-cols-1 gap-5">
          <div className="space-y-2">
            <Label>Medicações Atuais</Label>
            <Textarea
              value={dados.medicacoes_atuais || ''}
              onChange={(e) => handleChange('medicacoes_atuais', e.target.value)}
              placeholder="Liste os medicamentos em uso (ou digite 'nenhum')"
              className="resize-none min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Observações e Queixas Atuais</Label>
            <Textarea
              value={dados.observacoes || ''}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              placeholder="Relate quaisquer dores, nódulos palpáveis ou outras queixas..."
              className="resize-none min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
