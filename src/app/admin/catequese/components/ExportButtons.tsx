// src/app/admin/catequese/components/ExportButtons.tsx
'use client'

import { STAGE_LABELS } from '@/lib/catechism'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type AttendanceData = {
  id: string;
  studentName: string;
  stage: string;
  catechistName: string;
  massLabel: string;
  createdAt: Date;
  source: string;
  week: { title: string };
}

export function ExportButtons({ data }: { data: AttendanceData[] }) {
  
  function exportToCSV() {
    if (data.length === 0) return

    const headers = ['Data', 'Semana', 'Catequizando', 'Etapa', 'Catequista', 'Missa', 'Origem']
    const rows = data.map(a => [
      new Date(a.createdAt).toLocaleDateString('pt-BR'),
      a.week?.title || '',
      a.studentName,
      STAGE_LABELS[a.stage] ?? a.stage,
      a.catechistName,
      a.massLabel,
      a.source === 'SELF' ? 'Auto-atribuída' : 'Manual'
    ])

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio_catequese_${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function exportToPDF() {
    if (data.length === 0) return

    const doc = new jsPDF()
    
    // Configuração do Cabeçalho do PDF
    doc.setFontSize(16)
    doc.text('Relatório de Presenças - Catequese', 14, 15)
    
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 22)

    // Preparação dos dados para a tabela
    const tableColumn = ["Data", "Semana", "Catequizando", "Etapa", "Catequista", "Missa"]
    const tableRows = data.map(a => [
      new Date(a.createdAt).toLocaleDateString('pt-BR'),
      a.week?.title || '-',
      a.studentName,
      STAGE_LABELS[a.stage] ?? a.stage,
      a.catechistName,
      a.massLabel
    ])

    // Geração da tabela usando autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      theme: 'grid',
      styles: { fontSize: 8, font: 'helvetica' },
      headStyles: { fillColor: [15, 23, 42] }, // Cor navy (#0f172a) para combinar com a identidade visual
    })

    doc.save(`relatorio_catequese_${Date.now()}.pdf`)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToCSV}
        className="rounded border border-navy px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wide text-navy hover:bg-navy hover:text-cream transition-colors"
      >
        Exportar CSV
      </button>
      <button
        onClick={exportToPDF}
        className="rounded border border-navy px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wide text-navy hover:bg-navy hover:text-cream transition-colors"
      >
        Exportar PDF
      </button>
    </div>
  )
}