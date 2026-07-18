import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import {
  cardShadowSoft,
  FlowHubColors,
  FlowHubPalette,
  QuickActionColors,
  Radius,
  Spacing,
  Typography,
} from '@/constants/theme';

const QUICK_ACTIONS = [
  {
    id: 'novo-cliente',
    label: 'Novo\ncliente',
    icon: { ios: 'person.badge.plus', android: 'person_add', web: 'person_add' },
    href: '/clientes' as const,
  },
  {
    id: 'nova-manutencao',
    label: 'Nova\nmanutenção',
    icon: { ios: 'wrench.and.screwdriver.fill', android: 'build', web: 'build' },
    href: '/manutencao?nova=1' as const,
  },
  {
    id: 'nova-receita',
    label: 'Nova\nreceita',
    icon: {
      ios: 'chart.line.uptrend.xyaxis',
      android: 'trending_up',
      web: 'trending_up',
    },
    href: '/financeiro?novo=receita' as const,
  },
  {
    id: 'nova-despesa',
    label: 'Nova\ndespesa',
    icon: {
      ios: 'chart.line.downtrend.xyaxis',
      android: 'trending_down',
      web: 'trending_down',
    },
    href: '/financeiro?novo=despesa' as const,
  },
  {
    id: 'novo-material',
    label: 'Registrar\ncompra',
    icon: { ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' },
    href: '/estoque?compra=1' as const,
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

  const items = QUICK_ACTIONS.map((action) => (
    <Pressable
      key={action.id}
      style={({ pressed }) => [
        styles.item,
        { width: quickItemWidth },
        pressed && styles.pressed,
      ]}
      onPress={() => router.push(action.href)}>
      <View style={[styles.iconWrap, cardShadowSoft]}>
        <SymbolView name={action.icon} size={24} tintColor={FlowHubColors.petroleum} />
      </View>
      <ThemedText style={styles.label}>{action.label}</ThemedText>
    </Pressable>
  ));

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Acesso rápido</ThemedText>
      {Platform.OS === 'web' ? (
        <View style={styles.webCarousel}>{items}</View>
      ) : (
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}>
          {items}
        </ScrollView>
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
  carousel: {
    flexDirection: 'row',
    gap: QUICK_CAROUSEL_GAP,
    alignItems: 'flex-start',
  },
  webCarousel: {
    flexDirection: 'row',
    gap: QUICK_CAROUSEL_GAP,
    alignItems: 'flex-start',
    overflow: 'scroll',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Spacing.one,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: Radius.lg,
    backgroundColor: QuickActionColors.background,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
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
