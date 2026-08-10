// src/app/admin/catequese/components/ExportQrPdfButton.tsx
'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

type Props = {
  title: string
  link: string
}

export function ExportQrPdfButton({ title, link }: Props) {
  const [isGenerating, setIsGenerating] = useState(false)

  // Função Sênior: Converte imagem local da pasta /public para Base64 sem erro de CORS
  const getLocalImageBase64 = async (imagePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.src = imagePath
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject('Falha ao criar contexto do canvas')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = (error) => reject(error)
    })
  }

  async function generatePdf() {
    setIsGenerating(true)
    try {
      // 1. Gera o QR Code em Base64
      const qrDataUrl = await QRCode.toDataURL(link, {
        width: 500,
        margin: 2,
        color: {
          dark: '#0f172a', // Cor navy
          light: '#ffffff',
        },
      })

      // 2. Tenta carregar a logo (deve estar em /public/logo.png)
      let logoDataUrl: string | null = null
      try {
        logoDataUrl = await getLocalImageBase64('/logo.png')
      } catch (e) {
        console.warn('Logo não encontrada em /public/logo.png. Gerando cartaz sem logo.')
      }

      // 3. Inicializa o Documento A4
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })
      const pageWidth = doc.internal.pageSize.getWidth()
      let startY = 40 // Eixo Y inicial para o texto

      // 4. Injeta a Logo (se existir)
      if (logoDataUrl) {
        const logoSize = 35 // Tamanho em mm (largura e altura)
        const logoX = (pageWidth - logoSize) / 2
        doc.addImage(logoDataUrl, 'PNG', logoX, 15, logoSize, logoSize)
        startY = 65 // Empurra o restante do conteúdo para baixo
      }

      // Título Principal
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(28)
      doc.setTextColor(15, 23, 42) // #0f172a (navy)
      const titleText = 'Presença da Catequese'
      const titleWidth = doc.getTextWidth(titleText)
      doc.text(titleText, (pageWidth - titleWidth) / 2, startY)

      // Subtítulo (Nome da semana)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(20)
      doc.setTextColor(50, 50, 50)
      const subWidth = doc.getTextWidth(title)
      doc.text(title, (pageWidth - subWidth) / 2, startY + 15)

      // QR Code centralizado
      const qrSize = 110
      const xPos = (pageWidth - qrSize) / 2
      doc.addImage(qrDataUrl, 'PNG', xPos, startY + 40, qrSize, qrSize)

      // Instruções
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(15, 23, 42)
      const instruction = 'Aponte a câmera do celular para registrar sua presença.'
      const instWidth = doc.getTextWidth(instruction)
      doc.text(instruction, (pageWidth - instWidth) / 2, startY + 170)

      // URL de fallback no rodapé
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(100, 100, 100)
      const linkWidth = doc.getTextWidth(link)
      doc.text(link, (pageWidth - linkWidth) / 2, startY + 185)

      // Salva o arquivo
      const fileName = `Cartaz_${title.replace(/\s+/g, '_')}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error('Erro ao gerar PDF do QR Code', error)
      alert('Não foi possível gerar o cartaz em PDF.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={generatePdf}
      disabled={isGenerating}
      className="mt-4 rounded border border-navy px-4 py-2 font-body text-xs font-semibold uppercase tracking-wide text-navy transition-colors hover:bg-navy/5 disabled:opacity-60"
    >
      {isGenerating ? 'Gerando Cartaz...' : 'Imprimir Cartaz A4'}
    </button>
  )
}