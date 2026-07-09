import { useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';
import { RankingBarChart } from '@/components/cobrancas/RankingBarChart';
import { ThemedText } from '@/components/themed-text';
import { cardShadow, FeatureColors, FlowHubColors, Radius, Spacing } from '@/constants/theme';
import type { CobrancasDashboard } from '@/services/api';

type CobrancaDashboardProps = {
  data: CobrancasDashboard | null;
  loading?: boolean;
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

export function CobrancaDashboard({ data, loading }: CobrancaDashboardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

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

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.sectionTitle}>Desempenho das viagens</ThemedText>

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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: FlowHubColors.petroleum,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: FlowHubColors.white,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.four,
    overflow: 'hidden',
  },
  carouselViewport: {
    width: '100%',
    overflow: 'hidden',
  },
  slide: {
    paddingHorizontal: Spacing.four,
  },
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
    backgroundColor: '#D1D9E0',
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
});
