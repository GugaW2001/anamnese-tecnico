export type PatientStatus = 'pendente' | 'finalizado'

export interface Patient {
  id: string
  nomeCompleto: string
  telefone: string
  idade: number
  dataAtendimento: string
  status: PatientStatus
  dadosTriagem: {
    motivoConsulta?: string
    historicoFamiliar?: string
    cirurgiasPrevias?: string
    alergias?: string
    medicamentosUso?: string
  }
  dadosExame?: {
    mamasNormais?: boolean
    retracao?: boolean
    verrugas?: boolean
    nodulo?: boolean
    cicatriz?: boolean
    sinaisCutaneos?: boolean
    micronodularidade?: boolean
    areaPuncionada?: boolean
    adensamento?: boolean
    linfonodosAxilares?: boolean
    derramePapilar?: boolean
    descricaoNodulos?: string
    observacoes?: string
  }
  nomeTecnica?: string
  created_at: string
}

const mockData: Patient[] = [
  {
    id: '1',
    nomeCompleto: 'Maria da Silva',
    telefone: '(11) 98765-4321',
    idade: 45,
    dataAtendimento: new Date().toISOString(),
    status: 'pendente',
    dadosTriagem: {
      motivoConsulta: 'Dor na mama direita',
      historicoFamiliar: 'Mãe teve câncer de mama',
      cirurgiasPrevias: 'Nenhuma',
      alergias: 'Dipirona',
      medicamentosUso: 'Nenhum',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    nomeCompleto: 'Ana Paula Souza',
    telefone: '(11) 91234-5678',
    idade: 38,
    dataAtendimento: new Date(Date.now() - 86400000).toISOString(),
    status: 'pendente',
    dadosTriagem: {
      motivoConsulta: 'Rotina',
      historicoFamiliar: 'Nenhum',
      cirurgiasPrevias: 'Cesárea',
      alergias: 'Nenhuma',
      medicamentosUso: 'Anticoncepcional',
    },
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const db = {
  getPatients: async () => {
    await delay(500)
    const stored = localStorage.getItem('pacientes')
    if (!stored) {
      localStorage.setItem('pacientes', JSON.stringify(mockData))
      return mockData
    }
    return JSON.parse(stored) as Patient[]
  },
  getPatient: async (id: string) => {
    await delay(300)
    const patients = await db.getPatients()
    return patients.find((p) => p.id === id) || null
  },
  updatePatient: async (id: string, updates: Partial<Patient>) => {
    await delay(500)
    const patients = await db.getPatients()
    const index = patients.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Patient not found')
    patients[index] = { ...patients[index], ...updates }
    localStorage.setItem('pacientes', JSON.stringify(patients))
    return patients[index]
  },
}
