import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  formatCurrency,
  formatDate,
  isRegistroQuitado,
  saldoRegistro,
  temPagamentoParcial,
} from '@/components/cobrancas/cobrancas-utils';
import { ThemedText } from '@/components/themed-text';
import { FeatureColors, FlowHubColors, QuickActionColors, Radius, Spacing } from '@/constants/theme';
import type { RegistroMesa } from '@/services/api';

type RegistroCardProps = {
  registro: RegistroMesa;
  onRegistrarPagamento: () => void;
  onDelete: () => void;
};

export function RegistroCard({ registro, onRegistrarPagamento, onDelete }: RegistroCardProps) {
  const quitado = isRegistroQuitado(registro);
  const parcial = temPagamentoParcial(registro);
  const saldo = registro.saldo ?? saldoRegistro(registro);
  const valorPago = registro.valor_pago ?? 0;

  return (
    <View style={[styles.card, quitado && styles.cardQuitado]}>
      {quitado ? <View style={styles.accentBar} /> : null}

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.leituraIcon, quitado && styles.leituraIconQuitado]}>
            <SymbolView
              name={{ ios: 'gauge.with.dots.needle.67percent', android: 'speed', web: 'speed' }}
              size={16}
              tintColor={quitado ? FeatureColors.income : FlowHubColors.petroleum}
            />
          </View>

          <View style={styles.topInfo}>
            <ThemedText style={styles.date}>{formatDate(registro.data_leitura)}</ThemedText>
            <View style={[styles.leituraPill, quitado && styles.leituraPillQuitado]}>
              <ThemedText style={[styles.leituraLabel, quitado && styles.leituraLabelQuitado]}>
                Leitura
              </ThemedText>
              <ThemedText style={styles.leitura}>{registro.leitura}</ThemedText>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
            onPress={onDelete}
            accessibilityLabel="Excluir leitura">
            <SymbolView
              name={{ ios: 'trash', android: 'delete', web: 'delete' }}
              size={16}
              tintColor={FlowHubColors.darkGray}
            />
          </Pressable>
        </View>

        <View style={styles.valoresRow}>
          <ValorCell label="Valor" value={formatCurrency(registro.deve)} />
          <ValorCell
            label="Pago"
            value={formatCurrency(valorPago)}
            destaque={quitado || parcial}
          />
          <ValorCell
            label="Em aberto"
            value={formatCurrency(saldo)}
            destaque={saldo > 0}
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.pagamentoBtn, pressed && styles.pressed]}
          onPress={onRegistrarPagamento}
          accessibilityLabel="Registrar pagamento">
          <SymbolView
            name={{ ios: 'banknote', android: 'payments', web: 'payments' }}
            size={16}
            tintColor={quitado ? FeatureColors.income : FlowHubColors.petroleum}
          />
          <ThemedText style={[styles.pagamentoText, quitado && styles.pagamentoTextQuitado]}>
            {quitado ? 'Pagamento registrado' : parcial ? 'Ajustar pagamento' : 'Registrar pagamento'}
          </ThemedText>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={12}
            tintColor={FlowHubColors.darkGray}
          />
        </Pressable>
      </View>
    </View>
  );
}

function ValorCell({
  label,
  value,
  destaque,
}: {
  label: string;
  value: string;
  destaque?: boolean;
}) {
  return (
    <View style={styles.valorCell}>
      <ThemedText style={styles.valorLabel}>{label}</ThemedText>
      <ThemedText style={[styles.valorValue, destaque && styles.valorDestaque]}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: FlowHubColors.white,
    borderColor: '#E2E8EE',
  },
  cardQuitado: {
    backgroundColor: FeatureColors.incomeBg,
    borderColor: 'rgba(20, 200, 196, 0.28)',
  },
  accentBar: {
    width: 4,
    backgroundColor: FlowHubColors.turquoise,
  },
  content: {
    flex: 1,
    padding: Spacing.two,
    gap: Spacing.two,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  leituraIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FlowHubColors.lightGray,
  },
  leituraIconQuitado: {
    backgroundColor: QuickActionColors.background,
  },
  topInfo: { flex: 1, gap: 4, minWidth: 0 },
  date: {
    fontSize: 13,
    fontWeight: '600',
    color: FlowHubColors.petroleum,
  },
  leituraPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: FlowHubColors.lightGray,
  },
  leituraPillQuitado: {
    backgroundColor: QuickActionColors.background,
  },
  leituraLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: FlowHubColors.darkGray,
  },
  leituraLabelQuitado: {
    color: FeatureColors.income,
  },
  leitura: {
    fontSize: 18,
    fontWeight: '800',
    color: FlowHubColors.navy,
  },
  deleteBtn: {
    padding: 6,
    borderRadius: Radius.md,
    backgroundColor: FlowHubColors.lightGray,
  },
  valoresRow: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  valorCell: {
    flex: 1,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.one,
    gap: 2,
    alignItems: 'center',
  },
  valorLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: FlowHubColors.darkGray,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  valorValue: {
    fontSize: 13,
    fontWeight: '800',
    color: FlowHubColors.navy,
    textAlign: 'center',
  },
  valorDestaque: {
    color: FlowHubColors.petroleum,
  },
  pagamentoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: FlowHubColors.lightGray,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.two,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8EE',
  },
  pagamentoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
  },
  pagamentoTextQuitado: {
    color: FeatureColors.income,
  },
  pressed: { opacity: 0.88 },
});
