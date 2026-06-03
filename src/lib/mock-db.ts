import { supabase } from './supabase/client'
import type { Stroke } from '@/components/AnatomicalCanvas'

export type PatientStatus = 'pendente' | 'finalizado'

export interface Patient {
  id: string
  nomeCompleto: string
  telefone: string
  idade: number
  dataAtendimento: string
  status: PatientStatus
  triagem: Record<string, any>
  dadosExame: Record<string, any>
  nomeTecnica: string
  frontalStrokes: Stroke[]
  profileStrokes: Stroke[]
  created_at: string
}

function mapRowToPatient(row: any): Patient {
  return {
    id: row.id,
    nomeCompleto: row.nome_completo,
    telefone: row.telefone || '',
    idade: row.idade,
    dataAtendimento: row.data_atendimento,
    status: row.status as PatientStatus,
    triagem: {
      nome_completo: row.nome_completo || '',
      idade: String(row.idade || ''),
      motivo_exame: row.motivo_exame || '',
      ...(row.dados_triagem || {}),
    },
    dadosExame: row.dados_exame || { achadosClinicos: {}, descricaoTecnicaImagens: '', observacoes: '' },
    nomeTecnica: row.nome_tecnica || '',
    frontalStrokes: row.frontal_strokes || [],
    profileStrokes: row.profile_strokes || [],
    created_at: row.created_at,
  }
}

export const db = {
  getPatients: async () => {
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(mapRowToPatient)
  },

  getPatient: async (id: string) => {
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id', id)
      .single()
    if (error || !data) return null
    return mapRowToPatient(data)
  },

  updatePatient: async (id: string, updates: Partial<Patient>) => {
    const payload: Record<string, any> = {}

    if (updates.triagem !== undefined) {
      const t = updates.triagem as Record<string, any>
      if (t.nome_completo !== undefined) payload.nome_completo = t.nome_completo
      if (t.idade !== undefined) payload.idade = Number(t.idade) || 0
      if (t.motivo_exame !== undefined) payload.motivo_exame = t.motivo_exame
      const { nome_completo, idade, motivo_exame, ...rest } = t
      payload.dados_triagem = rest as any
    }
    if (updates.dadosExame !== undefined) payload.dados_exame = updates.dadosExame as any
    if (updates.nomeTecnica !== undefined) payload.nome_tecnica = updates.nomeTecnica
    if (updates.frontalStrokes !== undefined) payload.frontal_strokes = updates.frontalStrokes as any
    if (updates.profileStrokes !== undefined) payload.profile_strokes = updates.profileStrokes as any
    if (updates.status !== undefined) payload.status = updates.status

    if (Object.keys(payload).length > 0) {
      payload.updated_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('pacientes')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return mapRowToPatient(data)
  },
}
