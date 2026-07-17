import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import {
  formatCurrency,
  formatTelefone,
  getClienteInitials,
} from '@/components/cobrancas/cobrancas-utils';
import { FlowHubStatusBadge } from '@/components/ui/FlowHubStatusBadge';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FlowHubColors,
  FlowHubPalette,
  QuickActionColors,
  Radius,
  SemanticColors,
  Spacing,
} from '@/constants/theme';
import type { ClienteSummary } from '@/services/api';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ClienteListCardProps = {
  item: ClienteSummary;
  onPress: () => void;
};

function StatusBadge({ item }: { item: ClienteSummary }) {
  if (item.totalDeve > 0) {
    return <FlowHubStatusBadge variant="debt" label={formatCurrency(item.totalDeve)} />;
  }
  if (item.qtdMesas > 0) {
    return <FlowHubStatusBadge variant="ok" label="Em dia" />;
  }
  return <FlowHubStatusBadge variant="neutral" label="Sem mesa" />;
}

export function ClienteListCard({ item, onPress }: ClienteListCardProps) {
  const nome = item.nome?.trim() || 'Sem nome';
  const mesasLabel = item.qtdMesas === 1 ? '1 mesa' : `${item.qtdMesas} mesas`;
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.card, cardShadowSoft, pressStyle]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.98, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 100 });
      }}
      accessibilityLabel={`Abrir ${nome}`}>
      <View style={styles.avatar}>
        <ThemedText style={styles.avatarText}>{getClienteInitials(item.nome)}</ThemedText>
      </View>

      <View style={styles.info}>
        <ThemedText style={styles.nome} numberOfLines={1}>
          {nome}
        </ThemedText>
        <ThemedText style={styles.telefone}>{formatTelefone(item.numero)}</ThemedText>
        <View style={styles.metaRow}>
          <ThemedText style={styles.meta}>{mesasLabel}</ThemedText>
          <StatusBadge item={item} />
        </View>
      </View>

      <SymbolView
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        size={16}
        tintColor={FlowHubColors.darkGray}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: SemanticColors.borderSubtle,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: QuickActionColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '800', color: FlowHubColors.petroleum },
  info: { flex: 1, gap: 4, minWidth: 0 },
  nome: { fontSize: 17, fontWeight: '800', color: FlowHubColors.navy },
  telefone: { fontSize: 13, color: FlowHubColors.darkGray },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, flexWrap: 'wrap' },
  meta: { fontSize: 12, fontWeight: '500', color: FlowHubColors.darkGray },
});
