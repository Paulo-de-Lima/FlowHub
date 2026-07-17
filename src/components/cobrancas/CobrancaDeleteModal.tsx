import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { FlowHubModalHeaderStrip } from '@/components/ui/flowHubModalStyles';
import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FlowHubColors, Radius, Spacing } from '@/constants/theme';
import type { Cobranca } from '@/services/api';

type CobrancaDeleteModalProps = {
  visible: boolean;
  cobranca: Cobranca | null;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function CobrancaDeleteModal({
  visible,
  cobranca,
  deleting,
  error,
  onClose,
  onConfirm,
}: CobrancaDeleteModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.card, cardShadowSoft]} onPress={(e) => e.stopPropagation()}>
          <FlowHubModalHeaderStrip />
          <View style={styles.iconWrap}>
            <SymbolView
              name={{ ios: 'trash.fill', android: 'delete', web: 'delete' }}
              size={28}
              tintColor="#C0392B"
            />
          </View>

          <ThemedText style={styles.title}>Excluir cobrança</ThemedText>

          <ThemedText style={styles.message} themeColor="textSecondary">
            Tem certeza que deseja excluir{' '}
            <ThemedText style={styles.highlight}>{cobranca?.nome ?? 'esta cobrança'}</ThemedText>?
          </ThemedText>

          <ThemedText style={styles.warning} themeColor="textSecondary">
            Os vínculos com clientes serão removidos. Esta ação não pode ser desfeita.
          </ThemedText>

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={onClose} disabled={deleting}>
              <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.deleteBtn, deleting && styles.deleteBtnDisabled]}
              onPress={onConfirm}
              disabled={deleting}>
              {deleting ? (
                <ActivityIndicator color={FlowHubColors.white} />
              ) : (
                <ThemedText style={styles.deleteText}>Excluir</ThemedText>
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
    backgroundColor: '#FDEBEA',
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
  highlight: {
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  warning: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: Spacing.two,
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
  deleteBtn: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#C0392B',
  },
  deleteBtnDisabled: {
    opacity: 0.7,
  },
  deleteText: {
    color: FlowHubColors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
