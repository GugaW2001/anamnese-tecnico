import jsPDF from 'jspdf'

interface PDFData {
  nomeCompleto: string
  idade: number
  telefone: string
  dataAtendimento: string
  nomeTecnica: string
  triagem: Record<string, any>
  dadosExame: Record<string, any>
  frontalCanvas?: HTMLCanvasElement | null
  profileCanvas?: HTMLCanvasElement | null
  returnBlob?: boolean
}

export async function generatePDF(data: PDFData): Promise<Blob | void> {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let y = margin

  const addHeader = () => {
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Ficha de Anamnese Mamária', pageWidth / 2, y, { align: 'center' })
    y += 8
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.text(`Data: ${new Date(data.dataAtendimento).toLocaleDateString('pt-BR')}`, margin, y)
    y += 6
    doc.line(margin, y, pageWidth - margin, y)
    y += 6
  }

  const addSection = (title: string) => {
    if (y > 260) { doc.addPage(); y = margin }
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin, y)
    y += 2
    doc.setDrawColor(100)
    doc.line(margin, y, pageWidth - margin, y)
    y += 6
  }

  const addField = (label: string, value: string | number | undefined | null) => {
    if (y > 270) { doc.addPage(); y = margin }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    const displayValue = value != null && value !== '' ? String(value) : '__________________'
    const text = `${label}: `
    const textWidth = doc.getTextWidth(text)
    doc.text(text, margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(displayValue, margin + textWidth, y)
    y += 6
  }

  const addMultiField = (label: string, value: string) => {
    if (y > 260) { doc.addPage(); y = margin }
    if (label) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(`${label}:`, margin, y)
      y += 5
    }
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(value || '__________________', pageWidth - margin * 2)
    lines.forEach((line: string) => {
      if (y > 275) { doc.addPage(); y = margin }
      doc.text(line, margin, y)
      y += 5
    })
    y += 2
  }

  const simNao = (v: string) => v === 'sim' ? 'Sim' : v === 'nao' ? 'Não' : v || ''

  const fieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      nome_completo: 'Nome Completo', idade: 'Idade', motivo_exame: 'Motivo do Exame',
      idade_menarca: 'Idade da Menarca', menopausa: 'Menopausa', idade_menopausa: 'Idade da Menopausa',
      cirurgia_previa_mama: 'Cirurgia Prévia na Mama', motivo_cirurgia: 'Motivo da Cirurgia',
      radioterapia: 'Radioterapia', periodo_radioterapia: 'Período da Radioterapia',
      braquiterapia: 'Braquiterapia', periodo_braquiterapia: 'Período da Braquiterapia',
      quimioterapia: 'Quimioterapia', periodo_quimioterapia: 'Período da Quimioterapia',
      medicacoes_atuais: 'Medicações Atuais', tabagismo: 'Tabagismo',
      historico_familiar_cancer_mama: 'Histórico Familiar de Câncer de Mama',
      grau_parentesco: 'Grau de Parentesco', exames_anteriores: 'Exames Anteriores',
      observacoes: 'Observações e Queixas Atuais',
    }
    return labels[key] || key
  }

  addHeader()

  addSection('1. Dados do Paciente')
  addField('Nome Completo', data.nomeCompleto)
  addField('Idade', `${data.idade} anos`)
  addField('Telefone', data.telefone)

  addSection('2. Anamnese / Questionário')
  const triagem = data.triagem || {}
  Object.entries(triagem).forEach(([key, value]) => {
    const label = fieldLabel(key)
    let displayVal = value as string
    if (['menopausa', 'radioterapia', 'braquiterapia', 'quimioterapia', 'tabagismo', 'cirurgia_previa_mama', 'historico_familiar_cancer_mama'].includes(key)) {
      displayVal = simNao(displayVal)
    }
    if (key === 'observacoes') {
      addMultiField(label, displayVal)
    } else {
      addField(label, displayVal as string)
    }
  })

  addSection('3. Dados Técnicos do Exame')
  addField('Nome da Técnica', data.nomeTecnica)
  addField('Data do Atendimento', new Date(data.dataAtendimento).toLocaleDateString('pt-BR'))

  addSection('4. Achados Clínicos')
  const achados = (data.dadosExame?.achadosClinicos || {}) as Record<string, string>
  const achadoLabels: Record<string, string> = {
    retracao: 'Retração', verrugas: 'Verrugas', nodulo: 'Nódulo', cicatriz: 'Cicatriz',
    sinais_cutaneos: 'Sinais cutâneos', linfonodos_axilares: 'Linfonodos axilares',
    derrame_papila: 'Derrame da papila', retro_vertido: 'Retro vertido',
  }
  const hasAchados = Object.keys(achados).length > 0
  if (hasAchados) {
    Object.entries(achados).forEach(([key, value]) => {
      addField(achadoLabels[key] || key, value)
    })
  } else {
    addField('Achados', 'Nenhum registro')
  }

  if (data.dadosExame?.descricaoTecnicaImagens) {
    addSection('5. Descrição Técnica das Imagens')
    addMultiField('', data.dadosExame.descricaoTecnicaImagens)
  }

  if (data.dadosExame?.observacoes) {
    addSection('6. Observações Complementares')
    addMultiField('', data.dadosExame.observacoes)
  }

  addSection('7. Diagramas Anatômicos')

  const addCanvasToPDF = (canvas: HTMLCanvasElement | null | undefined, title: string) => {
    if (!canvas) return
    const imgData = canvas.toDataURL('image/png')
    const imgWidth = pageWidth - margin * 2
    const imgHeight = (canvas.height / canvas.width) * imgWidth
    const maxH = 80
    const h = Math.min(imgHeight, maxH)
    const w = (canvas.width / canvas.height) * h
    const xOffset = (pageWidth - w) / 2
    if (y + h + 12 > 280) { doc.addPage(); y = margin }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin, y)
    y += 5
    doc.addImage(imgData, 'PNG', xOffset, y, w, h)
    y += h + 8
  }

  addCanvasToPDF(data.frontalCanvas, 'a) Vista Frontal (Anteroposterior)')
  addCanvasToPDF(data.profileCanvas, 'b) Vista em Perfil (Lateral/Oblíqua)')

  if (y > 250) doc.addPage()
  y = Math.max(y, margin)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  const footerY = Math.min(y + 10, 280)
  doc.text(`Documento gerado em ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, footerY, { align: 'center' })
  doc.text(`Técnica responsável: ${data.nomeTecnica || '__________________'}`, pageWidth / 2, footerY + 5, { align: 'center' })
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3)

  if (data.returnBlob) {
    return doc.output('blob')
  }

  const fileName = `anamnese_${data.nomeCompleto.replace(/\s+/g, '_')}.pdf`
  doc.save(fileName)
}
