import { Link } from 'expo-router';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const modules = [
  {
    title: 'Candidaturas',
    description: 'Perfis oficiais, registro, coligações e situação cadastral no TSE.',
    href: '/candidaturas',
    tag: 'TSE / DADOS ABERTOS'
  },
  {
    title: 'E o Recife?',
    description: 'Indicadores municipais (saúde, educação, mobilidade) e competências do Art. 30.',
    href: '/recife',
    tag: 'IMPACTO LOCAL'
  },
  {
    title: 'Pesquisas Eleitorais',
    description: 'Institutos, amostras, datas e protocolos oficiais registrados no PesqEle.',
    href: '/pesquisas',
    tag: 'PESQUISAS'
  },
  {
    title: 'Comparador de Propostas',
    description: 'Diretrizes oficiais registradas confrontadas por tema com número de página.',
    href: '/comparador',
    tag: 'PLANOS DE GOVERNO'
  },
  {
    title: 'Como Verificamos',
    description: 'Metodologia aberta, neutralidade estrita e rastreabilidade de evidências.',
    href: '/sobre',
    tag: 'TRANSPARÊNCIA'
  }
];

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>OBSERVATÓRIO ELEITORAL</Text>
          <Text style={styles.title}>Informação verificável. Decisão é sua.</Text>
          <Text style={styles.lead}>
            Acompanhe dados eleitorais oficiais com fonte primária, data de coleta e histórico de alterações. Sem pontuação nem recomendação de voto.
          </Text>
        </View>

        <View style={styles.menu}>
          {modules.map(m => (
            <Link key={m.title} href={m.href as any} asChild>
              <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTag}>{m.tag}</Text>
                <Text style={styles.cardTitle}>{m.title}</Text>
                <Text style={styles.cardDesc}>{m.description}</Text>
                <Text style={styles.cardAction}>Acessar →</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20, gap: 20 },
  hero: { gap: 10, paddingVertical: 10 },
  eyebrow: { fontSize: 11, fontWeight: '800', color: '#165dff', letterSpacing: 1.5 },
  title: { fontSize: 32, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5, lineHeight: 38 },
  lead: { fontSize: 15, color: '#64748b', lineHeight: 22 },
  menu: { gap: 14 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#e2e8f0', gap: 6 },
  cardTag: { fontSize: 10, fontWeight: '800', color: '#165dff', letterSpacing: 0.8 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  cardDesc: { fontSize: 13, color: '#64748b', lineHeight: 18 },
  cardAction: { fontSize: 13, fontWeight: '700', color: '#165dff', marginTop: 4 }
});