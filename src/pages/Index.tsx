import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db, Patient } from '@/lib/mock-db'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, RefreshCw, Calendar, Phone, ArrowRight, ClipboardList } from 'lucide-react'
import { format } from 'date-fns'

export default function Index() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadPatients = async () => {
    setLoading(true)
    const data = await db.getPatients()
    setPatients(
      data
        .filter((p) => p.status === 'pendente')
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
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente por nome..."
            className="pl-9 w-full bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={loadPatients}
          disabled={loading}
          className="w-full sm:w-auto bg-card"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar Fila
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-12 px-4 border rounded-xl bg-card border-dashed">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-1">Fila Vazia</h3>
            <p className="text-muted-foreground">
              Não há pacientes pendentes para avaliação no momento.
            </p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="hover:shadow-md hover:border-primary/30 transition-all group overflow-hidden"
            >
              <CardContent className="p-0">
                <Link to={`/paciente/${patient.id}`} className="block p-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {patient.nomeCompleto}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-primary/70" />
                          {format(new Date(patient.dataAtendimento), "dd/MM/yyyy 'às' HH:mm")}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-primary/70" />
                          {patient.telefone}
                        </div>
                      </div>
                    </div>
                    <Button className="shrink-0 w-full sm:w-auto shadow-sm">
                      Iniciar Avaliação
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
