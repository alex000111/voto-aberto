import { NextRequest, NextResponse } from 'next/server';
import { verifyInformation } from '@/lib/verification-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body?.text === 'string' ? body.text.trim() : '';

    if (!text) {
      return NextResponse.json(
        { error: 'Parâmetro "text" é obrigatório para a auditoria de veracidade.' },
        { status: 400 }
      );
    }

    const report = await verifyInformation(text);
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro interno ao processar a auditoria de veracidade.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  if (!q.trim()) {
    return NextResponse.json(
      { error: 'Informe o parâmetro ?q= para realizar a consulta de checagem.' },
      { status: 400 }
    );
  }
  const report = await verifyInformation(q);
  return NextResponse.json({ success: true, report });
}
