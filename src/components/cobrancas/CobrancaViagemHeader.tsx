import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatIntervaloDias, formatProximaViagem } from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, HomeLayout, Spacing, Typography } from '@/constants/theme';

type CobrancaViagemHeaderProps = {
  nome: string;
  intervaloDias: number;
  dataViagem?: string | null;
  onBack: () => void;
};

export function CobrancaViagemHeader({ nome, intervaloDias, dataViagem, onBack }: CobrancaViagemHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[FlowHubColors.navy, FlowHubColors.petroleum]}
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.two,
          paddingBottom: Spacing.five + Math.abs(HomeLayout.heroOverlap),
          paddingLeft: insets.left + Spacing.four,
          paddingRight: insets.right + Spacing.four,
        },
      ]}>
      <View style={styles.topRow}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          onPress={onBack}
          accessibilityLabel="Voltar">
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
            size={20}
            tintColor={FlowHubColors.white}
          />
        </Pressable>
      </View>

      <View style={styles.textBlock}>
        <ThemedText style={styles.title} numberOfLines={2}>
          {nome || 'Cobrança'}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {dataViagem ? `Viagem: ${formatProximaViagem(dataViagem)} · ` : ''}
          Intervalo: {formatIntervaloDias(intervaloDias)}
        </ThemedText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    width: '100%',
    borderBottomLeftRadius: HomeLayout.headerBottomRadius,
    borderBottomRightRadius: HomeLayout.headerBottomRadius,
    overflow: 'hidden',
    gap: Spacing.three,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { gap: Spacing.one },
  title: {
    ...Typography.greeting,
    color: FlowHubColors.white,
    fontSize: 22,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  pressed: { opacity: 0.88 },
});
