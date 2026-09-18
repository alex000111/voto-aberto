import { useState } from 'react';
import { SafeAreaView, FlatList, Text, View, StyleSheet } from 'react-native';

interface PollItem {
  id: string;
  protocol: string;
  institute: string;
  contractor: string;
  dates: string;
  sampleSize: number;
  scope: string;
  source: string;
}

const samplePolls: PollItem[] = [
  {
    id: 'poll-1',
    protocol: 'PE-04192/2026',
    institute: 'Instituto de Pesquisas Regional',
    contractor: 'Empresa Jornalística de Pernambuco',
    dates: '10/09/2026 a 13/09/2026',
    sampleSize: 1200,
    scope: 'PERNAMBUCO — GOVERNADOR',
    source: 'TSE — PesqEle'
  },
  {
    id: 'poll-2',
    protocol: 'BR-08912/2026',
    institute: 'Centro Brasileiro de Estatística',
    contractor: 'Associação Nacional de Comunicação',
    dates: '12/09/2026 a 15/09/2026',
    sampleSize: 2000,
    scope: 'BRASIL — PRESIDENTE',
    source: 'TSE — PesqEle'
  }
];

export default function PesquisasScreen() {
  const [polls] = useState<PollItem[]>(samplePolls);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CONTEXTO ELEITORAL</Text>
        <Text style={styles.title}>Pesquisas Registradas</Text>
        <Text style={styles.subtitle}>
          Dados protocolados no TSE (PesqEle) com período de campo, contratante e tamanho amostral.
        </Text>
      </View>

      <FlatList
        data={polls}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.protocolBadge}>{item.protocol}</Text>
              <Text style={styles.scopeText}>{item.scope}</Text>
            </View>
            <Text style={styles.instituteText}>{item.institute}</Text>
            <Text style={styles.detailText}>Contratante: {item.contractor}</Text>
            <Text style={styles.detailText}>Período de campo: {item.dates}</Text>
            <Text style={styles.detailText}>Amostra: {item.sampleSize.toLocaleString('pt-BR')} entrevistados</Text>
            <View style={styles.sourceRow}>
              <Text style={styles.sourceText}>Fonte primária: {item.source}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, paddingBottom: 10, gap: 6 },
  eyebrow: { fontSize: 11, fontWeight: '800', color: '#165dff', letterSpacing: 1.2 },
  title: { fontSize: 26, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', lineHeight: 18 },
  list: { padding: 20, paddingTop: 6, gap: 14 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', gap: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  protocolBadge: { backgroundColor: '#eef2f7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 11, fontWeight: '700', color: '#334155' },
  scopeText: { fontSize: 11, fontWeight: '700', color: '#165dff' },
  instituteText: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginTop: 4 },
  detailText: { fontSize: 13, color: '#475569', lineHeight: 18 },
  sourceRow: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  sourceText: { fontSize: 11, color: '#94a3b8' }
});