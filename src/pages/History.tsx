import { useState, useEffect } from 'react'
import { db, Patient } from '@/lib/mock-db'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Calendar, Phone, CheckCircle, FileText } from 'lucide-react'
import { format } from 'date-fns'

export default function History() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadPatients = async () => {
    setLoading(true)
    const data = await db.getPatients()
    setPatients(
      data
        .filter((p) => p.status === 'finalizado')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    )
    setLoading(false)
  }

  useEffect(() => {
    loadPatients()
  }, [])

  const filteredPatients = patients.filter((p) =>
    p.nomeCompleto.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar paciente finalizado..."
          className="pl-9 w-full bg-card"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-12 px-4 border rounded-xl bg-card border-dashed">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-1">Sem Histórico</h3>
            <p className="text-muted-foreground">Nenhum atendimento finalizado encontrado.</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="opacity-90">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {patient.nomeCompleto}
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(patient.dataAtendimento), "dd/MM/yyyy 'às' HH:mm")}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        {patient.telefone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-green-700 font-semibold bg-green-100 px-4 py-2 rounded-full text-sm border border-green-200">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizado
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
