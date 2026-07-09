import { useEffect } from 'react';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { formatCurrency, saldoRegistro, sortRegistrosCronologico, isRegistroMaisRecente } from '@/components/cobrancas/cobrancas-utils';
import { RegistroCard } from '@/components/cobrancas/RegistroCard';
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
import type { Mesa, RegistroMesa } from '@/services/api';

type MesaAccordionProps = {
  mesa: Mesa;
  expanded: boolean;
  onToggle: () => void;
  onNovaLeitura: () => void;
  onEditRegistro: (registro: RegistroMesa) => void;
  onRegistrarPagamento: (registro: RegistroMesa) => void;
  onDeleteRegistro: (registro: RegistroMesa) => void;
  onDeleteMesa?: () => void;
  onEditNumeracao?: () => void;
};

export function MesaAccordion({
  mesa,
  expanded,
  onToggle,
  onNovaLeitura,
  onEditRegistro,
  onRegistrarPagamento,
  onDeleteRegistro,
  onDeleteMesa,
  onEditNumeracao,
}: MesaAccordionProps) {
  const rotation = useSharedValue(expanded ? 90 : 0);

  useEffect(() => {
    rotation.value = withTiming(expanded ? 90 : 0, { duration: 200 });
  }, [expanded, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const registrosCount = mesa.registros.length;
  const pendentesCount = mesa.registros.filter((r) => saldoRegistro(r) > 0).length;
  const registrosLabel =
    registrosCount === 1 ? '1 registro' : `${registrosCount} registros`;
  const temPendente = pendentesCount > 0;

  const registrosOrdenados = sortRegistrosCronologico(mesa.registros);

  return (
    <View style={[styles.card, cardShadowSoft, expanded && styles.cardExpanded]}>
      <Pressable
        style={[styles.header, expanded && styles.headerExpanded]}
        onPress={onToggle}>
        <View style={[styles.mesaIcon, temPendente ? styles.mesaIconPendente : styles.mesaIconOk]}>
          <SymbolView
            name={{ ios: 'tablecells.fill', android: 'grid_on', web: 'grid_on' }}
            size={18}
            tintColor={temPendente ? FlowHubColors.petroleum : FeatureColors.income}
          />
        </View>

        <View style={styles.headerText}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>{mesa.numeracao}</ThemedText>
            {temPendente ? (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>
                  {pendentesCount} pendente{pendentesCount !== 1 ? 's' : ''}
                </ThemedText>
              </View>
            ) : registrosCount > 0 ? (
              <View style={styles.badgeOk}>
                <ThemedText style={styles.badgeOkText}>Em dia</ThemedText>
              </View>
            ) : null}
          </View>
          <ThemedText style={styles.subtitle}>
            Ficha {formatCurrency(mesa.valor_ficha)} · Deve {formatCurrency(mesa.totalDeve)} ·{' '}
            {registrosLabel}
          </ThemedText>
        </View>

        {onEditNumeracao ? (
          <Pressable
            style={({ pressed }) => [styles.editBtn, pressed && styles.pressed]}
            onPress={onEditNumeracao}
            accessibilityLabel="Editar numeração">
            <SymbolView
              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
              size={16}
              tintColor={FlowHubColors.petroleum}
            />
          </Pressable>
        ) : null}

        {onDeleteMesa ? (
          <Pressable
            style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
            onPress={onDeleteMesa}
            accessibilityLabel="Excluir mesa">
            <SymbolView
              name={{ ios: 'trash', android: 'delete', web: 'delete' }}
              size={16}
              tintColor={FeatureColors.expense}
            />
          </Pressable>
        ) : null}

        <Animated.View style={[styles.chevronWrap, chevronStyle]}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={16}
            tintColor={FlowHubColors.turquoise}
          />
        </Animated.View>
      </Pressable>

      {expanded ? (
        <View style={styles.body}>
          {mesa.registros.length === 0 ? (
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <SymbolView
                  name={{ ios: 'gauge.with.dots.needle.67percent', android: 'speed', web: 'speed' }}
                  size={28}
                  tintColor={FlowHubColors.petroleum}
                />
              </View>
              <ThemedText style={styles.empty}>Nenhuma leitura ainda</ThemedText>
              <Pressable style={styles.emptyCta} onPress={onNovaLeitura}>
                <ThemedText style={styles.emptyCtaText}>Adicionar leitura</ThemedText>
              </Pressable>
            </View>
          ) : (
            <View style={styles.timeline}>
              {registrosOrdenados.map((reg, index) => {
                const isAtual = isRegistroMaisRecente(reg, mesa.registros);
                const isLast = index === registrosOrdenados.length - 1;
                return (
                  <View key={reg.id} style={styles.timelineItem}>
                    <View style={styles.timelineRail}>
                      <View style={[styles.timelineDot, isAtual && styles.timelineDotAtual]} />
                      {!isLast ? <View style={styles.timelineLine} /> : null}
                    </View>
                    <View style={styles.timelineContent}>
                      <RegistroCard
                        registro={reg}
                        isAtual={isAtual}
                        compact={!isAtual}
                        onEditar={() => onEditRegistro(reg)}
                        onRegistrarPagamento={() => onRegistrarPagamento(reg)}
                        onDelete={() => onDeleteRegistro(reg)}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {mesa.registros.length > 0 ? (
            <Pressable style={styles.novaBtn} onPress={onNovaLeitura}>
              <SymbolView
                name={{ ios: 'plus', android: 'add', web: 'add' }}
                size={14}
                tintColor={FlowHubColors.petroleum}
              />
              <ThemedText style={styles.novaBtnText}>Nova leitura</ThemedText>
            </Pressable>
          ) : null}

          {onDeleteMesa ? (
            <Pressable
              style={({ pressed }) => [styles.excluirMesaBtn, pressed && styles.pressed]}
              onPress={onDeleteMesa}
              accessibilityLabel="Excluir mesa">
              <SymbolView
                name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                size={14}
                tintColor={FeatureColors.expense}
              />
              <ThemedText style={styles.excluirMesaText}>Excluir mesa</ThemedText>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8EE',
  },
  cardExpanded: {
    borderColor: 'rgba(20, 200, 196, 0.35)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.two,
    backgroundColor: FlowHubColors.white,
  },
  headerExpanded: {
    backgroundColor: QuickActionColors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20, 200, 196, 0.2)',
  },
  mesaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mesaIconPendente: {
    backgroundColor: FeatureColors.materialBg,
  },
  mesaIconOk: {
    backgroundColor: FeatureColors.incomeBg,
  },
  headerText: { flex: 1, gap: 4, minWidth: 0 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  title: { fontSize: 16, fontWeight: '700', color: FlowHubColors.navy },
  badge: {
    backgroundColor: FeatureColors.materialBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: FeatureColors.material,
  },
  badgeOk: {
    backgroundColor: FeatureColors.incomeBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.2)',
  },
  badgeOkText: {
    fontSize: 11,
    fontWeight: '700',
    color: FeatureColors.income,
  },
  subtitle: {
    fontSize: 12,
    color: FlowHubColors.darkGray,
  },
  deveHighlight: {
    fontWeight: '700',
    color: FeatureColors.expense,
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FlowHubColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(31, 78, 109, 0.15)',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FeatureColors.expenseBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.18)',
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 200, 196, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    backgroundColor: FlowHubColors.lightGray,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  timeline: { gap: 0 },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  timelineRail: {
    width: 16,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: SemanticColors.borderSubtle,
    marginTop: 14,
  },
  timelineDotAtual: {
    backgroundColor: FlowHubColors.turquoise,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: SemanticColors.borderSubtle,
    marginTop: 4,
    marginBottom: -4,
    minHeight: 24,
  },
  timelineContent: { flex: 1, paddingBottom: Spacing.two },
  emptyWrap: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E8EE',
    borderStyle: 'dashed',
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: QuickActionColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    fontSize: 13,
    textAlign: 'center',
    color: FlowHubColors.darkGray,
  },
  emptyCta: {
    backgroundColor: FlowHubColors.navy,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
  },
  emptyCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.white,
  },
  novaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: QuickActionColors.background,
    borderRadius: Radius.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(20, 200, 196, 0.35)',
  },
  novaBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
  },
  excluirMesaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  excluirMesaText: {
    fontSize: 13,
    fontWeight: '600',
    color: FeatureColors.expense,
  },
  pressed: { opacity: 0.88 },
});
