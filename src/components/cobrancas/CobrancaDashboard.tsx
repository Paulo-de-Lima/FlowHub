import { useRef, useState } from 'react';
import {
  LayoutAnimation,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { RankingBarChart } from '@/components/cobrancas/RankingBarChart';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadow,
  CobrancaTypography,
  FeatureColors,
  FlowHubColors,
  QuickActionColors,
  Radius,
  SemanticColors,
  Spacing,
} from '@/constants/theme';
import type { CobrancasDashboard } from '@/services/api';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CobrancaDashboardProps = {
  data: CobrancasDashboard | null;
  loading?: boolean;
  defaultExpanded?: boolean;
};

const SLIDES = [
  {
    key: 'arrecadacao',
    title: 'Maior arrecadação',
    dataKey: 'maiorArrecadacao' as const,
    formatValue: formatCurrency,
    barColor: FlowHubColors.turquoise,
  },
  {
    key: 'despesas',
    title: 'Maiores despesas',
    dataKey: 'maioresDespesas' as const,
    formatValue: formatCurrency,
    barColor: FeatureColors.expense,
  },
  {
    key: 'clientes',
    title: 'Mais clientes',
    dataKey: 'maisClientes' as const,
    formatValue: (v: number) => String(v),
    barColor: FlowHubColors.petroleum,
  },
];

export function CobrancaDashboard({ data, loading, defaultExpanded = false }: CobrancaDashboardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const chevronRotation = useSharedValue(defaultExpanded ? 90 : 0);

  const itemCount = data
    ? SLIDES.reduce((sum, slide) => sum + (data[slide.dataKey]?.length ?? 0), 0)
    : 0;

  function toggleExpanded() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    chevronRotation.value = withTiming(expanded ? 0 : 90, { duration: 200 });
    setExpanded((v) => !v);
  }

  function onViewportLayout(event: LayoutChangeEvent) {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0 && nextWidth !== viewportWidth) {
      setViewportWidth(nextWidth);
    }
  }

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (viewportWidth <= 0) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / viewportWidth);
    setActiveIndex(index);
  }

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
        onPress={toggleExpanded}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`Resumo do mês, ${itemCount} indicadores. ${expanded ? 'Recolher' : 'Expandir'}`}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.sectionTitle}>Resumo do mês</ThemedText>
          {itemCount > 0 ? (
            <View style={styles.countBadge}>
              <ThemedText style={styles.countText}>{itemCount}</ThemedText>
            </View>
          ) : null}
        </View>
        <Animated.View style={chevronStyle}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={16}
            tintColor={FlowHubColors.petroleum}
          />
        </Animated.View>
      </Pressable>

      {expanded ? (
        <View style={[styles.card, cardShadow]}>
          {loading ? (
            <ThemedText style={styles.empty} themeColor="textSecondary">
              Carregando rankings...
            </ThemedText>
          ) : !data ? (
            <ThemedText style={styles.empty} themeColor="textSecondary">
              Sem dados ainda
            </ThemedText>
          ) : (
            <>
              <View style={styles.carouselViewport} onLayout={onViewportLayout}>
                {viewportWidth > 0 ? (
                  <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    decelerationRate="fast"
                    snapToInterval={viewportWidth}
                    snapToAlignment="start"
                    disableIntervalMomentum>
                    {SLIDES.map((slide) => (
                      <View key={slide.key} style={[styles.slide, { width: viewportWidth }]}>
                        <RankingBarChart
                          title={slide.title}
                          items={data[slide.dataKey]}
                          formatValue={slide.formatValue}
                          barColor={slide.barColor}
                        />
                      </View>
                    ))}
                  </ScrollView>
                ) : null}
              </View>

              <View style={styles.dots}>
                {SLIDES.map((slide, index) => (
                  <View
                    key={slide.key}
                    style={[styles.dot, index === activeIndex && styles.dotActive]}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.two },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  sectionTitle: {
    ...CobrancaTypography.eyebrow,
    color: FlowHubColors.petroleum,
    textTransform: 'uppercase',
  },
  countBadge: {
    backgroundColor: QuickActionColors.background,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
  },
  card: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.four,
    overflow: 'hidden',
  },
  carouselViewport: { width: '100%', overflow: 'hidden' },
  slide: { paddingHorizontal: Spacing.four },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: Spacing.two,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SemanticColors.borderSubtle,
  },
  dotActive: {
    backgroundColor: FlowHubColors.turquoise,
    width: 18,
  },
  empty: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  pressed: { opacity: 0.88 },
});
