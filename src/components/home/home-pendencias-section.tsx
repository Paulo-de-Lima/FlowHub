import { StyleSheet, View } from 'react-native';

import { HomeEmptyState } from '@/components/home/home-empty-state';
import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, Spacing, Typography } from '@/constants/theme';

type HomePendenciasSectionProps = {
  pendingMaintenanceCount: number;
  onPressMaintenance?: () => void;
};

export function HomePendenciasSection({
  pendingMaintenanceCount,
  onPressMaintenance,
}: HomePendenciasSectionProps) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Pendências</ThemedText>
      {pendingMaintenanceCount > 0 ? (
        <HomeEmptyState
          icon={{ ios: 'wrench.and.screwdriver.fill', android: 'build', web: 'build' }}
          title={`${pendingMaintenanceCount} manutenção(ões) pendente(s)`}
          description="Revise os serviços agendados e mantenha tudo em dia."
          ctaLabel="Ver manutenções"
          onPress={onPressMaintenance}
        />
      ) : (
        <HomeEmptyState
          icon={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
          title="Tudo em ordem por aqui"
          description="Nenhuma manutenção pendente no momento. Aproveite para registrar novos serviços."
          ctaLabel="Nova manutenção"
          onPress={onPressMaintenance}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
    color: FlowHubColors.navy,
  },
});
