import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, QuickActionColors, quickActionShadow, Spacing, Typography } from '@/constants/theme';

const QUICK_ACTIONS = [
  {
    id: 'novo-cliente',
    label: 'Novo\ncliente',
    icon: { ios: 'person.badge.plus', android: 'person_add', web: 'person_add' },
  },
  {
    id: 'novo-registro',
    label: 'Novo\nregistro',
    icon: { ios: 'doc.text.fill', android: 'description', web: 'description' },
  },
  {
    id: 'nova-manutencao',
    label: 'Nova\nmanutenção',
    icon: { ios: 'wrench.and.screwdriver.fill', android: 'build', web: 'build' },
  },
  {
    id: 'nova-receita',
    label: 'Nova\nreceita',
    icon: {
      ios: 'chart.line.uptrend.xyaxis',
      android: 'trending_up',
      web: 'trending_up',
    },
  },
  {
    id: 'nova-despesa',
    label: 'Nova\ndespesa',
    icon: {
      ios: 'chart.line.downtrend.xyaxis',
      android: 'trending_down',
      web: 'trending_down',
    },
  },
  {
    id: 'novo-material',
    label: 'Novo\nmaterial',
    icon: { ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' },
  },
] as const;

const QUICK_CAROUSEL_GAP = Spacing.half;
const QUICK_VISIBLE_ITEMS = 4;

export function HomeQuickActions() {
  const { width: screenWidth } = useWindowDimensions();
  const quickItemWidth =
    (screenWidth -
      Spacing.four * 2 -
      QUICK_CAROUSEL_GAP * (QUICK_VISIBLE_ITEMS - 1)) /
    QUICK_VISIBLE_ITEMS;

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Acesso rápido</ThemedText>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        contentContainerStyle={styles.carousel}>
        {QUICK_ACTIONS.map((action) => (
          <Pressable
            key={action.id}
            style={({ pressed }) => [
              styles.item,
              { width: quickItemWidth },
              pressed && styles.pressed,
            ]}
            onPress={() => {}}>
            <View
              style={[
                styles.iconWrap,
                quickActionShadow,
                { backgroundColor: QuickActionColors.background },
              ]}>
              <SymbolView
                name={action.icon}
                size={26}
                tintColor={QuickActionColors.icon}
              />
            </View>
            <ThemedText style={styles.label}>{action.label}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>
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
  carousel: {
    flexDirection: 'row',
    gap: QUICK_CAROUSEL_GAP,
    alignItems: 'flex-start',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Spacing.one,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
    color: FlowHubColors.navy,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
