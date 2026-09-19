import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractElectoralNumbers,
  detectForensicPatterns,
  verifyInformation,
  generateWhatsAppDebunk
} from '../src/lib/verification-engine';

test('extractElectoralNumbers extracts numbers while ignoring years and phone lines', () => {
  const text = 'Vote 5050 para Deputado em 2026! Ligue para 1491 ou vote 13 no primeiro turno com 50% dos votos.';
  const numbers = extractElectoralNumbers(text);
  assert.ok(numbers.includes('5050'));
  assert.ok(numbers.includes('13'));
  assert.ok(!numbers.includes('2026'));
  assert.ok(!numbers.includes('1491'));
  assert.ok(!numbers.includes('50'));
});

test('detectForensicPatterns identifies viral panic and anonymous source red flags', () => {
  const text = 'URGENTE: COMPARTILHE ANTES QUE APAGUEM! Um amigo do tribunal revelou um áudio vazado do candidato!';
  const alerts = detectForensicPatterns(text);
  assert.ok(alerts.some(a => a.type === 'PANIC_TRIGGER'));
  assert.ok(alerts.some(a => a.type === 'ANONYMOUS_SOURCE'));
  assert.ok(alerts.some(a => a.type === 'DEEPFAKE_SUSPECT'));
});

test('verifyInformation identifies known TSE hoaxes regarding voting machines', async () => {
  const report = await verifyInformation('URGENTE: as urnas eletrônicas têm wi-fi secreto e internet para hackear votos!');
  assert.equal(report.verdict, 'FALSO');
  assert.ok(report.riskScore >= 90);
  assert.ok(report.matchedHoaxes.length > 0);
  assert.ok(report.summary.includes('offline'));
  assert.ok(report.whatsappDebunkMessage.includes('1491'));
});

test('verifyInformation detects candidate ballot number fraud', async () => {
  const report = await verifyInformation('Vote Jones Manoel Deputado Federal número 9999 pelo PSOL Pernambuco');
  assert.equal(report.verdict, 'CRIME_ELEITORAL');
  assert.ok(report.riskScore >= 90);
  assert.ok(report.forensicAlerts.some(a => a.type === 'NUMBER_FRAUD'));
  assert.ok(report.summary.includes('5050'));
  assert.ok(report.whatsappDebunkMessage.includes('5050'));
});

test('verifyInformation confirms authentic candidate registration', async () => {
  const report = await verifyInformation('Jones Manoel número 5050 Deputado Federal PSOL');
  assert.equal(report.verdict, 'CONFIRMADO_TSE');
  assert.ok(report.riskScore <= 15);
  assert.ok(report.matchedCandidates.length > 0);
  assert.equal(report.matchedCandidates[0].numberMatches, true);
});

test('generateWhatsAppDebunk creates polite well-formatted message with official sources', () => {
  const message = generateWhatsAppDebunk(
    'Vote nulo anula eleição',
    'FALSO',
    'Votos nulos não anulam eleição conforme Artigo 77 da CF.',
    {
      id: 'fake-02',
      category: 'regras',
      category_label: 'Regras',
      hoax_claim: '50% anula eleição',
      official_fact: 'Votos nulos não anulam eleição',
      verdict: 'FALSO',
      legal_basis: 'CF/88 Art. 77',
      authority: 'STF/TSE',
      evidence_summary: 'Maioria de votos válidos',
      source_url: 'https://tse.jus.br',
      published_at: '2026-09-10',
      keywords: ['nulo']
    }
  );

  assert.ok(message.includes('*Atenção, pessoal:*'));
  assert.ok(message.includes('CF/88 Art. 77'));
  assert.ok(message.includes('https://tse.jus.br'));
  assert.ok(message.includes('1491'));
});
