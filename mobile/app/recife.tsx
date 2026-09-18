import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const topics = [
  {
    slug: 'mobilidade',
    title: 'Mobilidade Urbana',
    indicators: [
      { metric: 'Tempo médio de deslocamento diário', value: '96 min', source: 'Ipea' },
      { metric: 'Frota total de veículos', value: '~730 mil', source: 'Senatran' },
      { metric: 'Malha cicloviária implantada', value: '185 km', source: 'CTTU' }
    ],
    municipalRole: 'Gestão de trânsito (CTTU), engenharia de tráfego, ciclovias e calçadas.',
    stateRole: 'Linhas intermunicipais de ônibus (Grande Recife) e rodovias estaduais.',
    federalRole: 'Metrô do Recife (CBTU) e rodovias federais (BR-101, BR-232).'
  },
  {
    slug: 'saude',
    title: 'Saúde Pública',
    indicators: [
      { metric: 'Cobertura da Atenção Básica', value: '67,4%', source: 'Ministério da Saúde' },
      { metric: 'Unidades Básicas e Policlínicas', value: '148 unidades', source: 'Secretaria de Saúde' }
    ],
    municipalRole: 'Postos de saúde (UBS/USF), vacinação e agentes comunitários.',
    stateRole: 'Hospitais de média e alta complexidade (HR, Agamenon, Otávio) e regulação.',
    federalRole: 'Repasses do SUS (FNS) e programas federais de saúde.'
  },
  {
    slug: 'educacao',
    title: 'Educação Básica',
    indicators: [
      { metric: 'IDEB — Anos Iniciais', value: '5,8', source: 'INEP / MEC' },
      { metric: 'IDEB — Anos Finais', value: '4,9', source: 'INEP / MEC' }
    ],
    municipalRole: 'Educação Infantil (creches) e Ensino Fundamental (1º ao 9º ano).',
    stateRole: 'Ensino Médio e escolas técnicas (ETEs).',
    federalRole: 'Universidades e institutos federais (UFPE, UFRPE, IFPE).'
  },
  {
    slug: 'saneamento',
    title: 'Saneamento & Habitação',
    indicators: [
      { metric: 'Atendimento com esgotamento', value: '46,8%', source: 'SNIS' },
      { metric: 'Moradores em áreas de morro/risco', value: '> 400 mil hab', source: 'Defesa Civil' }
    ],
    municipalRole: 'Drenagem urbana, contenção de encostas e Defesa Civil.',
    stateRole: 'Concessão de água e esgoto (Compesa / PPP).',
    federalRole: 'Recursos do FNHIS e programas habitacionais federais.'
  }
];

export default function RecifeScreen() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>IMPACTO MUNICIPAL</Text>
        <Text style={styles.title}>E o Recife?</Text>
        <Text style={styles.subtitle}>
          Indicadores oficiais da cidade e divisão de competências constitucionais (Art. 30 da CF/88).
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsContainer}>
          {topics.map(t => {
            const active = t.slug === selectedTopic.slug;
            return (
              <TouchableOpacity
                key={t.slug}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setSelectedTopic(t)}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{t.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{selectedTopic.title}</Text>

          <Text style={styles.sectionHeader}>Indicadores Oficiais</Text>
          {selectedTopic.indicators.map((ind, i) => (
            <View key={i} style={styles.metricRow}>
              <Text style={styles.metricValue}>{ind.value}</Text>
              <Text style={styles.metricLabel}>{ind.metric}</Text>
              <Text style={styles.metricSource}>Fonte: {ind.source}</Text>
            </View>
          ))}

          <Text style={styles.sectionHeader}>Competências (Art. 30 CF/88)</Text>
          <View style={styles.roleBox}>
            <Text style={styles.roleTitleMunicipal}>Município (Prefeitura/Vereadores):</Text>
            <Text style={styles.roleText}>{selectedTopic.municipalRole}</Text>
          </View>
          <View style={styles.roleBox}>
            <Text style={styles.roleTitleState}>Estado (Governo/ALEPE):</Text>
            <Text style={styles.roleText}>{selectedTopic.stateRole}</Text>
          </View>
          <View style={styles.roleBox}>
            <Text style={styles.roleTitleFederal}>União (Governo Federal/Congresso):</Text>
            <Text style={styles.roleText}>{selectedTopic.federalRole}</Text>
          </View>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            Fonte antes de opinião. Dados compilados de fontes oficiais públicas.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20, gap: 16 },
  eyebrow: { fontSize: 11, fontWeight: '800', color: '#165dff', letterSpacing: 1.2 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', lineHeight: 20 },
  pillsContainer: { marginVertical: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8 },
  pillActive: { backgroundColor: '#165dff', borderColor: '#165dff' },
  pillText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  pillTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#e2e8f0', gap: 12 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  sectionHeader: { fontSize: 14, fontWeight: '700', color: '#475569', marginTop: 8, textTransform: 'uppercase' },
  metricRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  metricValue: { fontSize: 22, fontWeight: '800', color: '#165dff' },
  metricLabel: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  metricSource: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  roleBox: { padding: 10, backgroundColor: '#f8fafc', borderRadius: 8, marginTop: 4 },
  roleTitleMunicipal: { fontSize: 12, fontWeight: '800', color: '#165dff', marginBottom: 2 },
  roleTitleState: { fontSize: 12, fontWeight: '800', color: '#0f766e', marginBottom: 2 },
  roleTitleFederal: { fontSize: 12, fontWeight: '800', color: '#475569', marginBottom: 2 },
  roleText: { fontSize: 12, color: '#334155', lineHeight: 17 },
  footerNote: { padding: 12, backgroundColor: '#eff6ff', borderRadius: 10, marginTop: 8 },
  footerText: { fontSize: 12, color: '#1e40af', textAlign: 'center' }
});