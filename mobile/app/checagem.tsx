import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function Checagem() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/checagem/verificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ verdict: 'ERROR', details: 'Não foi possível conectar ao motor de verificação.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>🛡️ SEGURANÇA DA INFORMAÇÃO</Text>
        <Text style={styles.title}>Radar Anti-Fake News</Text>
        <Text style={styles.lead}>
          Cole aqui o texto daquela corrente de WhatsApp ou notícia suspeita. Nossa inteligência artificial cruzará as informações com dados do TSE.
        </Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Ex: Urna eletrônica não é segura e foi fraudada..."
            multiline
            numberOfLines={5}
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.btn} onPress={handleVerify} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verificar Fatos</Text>}
          </TouchableOpacity>
        </View>

        {result && (
          <View style={[styles.card, { marginTop: 20 }]}>
            <Text style={styles.resultTitle}>
              Resultado: {result.verdict}
            </Text>
            {result.riskScore !== undefined && (
              <Text style={{ marginVertical: 10, fontSize: 15 }}>
                Risco de Desinformação: <Text style={{ fontWeight: 'bold' }}>{result.riskScore}%</Text>
              </Text>
            )}
            <Text style={styles.resultDetails}>{result.details}</Text>
          </View>
        )}
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
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 120,
    marginBottom: 16,
    color: '#0f172a'
  },
  btn: {
    backgroundColor: '#1d4ed8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  resultDetails: { fontSize: 15, color: '#475569', lineHeight: 22, marginTop: 10 }
});
