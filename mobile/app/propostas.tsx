import { SafeAreaView, ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const mockPropostas = [
  {
    id: '1',
    candidate_name: 'Raquel Lyra',
    office: 'GOVERNADOR (PE)',
    topic: 'Educação',
    summary: [
      'Expansão do modelo de Escolas em Tempo Integral.',
      'Reestruturação do plano de cargos docente.',
      'Conectividade e laboratórios de tecnologia.'
    ]
  },
  {
    id: '2',
    candidate_name: 'João Campos',
    office: 'GOVERNADOR (PE)',
    topic: 'Saúde',
    summary: [
      'Prontuário eletrônico unificado.',
      'Cofinanciamento estadual da Atenção Básica.',
      'Centros de especialidades médicas com telemedicina.'
    ]
  },
  {
    id: '3',
    candidate_name: 'Luiz Inácio Lula da Silva',
    office: 'PRESIDENTE (BR)',
    topic: 'Educação',
    summary: [
      'Consolidação do Programa Pé-de-Meia.',
      'Abertura de 100 novos campi de IFs.',
      'Reajuste das bolsas de pós-graduação.'
    ]
  },
  {
    id: '4',
    candidate_name: 'Tarcísio de Freitas',
    office: 'PRESIDENTE (BR)',
    topic: 'Educação',
    summary: [
      'Foco prioritário em alfabetização e formação técnica.',
      'Incentivo a parcerias público-privadas.',
      'Mecanismos de bonificação por metas.'
    ]
  },
  {
    id: '5',
    candidate_name: 'Jones Manoel',
    office: 'DEPUTADO FEDERAL (PE)',
    topic: 'Trabalho e Direitos',
    summary: [
      'Redução da jornada máxima para 30 horas semanais.',
      'Revogação das contrarreformas.',
      'Regulamentação de direitos a trabalhadores de apps.'
    ]
  }
];

export default function Propostas() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>💡 ASSISTENTE CÍVICO</Text>
        <Text style={styles.title}>Propostas e Resumos</Text>
        <Text style={styles.lead}>
          Leitura rápida gerada por Inteligência Artificial a partir das diretrizes oficiais protocoladas no TSE.
        </Text>

        <View style={styles.list}>
          {mockPropostas.map(p => (
            <View key={p.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.topicBadge}>{p.topic}</Text>
                <Text style={styles.candidateName}>{p.candidate_name}</Text>
                <Text style={styles.office}>{p.office}</Text>
              </View>
              
              <Text style={styles.summaryTitle}>⚡ RESUMO EXECUTIVO</Text>
              {p.summary.map((item, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
              
              <TouchableOpacity style={styles.btnOutline}>
                <Text style={styles.btnOutlineText}>Ver documento oficial ↗</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20 },
  eyebrow: { fontSize: 11, fontWeight: '800', color: '#059669', letterSpacing: 1.5, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  lead: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 24 },
  list: { gap: 16 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 12 },
  topicBadge: { alignSelf: 'flex-start', backgroundColor: '#e0e7ff', color: '#3730a3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 10, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  candidateName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  office: { fontSize: 13, color: '#64748b', marginTop: 2 },
  summaryTitle: { fontSize: 11, fontWeight: 'bold', color: '#1d4ed8', marginBottom: 10 },
  bulletRow: { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' },
  bulletPoint: { color: '#1d4ed8', fontSize: 16, marginRight: 6, lineHeight: 20 },
  bulletText: { fontSize: 14, color: '#334155', lineHeight: 20, flex: 1 },
  btnOutline: { marginTop: 16, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#1d4ed8', alignItems: 'center' },
  btnOutlineText: { color: '#1d4ed8', fontWeight: 'bold' }
});
