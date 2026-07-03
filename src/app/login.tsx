import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleEntrar() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      return;
    }

    router.replace({ pathname: '/home', params: { nome: nome.trim() } });
  }

  const canSubmit = nome.trim().length > 0 && email.trim().length > 0 && senha.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/FlowHub/LogoMarcaFBremovebg.png')}
              style={styles.logo}
              contentFit="contain"
            />
            <ThemedText style={styles.subtitle} themeColor="textSecondary">
              Gerencie clientes, finanças e materiais em um só lugar.
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <ThemedText style={styles.label}>Nome</ThemedText>
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome completo"
                placeholderTextColor={FlowHubColors.darkGray}
                autoCapitalize="words"
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText style={styles.label}>E-mail</ThemedText>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor={FlowHubColors.darkGray}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText style={styles.label}>Senha</ThemedText>
              <TextInput
                value={senha}
                onChangeText={setSenha}
                placeholder="••••••••"
                placeholderTextColor={FlowHubColors.darkGray}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <Pressable
              onPress={handleEntrar}
              disabled={!canSubmit}
              style={({ pressed }) => [
                styles.button,
                !canSubmit && styles.buttonDisabled,
                pressed && canSubmit && styles.buttonPressed,
              ]}>
              <ThemedText style={styles.buttonText}>Entrar</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FlowHubColors.lightGray,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.five,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  logo: {
    width: 240,
    height: 100,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  form: {
    gap: Spacing.three,
  },
  fieldGroup: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: FlowHubColors.navy,
  },
  input: {
    backgroundColor: FlowHubColors.white,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 16,
    color: FlowHubColors.navy,
    borderWidth: 1,
    borderColor: '#E2E8EE',
  },
  button: {
    marginTop: Spacing.two,
    backgroundColor: FlowHubColors.navy,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: FlowHubColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
