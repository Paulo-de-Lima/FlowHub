import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  formatCobrancaTitulo,
  formatCurrency,
  formatIntervaloDias,
  formatProximaViagem,
  formatRepeticaoPrevista,
} from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FeatureColors,
  FlowHubColors,
  FlowHubPalette,
  QuickActionColors,
  Radius,
  Spacing,
} from '@/constants/theme';
import type { Cobranca } from '@/services/api';

type CobrancaCardProps = {
  cobranca: Cobranca;
  destacada?: boolean;
  onIniciar: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function CobrancaCard({
  cobranca,
  destacada,
  onIniciar,
  onEdit,
  onDelete,
}: CobrancaCardProps) {
  const titulo = formatCobrancaTitulo(cobranca.nome);
  const progressPct =
    cobranca.totalClientes > 0 ? cobranca.clientesCobrados / cobranca.totalClientes : 0;

  return (
    <View
      style={[
        styles.card,
        cardShadowSoft,
        destacada && styles.cardDestacada,
      ]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>{titulo.charAt(0).toUpperCase()}</ThemedText>
          </View>
          <View style={styles.titleBlock}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {titulo}
            </ThemedText>
            <ThemedText style={styles.metaLine} numberOfLines={1}>
              {formatIntervaloDias(cobranca.intervalo_dias)} ·{' '}
              {formatProximaViagem(cobranca.proximaViagem, cobranca.data_viagem)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.headerActions}>
          {destacada ? (
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>Próxima</ThemedText>
            </View>
          ) : null}
          <Pressable
            style={({ pressed }) => [styles.iconBtn, styles.editBtn, pressed && styles.pressed]}
            onPress={onEdit}
            accessibilityLabel="Editar cobrança"
            hitSlop={6}>
            <SymbolView
              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
              size={18}
              tintColor={FlowHubColors.petroleum}
            />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.iconBtn, styles.deleteBtn, pressed && styles.pressed]}
            onPress={onDelete}
            accessibilityLabel="Excluir cobrança"
            hitSlop={6}>
            <SymbolView
              name={{ ios: 'trash', android: 'delete', web: 'delete' }}
              size={18}
              tintColor={FeatureColors.expense}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <ThemedText style={styles.statLabel}>Clientes</ThemedText>
          <ThemedText style={styles.statValue}>{cobranca.totalClientes}</ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <ThemedText style={styles.statLabel}>Arrecadado</ThemedText>
          <ThemedText style={[styles.statValue, styles.statValuePetroleum]}>
            {formatCurrency(cobranca.totalArrecadadoAnterior)}
          </ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <ThemedText style={styles.statLabel}>Progresso</ThemedText>
          <ThemedText style={[styles.statValue, styles.statValueTurquoise]}>
            {cobranca.clientesCobrados}/{cobranca.totalClientes}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.repeticaoHint}>
        Retorno previsto: {formatRepeticaoPrevista(cobranca.data_viagem, cobranca.intervalo_dias)}
      </ThemedText>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
      </View>

      <Pressable
        style={({ pressed }) => [styles.iniciarBtn, pressed && styles.pressed]}
        onPress={onIniciar}>
        <ThemedText style={styles.iniciarText}>Iniciar</ThemedText>
        <SymbolView
          name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
          size={16}
          tintColor={FlowHubColors.white}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
  },
  cardDestacada: {
    borderWidth: 2,
    borderColor: FlowHubColors.turquoise,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: QuickActionColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: FlowHubColors.petroleum,
  },
  titleBlock: { flex: 1, gap: 2 },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  metaLine: {
    fontSize: 12,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  editBtn: {
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderColor: FlowHubPalette.borderSubtle,
  },
  deleteBtn: {
    backgroundColor: FeatureColors.expenseBg,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  badge: {
    backgroundColor: QuickActionColors.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.one,
    borderTopWidth: 1,
    borderTopColor: FlowHubPalette.borderSubtle,
  },
  stat: { flex: 1, gap: 2, alignItems: 'center' },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: FlowHubPalette.borderSubtle,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: FlowHubColors.darkGray,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  statValuePetroleum: { color: FlowHubColors.petroleum },
  statValueTurquoise: { color: FlowHubColors.turquoise },
  repeticaoHint: {
    fontSize: 11,
    fontWeight: '500',
    color: FlowHubColors.darkGray,
  },
  progressTrack: {
    height: 5,
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: FlowHubColors.turquoise,
    borderRadius: 3,
  },
  iniciarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    backgroundColor: FlowHubColors.navy,
    borderRadius: Radius.md,
    paddingVertical: 13,
  },
  iniciarText: {
    color: FlowHubColors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
