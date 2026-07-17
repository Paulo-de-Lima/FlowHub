import { View, StyleSheet } from 'react-native';

import { FlowHubAddButton } from '@/components/ui/FlowHubAddButton';
import { Spacing } from '@/constants/theme';

type MesasClienteToolbarProps = {
  onAddMesa: () => void;
  onMarcarCobrado?: () => void;
  marcandoCobrado?: boolean;
  cobrado?: boolean;
};

export function MesasClienteToolbar({
  onAddMesa,
  onMarcarCobrado,
  marcandoCobrado,
  cobrado,
}: MesasClienteToolbarProps) {
  const showMarcar = Boolean(onMarcarCobrado && !cobrado);

  return (
    <View style={[styles.row, !showMarcar && styles.rowSingle]}>
      {showMarcar ? (
        <FlowHubAddButton
          variant="success"
          label="Cobrado na viagem"
          leadingIcon="checkmark"
          showPlus={false}
          layout="fill"
          onPress={onMarcarCobrado!}
          disabled={marcandoCobrado}
          accessibilityLabel="Cobrado na viagem"
          style={styles.btn}
        />
      ) : null}
      <FlowHubAddButton
        variant="bar"
        label="Adicionar mesa"
        layout="fill"
        onPress={onAddMesa}
        accessibilityLabel="Adicionar mesa"
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  rowSingle: {
    flexDirection: 'column',
  },
  btn: {
    flex: 1,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});
