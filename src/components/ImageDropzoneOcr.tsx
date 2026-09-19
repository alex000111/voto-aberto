'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { extractTextFromImage, OcrProgress } from '@/lib/ocr-service';

interface ImageDropzoneOcrProps {
  onAudit: (text: string, imageUrl?: string) => void;
  isLoading?: boolean;
}

export const SAMPLE_CASES = [
  {
    id: 'urna',
    title: '🗳️ Boato de Urna & Chip Secreto',
    desc: 'Corrente alegando conexão sem fio oculta.',
    text: 'URGENTE: vazou relatório que as urnas eletrônicas têm placa de internet secreta e chip oculto para transferir votos! Compartilhe antes que apaguem!',
    color: '#ef4444'
  },
  {
    id: 'santinho',
    title: '🛑 Santinho com Número Trocado',
    desc: 'Golpe clássico de número adulterado.',
    text: 'Vote Jones Manoel para Deputado Federal pelo PSOL em Pernambuco. Vote número 9999 para mudar o Brasil!',
    color: '#f59e0b'
  },
  {
    id: 'biometria',
    title: '👤 Corrente de Biometria & INSS',
    desc: 'Ameaça de corte de benefícios sociais.',
    text: 'ATENÇÃO APOSENTADOS: Quem não fizer o recadastramento biométrico terá o CPF cancelado na Receita e o benefício do INSS cortado até a eleição!',
    color: '#8b5cf6'
  },
  {
    id: 'pesquisa',
    title: '📊 Pesquisa Sem Registro no TSE',
    desc: 'Percentuais fabricados sem PesqEle.',
    text: 'Pesquisa secreta interna mostra candidato vencendo com 80% das intenções de voto no primeiro turno!',
    color: '#06b6d4'
  }
];

export default function ImageDropzoneOcr({ onAudit, isLoading = false }: ImageDropzoneOcrProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<OcrProgress>({ status: '', progress: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  // Processa arquivo de imagem (seja via upload, drag-and-drop ou paste)
  const processImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, insira um arquivo de imagem válido (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setIsProcessingOcr(true);
      setOcrProgress({ status: 'Preparando imagem para o OCR...', progress: 0.1 });

      try {
        const ocrResult = await extractTextFromImage(file, (p) => {
          setOcrProgress(p);
        });

        if (ocrResult.text) {
          setExtractedText(ocrResult.text);
          // Opcional: já aciona a auditoria se o texto extraído for claro
          onAudit(ocrResult.text, dataUrl);
        } else {
          setExtractedText('Não foi possível reconhecer o texto automaticamente. Você pode digitar ou ajustar o texto da imagem abaixo:');
        }
      } catch (err) {
        console.error('Erro no processamento de OCR:', err);
      } finally {
        setIsProcessingOcr(false);
      }
    };
    reader.readAsDataURL(file);
  }, [onAudit]);

  // Listener para capturar colar imagens da área de transferência (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processImageFile]);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleApplySample = (sample: typeof SAMPLE_CASES[0]) => {
    setImagePreview(null);
    setExtractedText(sample.text);
    onAudit(sample.text);
  };

  const handleClear = () => {
    setImagePreview(null);
    setExtractedText('');
    setOcrProgress({ status: '', progress: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="card" style={{ padding: '28px', border: '1px solid var(--line-strong)', marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '24px' }}>🔬</span>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>
          Laboratório Multimodal: Leitor de Imagens & Scanner de Boatos
        </h2>
      </div>
      <p style={{ margin: '0 0 20px', color: 'var(--ink-light)', fontSize: '14.5px', lineHeight: 1.6 }}>
        Tirou um print do WhatsApp, viu uma postagem no X ou recebeu uma foto de santinho suspeito?
        Pressione <strong>Ctrl + V</strong> em qualquer lugar, arraste o arquivo ou digite abaixo para auditar a veracidade na base oficial de <strong>20.984 candidatos do TSE</strong> e agências de checagem.
      </p>

      {/* Exemplos Rápidos com 1 Clique */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          💡 Testar com Casos Frequentes de Desinformação (1 Clique):
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {SAMPLE_CASES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleApplySample(sample)}
              className="btn secondary"
              style={{
                textAlign: 'left',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                borderRadius: '10px',
                borderLeft: `4px solid ${sample.color}`,
                cursor: 'pointer'
              }}
            >
              <span style={{ fontWeight: 750, fontSize: '13px', color: 'var(--ink)' }}>{sample.title}</span>
              <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{sample.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Área de Dropzone e Paste de Imagem */}
      <div
        ref={dropzoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging ? '2px dashed var(--blue)' : '2px dashed var(--line-strong)',
          borderRadius: '14px',
          background: isDragging ? 'var(--blue-subtle)' : 'var(--surface-subtle)',
          padding: '24px',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          marginBottom: '20px'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-upload-ocr"
        />

        {imagePreview ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', maxWidth: '340px', maxHeight: '220px', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--line)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Imagem carregada para auditoria"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn secondary"
                onClick={handleClear}
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                ✕ Remover Imagem
              </button>
              <button
                type="button"
                className="btn secondary"
                onClick={() => fileInputRef.current?.click()}
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                🔄 Trocar Imagem
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '36px' }}>📋 📷</div>
            <div style={{ fontSize: '15px', fontWeight: 750 }}>
              Cole uma imagem (<kbd style={{ background: 'var(--surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--line)', fontSize: '12px' }}>Ctrl + V</kbd>) ou arraste o print aqui
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
              Suporta capturas de tela do WhatsApp, Twitter/X, Instagram, panfletos e fotos de santinhos
            </div>
            <button
              type="button"
              className="btn secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{ marginTop: '8px', fontSize: '13px', padding: '8px 18px' }}
            >
              📁 Selecionar Arquivo do Computador/Celular
            </button>
          </div>
        )}

        {/* Barra de Progresso do OCR */}
        {isProcessingOcr && (
          <div style={{ marginTop: '16px', maxWidth: '400px', marginInline: 'auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--blue)', marginBottom: '6px' }}>
              {ocrProgress.status} ({Math.round(ocrProgress.progress * 100)}%)
            </div>
            <div style={{ height: '6px', background: 'var(--line)', borderRadius: '6px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.round(ocrProgress.progress * 100)}%`,
                  background: 'var(--blue)',
                  transition: 'width 0.2s ease'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Caixa de Texto Extraído / Digitação Manual */}
      <div>
        <label htmlFor="audit-text-input" style={{ display: 'block', fontSize: '13px', fontWeight: 750, marginBottom: '8px', color: 'var(--ink)' }}>
          Texto para Auditoria (extraído da imagem ou digitado diretamente):
        </label>
        <textarea
          id="audit-text-input"
          value={extractedText}
          onChange={(e) => setExtractedText(e.target.value)}
          placeholder="Cole ou digite aqui a mensagem suspeita, corrente de WhatsApp, alegação sobre urnas ou dados de candidatos..."
          rows={4}
          style={{
            width: '100%',
            borderRadius: '10px',
            border: '1px solid var(--line)',
            padding: '14px',
            fontFamily: 'inherit',
            fontSize: '14px',
            lineHeight: 1.6,
            background: 'var(--surface)',
            color: 'var(--ink)',
            resize: 'vertical',
            marginBottom: '14px'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
            {extractedText.length > 0 ? `${extractedText.length} caracteres analisados` : 'Dica: Cole o texto ou imagem da alegação eleitoral.'}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {extractedText && (
              <button
                type="button"
                className="btn secondary"
                onClick={handleClear}
                style={{ fontSize: '13px', padding: '10px 18px' }}
              >
                Limpar
              </button>
            )}
            <button
              type="button"
              className="btn"
              disabled={!extractedText.trim() || isLoading || isProcessingOcr}
              onClick={() => onAudit(extractedText, imagePreview || undefined)}
              style={{
                fontSize: '14px',
                fontWeight: 750,
                padding: '10px 24px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                color: '#ffffff'
              }}
            >
              {isLoading ? (
                <>
                  <span className="live-dot" style={{ background: '#ffffff', boxShadow: '0 0 6px #ffffff' }} />
                  Pesquisando em 20.984 Registros...
                </>
              ) : (
                <>
                  <span>🔍</span> Auditar Informação nas Bases Oficiais
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
