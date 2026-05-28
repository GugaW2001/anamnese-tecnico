export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pacientes: {
        Row: {
          id: string
          registro_id: string
          nome_completo: string
          telefone: string | null
          data_atendimento: string
          idade: number
          motivo_exame: string
          dados_triagem: Json
          dados_exame: Json | null
          nome_tecnica: string | null
          frontal_strokes: Json | null
          profile_strokes: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          registro_id: string
          nome_completo: string
          telefone?: string | null
          data_atendimento: string
          idade: number
          motivo_exame: string
          dados_triagem?: Json
          dados_exame?: Json | null
          nome_tecnica?: string | null
          frontal_strokes?: Json | null
          profile_strokes?: Json | null
          status?: string
        }
        Update: {
          dados_exame?: Json | null
          nome_tecnica?: string | null
          frontal_strokes?: Json | null
          profile_strokes?: Json | null
          status?: string
          dados_triagem?: Json
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
