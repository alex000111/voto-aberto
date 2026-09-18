import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const proposalsByTopic = [
  {
    topic: 'Educação Básica e Superior',
    candA: {
      name: 'Diretriz A (Governador)',
      excerpt: 'Ampliação de escolas em tempo integral com foco em ensino médio técnico integrado.',
      page: 14
    },
    candB: {
      name: 'Diretriz B (Governador)',
      excerpt: 'Fortalecimento da infraestrutura física escolar e plano de valorização dos professores.',
      page: 20
    }
  },
  {
    topic: 'Saúde Pública',
    candA: {
      name: 'Diretriz A (Governador)',
      excerpt: 'Modernização digital dos hospitais estaduais e ampliação de leitos de retaguarda.',
      page: 22
    },
    candB: {
      name: 'Diretriz B (Governador)',
      excerpt: 'Cofinanciamento estadual da Atenção Básica e reforço de policlínicas regionais.',
      page: 18
    }
  },
  {
    topic: 'Mobilidade Urbana',
    candA: {
      name: 'Diretriz A (Governador)',
      excerpt: 'Priorização de corredores exclusivos de ônibus e modernização do sistema de bilhetagem.',
      page: 31
    },
    candB: {
      name: 'Diretriz B (Governador)',
      excerpt: 'Articulação federal para renovação da frota e ampliação de linhas do Metrô do Recife.',
      page: 26
    }
  }
];

export default function ComparadorScreen() {
  const [selectedTopic, setSelectedTopic] = useState(0);
  const current = proposalsByTopic[selectedTopic];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>DOCUMENTOS OFICIAIS</Text>
        <Text style={styles.title}>Comparador</Text>
        <Text style={styles.subtitle}>
          Compare diretrizes registradas no TSE para o mesmo cargo e tema, com indicação exata de página.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
          {proposalsByTopic.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.tab, idx === selectedTopic && styles.tabActive]}
              onPress={() => setSelectedTopic(idx)}
            >
              <Text style={[styles.tabText, idx === selectedTopic && styles.tabTextActive]}>
                {item.topic}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.card}>
          <Text style={styles.candHeader}>{current.candA.name}</Text>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>“{current.candA.excerpt}”</Text>
          </View>
          <Text style={styles.pageText}>Documento TSE · Página {current.candA.page}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.candHeader}>{current.candB.name}</Text>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>“{current.candB.excerpt}”</Text>
          </View>
          <Text style={styles.pageText}>Documento TSE · Página {current.candB.page}</Text>
        </View>

        <View style={styles.neutralityBox}>
          <Text style={styles.neutralityText}>
            Não há pontuação nem atribuição de notas. Ausência de trecho não indica ausência de proposta geral.
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
  subtitle: { fontSize: 13, color: '#64748b', lineHeight: 18 },
  tabs: { marginVertical: 4 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8 },
  tabActive: { backgroundColor: '#165dff', borderColor: '#165dff' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  tabTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#e2e8f0', gap: 8 },
  candHeader: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  quoteBox: { backgroundColor: '#f8fafc', borderLeftWidth: 3, borderLeftColor: '#165dff', padding: 12, borderRadius: 6 },
  quoteText: { fontSize: 14, color: '#1e293b', fontStyle: 'italic', lineHeight: 20 },
  pageText: { fontSize: 11, color: '#94a3b8' },
  neutralityBox: { backgroundColor: '#eff6ff', borderRadius: 10, padding: 12, marginTop: 4 },
  neutralityText: { fontSize: 12, color: '#1e40af', textAlign: 'center', lineHeight: 16 }
});