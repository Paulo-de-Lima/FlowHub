import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  formatCurrency,
  formatTelefone,
  getClienteInitials,
} from '@/components/cobrancas/cobrancas-utils';
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
import type { ClienteSummary } from '@/services/api';

type ClienteListCardProps = {
  item: ClienteSummary;
  onPress: () => void;
};

export function ClienteListCard({ item, onPress }: ClienteListCardProps) {
  const nome = item.nome?.trim() || 'Sem nome';
  const mesasLabel = item.qtdMesas === 1 ? '1 mesa' : `${item.qtdMesas} mesas`;
  const deveLabel =
    item.totalDeve > 0 ? formatCurrency(item.totalDeve) : item.qtdMesas > 0 ? 'Em dia' : 'Sem mesa';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, cardShadowSoft, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityLabel={`Abrir ${nome}`}>
      <View style={styles.avatar}>
        <ThemedText style={styles.avatarText}>{getClienteInitials(item.nome)}</ThemedText>
      </View>

      <View style={styles.info}>
        <ThemedText style={styles.nome} numberOfLines={1}>
          {nome}
        </ThemedText>
        <ThemedText style={styles.telefone}>{formatTelefone(item.numero)}</ThemedText>
        <ThemedText style={styles.meta}>
          {mesasLabel} ·{' '}
          <ThemedText
            style={[
              styles.deve,
              item.totalDeve > 0 && styles.devePendente,
              item.qtdMesas > 0 && item.totalDeve === 0 && styles.deveOk,
            ]}>
            {deveLabel}
          </ThemedText>
        </ThemedText>
      </View>

      <SymbolView
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        size={16}
        tintColor={FlowHubColors.darkGray}
      />
    </Pressable>
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
  info: { flex: 1, gap: 2, minWidth: 0 },
  nome: { fontSize: 16, fontWeight: '700', color: FlowHubColors.navy },
  telefone: { fontSize: 13, color: FlowHubColors.darkGray },
  meta: { fontSize: 12, fontWeight: '500', color: FlowHubColors.darkGray },
  deve: { fontWeight: '700' },
  devePendente: { color: FeatureColors.expense },
  deveOk: { color: FeatureColors.income },
  pressed: { opacity: 0.88 },
});
