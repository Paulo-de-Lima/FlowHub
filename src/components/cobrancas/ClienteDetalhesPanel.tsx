import { useEffect } from 'react';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { FlowHubCollapsiblePanel } from '@/components/ui/FlowHubCollapsiblePanel';

import { ThemedText } from '@/components/themed-text';
import {
  FlowHubColors,
  FlowHubPalette,
  QuickActionColors,
  Radius,
  Spacing,
} from '@/constants/theme';

type ClienteDetalhesPanelProps = {
  open: boolean;
  onToggle: () => void;
  telefone: string;
  cpf: string;
  endereco: string;
};

const FIELDS: {
  key: string;
  label: string;
  icon: SymbolViewProps['name'];
  iconBg: string;
  iconColor: string;
  getValue: (p: { telefone: string; cpf: string; endereco: string }) => string;
}[] = [
  {
    key: 'telefone',
    label: 'Telefone',
    icon: { ios: 'phone.fill', android: 'phone', web: 'phone' },
    iconBg: FlowHubPalette.kpiIconBgAlt,
    iconColor: FlowHubColors.petroleum,
    getValue: (p) => p.telefone,
  },
  {
    key: 'cpf',
    label: 'CPF',
    icon: { ios: 'person.text.rectangle', android: 'badge', web: 'badge' },
    iconBg: QuickActionColors.background,
    iconColor: FlowHubColors.turquoise,
    getValue: (p) => p.cpf,
  },
  {
    key: 'endereco',
    label: 'Endereço',
    icon: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
    iconBg: FlowHubPalette.surfaceTint,
    iconColor: FlowHubColors.petroleum,
    getValue: (p) => p.endereco,
  },
];

export function ClienteDetalhesPanel({
  open,
  onToggle,
  telefone,
  cpf,
  endereco,
}: ClienteDetalhesPanelProps) {
  const chevronRotation = useSharedValue(open ? 180 : 0);

  useEffect(() => {
    chevronRotation.value = withTiming(open ? 180 : 0, { duration: 220 });
  }, [open, chevronRotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  const payload = { telefone, cpf, endereco };

  return (
    <View style={styles.wrap}>
      <Pressable
        style={({ pressed }) => [
          styles.toggle,
          open && styles.toggleOpen,
          pressed && styles.pressed,
        ]}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={open ? 'Ocultar detalhes do cliente' : 'Ver detalhes do cliente'}>
        <ThemedText style={styles.toggleText}>
          {open ? 'Ocultar detalhes' : 'Ver detalhes do cliente'}
        </ThemedText>
        <Animated.View style={chevronStyle}>
          <SymbolView
            name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
            size={14}
            tintColor={FlowHubColors.petroleum}
          />
        </Animated.View>
      </Pressable>

      <FlowHubCollapsiblePanel expanded={open} style={styles.panel}>
          {FIELDS.map((field, index) => (
            <View
              key={field.key}
              style={[styles.row, index < FIELDS.length - 1 && styles.rowBorder]}>
              <View style={[styles.iconWrap, { backgroundColor: field.iconBg }]}>
                <SymbolView name={field.icon} size={18} tintColor={field.iconColor} />
              </View>
              <View style={styles.rowContent}>
                <ThemedText style={styles.rowLabel}>{field.label}</ThemedText>
                <ThemedText style={styles.rowValue} numberOfLines={3}>
                  {field.getValue(payload)}
                </ThemedText>
              </View>
            </View>
          ))}
      </FlowHubCollapsiblePanel>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
  },
  toggleOpen: {
    backgroundColor: FlowHubPalette.kpiIconBgAlt,
    borderColor: 'rgba(31, 78, 109, 0.15)',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
  },
  panel: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: FlowHubPalette.borderSubtle,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowContent: { flex: 1, gap: 4, minWidth: 0 },
  rowLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: FlowHubColors.petroleum,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    color: FlowHubColors.navy,
  },
  pressed: { opacity: 0.88 },
});
