import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { FlowHubModalHeaderStrip } from '@/components/ui/flowHubModalStyles';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, QuickActionColors, Radius, Spacing } from '@/constants/theme';

type CobrancaConfirmModalProps = {
  visible: boolean;
  nome: string;
  totalDeve?: number;
  confirming: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function CobrancaConfirmModal({
  visible,
  nome,
  totalDeve = 0,
  confirming,
  error,
  onClose,
  onConfirm,
}: CobrancaConfirmModalProps) {
  const temDivida = totalDeve > 0;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.card, cardShadowSoft]} onPress={(e) => e.stopPropagation()}>
          <FlowHubModalHeaderStrip />
          <View style={styles.iconWrap}>
            <SymbolView
              name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
              size={28}
              tintColor={FlowHubColors.turquoise}
            />
          </View>

          <ThemedText style={styles.title}>
            {temDivida ? 'Marcar como cobrado na viagem?' : 'Marcar como cobrado?'}
          </ThemedText>

          <ThemedText style={styles.message} themeColor="textSecondary">
            {temDivida ? (
              <>
                Este cliente ainda tem{' '}
                <ThemedText style={styles.highlight}>{formatCurrency(totalDeve)}</ThemedText> em
                registros pendentes. Deseja marcar{' '}
                <ThemedText style={styles.highlight}>{nome}</ThemedText> como cobrado na viagem
                mesmo assim?
              </>
            ) : (
              <>
                Confirmar que você já cobrou{' '}
                <ThemedText style={styles.highlight}>{nome}</ThemedText> nesta viagem?
              </>
            )}
          </ThemedText>

          <ThemedText style={styles.hint} themeColor="textSecondary">
            {temDivida
              ? 'Isso indica que você já cobrou na rota, mas não quita os registros das mesas.'
              : 'Isso não altera os registros das mesas.'}
          </ThemedText>

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={onClose} disabled={confirming}>
              <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.confirmBtn, confirming && styles.confirmBtnDisabled]}
              onPress={onConfirm}
              disabled={confirming}>
              {confirming ? (
                <ActivityIndicator color={FlowHubColors.white} />
              ) : (
                <ThemedText style={styles.confirmText}>
                  {temDivida ? 'Marcar mesmo assim' : 'Confirmar'}
                </ThemedText>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 31, 58, 0.45)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: FlowHubColors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: QuickActionColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: FlowHubColors.navy,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: Spacing.two,
  },
  hint: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    paddingHorizontal: Spacing.two,
  },
  highlight: {
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  error: {
    color: FlowHubColors.petroleum,
    fontSize: 14,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    width: '100%',
    marginTop: Spacing.two,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: FlowHubColors.lightGray,
  },
  cancelText: {
    color: FlowHubColors.darkGray,
    fontWeight: '700',
    fontSize: 15,
  },
  confirmBtn: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: FlowHubColors.navy,
  },
  confirmBtnDisabled: { opacity: 0.7 },
  confirmText: {
    color: FlowHubColors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
