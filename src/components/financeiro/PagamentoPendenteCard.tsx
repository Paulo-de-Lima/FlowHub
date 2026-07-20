import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { formatCurrency, formatTelefone, getClienteInitials } from '@/components/cobrancas/cobrancas-utils';
import { FlowHubStatusBadge } from '@/components/ui/FlowHubStatusBadge';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FeatureColors,
  FlowHubColors,
  QuickActionColors,
  Radius,
  SemanticColors,
  Spacing,
} from '@/constants/theme';
import type { PagamentoPendenteCliente } from '@/services/api';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PagamentoPendenteCardProps = {
  item: PagamentoPendenteCliente;
  onPress: () => void;
};

export function PagamentoPendenteCard({ item, onPress }: PagamentoPendenteCardProps) {
  const nome = item.nome?.trim() || 'Sem nome';
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const mesasLabel = item.qtdMesas === 1 ? '1 mesa' : `${item.qtdMesas} mesas`;
  const pendentesLabel =
    item.registrosPendentes === 1
      ? '1 leitura pendente'
      : `${item.registrosPendentes} leituras pendentes`;

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
      accessibilityLabel={`Ver leituras de ${nome}`}>
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
          <ThemedText style={styles.metaDot}>·</ThemedText>
          <ThemedText style={styles.meta}>{pendentesLabel}</ThemedText>
        </View>
      </View>

      <View style={styles.trailing}>
        <FlowHubStatusBadge variant="debt" label={formatCurrency(item.totalDeve)} />
        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={16}
          tintColor={FlowHubColors.darkGray}
        />
      </View>
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
    backgroundColor: FeatureColors.expenseBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '800', color: FeatureColors.expense },
  info: { flex: 1, gap: 4, minWidth: 0 },
  nome: { fontSize: 17, fontWeight: '800', color: FlowHubColors.navy },
  telefone: { fontSize: 13, color: FlowHubColors.darkGray },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  meta: { fontSize: 12, fontWeight: '500', color: FlowHubColors.darkGray },
  metaDot: { fontSize: 12, color: FlowHubColors.darkGray, opacity: 0.5 },
  trailing: { alignItems: 'flex-end', gap: Spacing.one },
});
