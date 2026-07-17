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
  type ViewStyle,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { FlowHubCollapsiblePanel } from '@/components/ui/FlowHubCollapsiblePanel';

import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { RankingBarChart } from '@/components/cobrancas/RankingBarChart';
import { FlowHubSectionHeader } from '@/components/ui/FlowHubSectionHeader';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadow,
  FlowHubColors,
  FlowHubPalette,
  Radius,
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
    barColor: FlowHubPalette.chartTurquoise,
  },
  {
    key: 'despesas',
    title: 'Maiores despesas',
    dataKey: 'maioresDespesas' as const,
    formatValue: formatCurrency,
    barColor: FlowHubPalette.chartExpense,
  },
  {
    key: 'clientes',
    title: 'Mais clientes',
    dataKey: 'maisClientes' as const,
    formatValue: (v: number) => String(v),
    barColor: FlowHubPalette.chartPetroleum,
  },
];

export function CobrancaDashboard({ data, loading, defaultExpanded = true }: CobrancaDashboardProps) {
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
    <View style={[styles.wrapper, cardShadow]}>
      <Pressable
        style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
        onPress={toggleExpanded}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`Rankings do mês, ${itemCount} indicadores. ${expanded ? 'Recolher' : 'Expandir'}`}>
        <FlowHubSectionHeader
          title="Rankings do mês"
          count={itemCount > 0 ? itemCount : undefined}
          uppercase={false}
        />
        <Animated.View style={chevronStyle}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={16}
            tintColor={FlowHubColors.petroleum}
          />
        </Animated.View>
      </Pressable>

      <FlowHubCollapsiblePanel expanded={expanded} style={styles.body}>
          {loading ? (
            <View style={styles.emptyChart}>
              <SymbolView
                name={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }}
                size={28}
                tintColor={FlowHubColors.turquoise}
              />
              <ThemedText style={styles.emptyText} themeColor="textSecondary">
                Carregando rankings...
              </ThemedText>
            </View>
          ) : !data ? (
            <View style={styles.emptyChart}>
              <SymbolView
                name={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }}
                size={28}
                tintColor={FlowHubColors.darkGray}
              />
              <ThemedText style={styles.emptyText} themeColor="textSecondary">
                Sem dados para exibir ainda
              </ThemedText>
            </View>
          ) : (
            <>
              <View style={styles.carouselViewport} onLayout={onViewportLayout}>
                {viewportWidth > 0 ? (
                  Platform.OS === 'web' ? (
                    <View style={[styles.webCarousel, { width: viewportWidth }]}>
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
                    </View>
                  ) : (
                    <ScrollView
                      ref={scrollRef}
                      horizontal
                      pagingEnabled
                      nestedScrollEnabled
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
                  )
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
      </FlowHubCollapsiblePanel>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: FlowHubPalette.borderSubtle,
    overflow: 'hidden',
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: FlowHubPalette.sectionDivider,
  },
  body: {
    paddingBottom: Spacing.three,
  },
  carouselViewport: { width: '100%', overflow: 'hidden' },
  webCarousel: {
    flexDirection: 'row',
    overflow: 'scroll',
    scrollSnapType: 'x mandatory',
  } as ViewStyle,
  slide: { paddingHorizontal: Spacing.four, paddingTop: Spacing.three },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: FlowHubPalette.surfaceSunken,
  },
  dotActive: {
    backgroundColor: FlowHubColors.turquoise,
    width: 22,
  },
  emptyChart: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
    marginHorizontal: Spacing.four,
    backgroundColor: FlowHubPalette.surfaceTint,
    borderRadius: Radius.md,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  pressed: { opacity: 0.88 },
});
