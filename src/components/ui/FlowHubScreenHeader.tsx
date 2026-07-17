import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import {
  FlowHubHeaderBreadcrumb,
  type HeaderBreadcrumbSegment,
} from '@/components/ui/FlowHubHeaderBreadcrumb';
import { FlowHubHeaderFooterChip } from '@/components/ui/FlowHubHeaderFooterChip';
import {
  FlowHubColors,
  FlowHubPalette,
  headerBottomShadow,
  HeaderTokens,
  HeaderTypography,
  HomeLayout,
  MaxContentWidth,
  Spacing,
} from '@/constants/theme';

/**
 * Variantes de layout do screen header:
 * - root-tab: tabs principais — logo row + título + subtitle + footer opcional
 * - root-home: root-tab + headerBottom context card
 * - detail: back + breadcrumb inline + título + subtitle + heroOverlap
 * - detail-action: detail + headerRight (editar, ⋯)
 */
export type FlowHubHeaderLayout = 'root-tab' | 'root-home' | 'detail' | 'detail-action';

type FlowHubScreenHeaderProps = {
  title: string;
  subtitle?: string;
  footer?: string;
  /** @deprecated Prefer `layout`. Mantido para compatibilidade. */
  variant?: 'root' | 'detail';
  layout?: FlowHubHeaderLayout;
  /** Ícone do módulo — exibido ao lado do título em root tabs. */
  moduleIcon?: SymbolViewProps['name'];
  heroOverlap?: boolean;
  onBack?: () => void;
  breadcrumb?: HeaderBreadcrumbSegment[];
  headerTop?: ReactNode;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  headerBottom?: ReactNode;
};

export function FlowHubHeaderActionButton({
  icon,
  onPress,
  accessibilityLabel,
}: {
  icon: SymbolViewProps['name'];
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button">
      <SymbolView name={icon} size={20} tintColor={FlowHubColors.white} />
    </Pressable>
  );
}

export function FlowHubScreenHeader({
  title,
  subtitle,
  footer,
  variant,
  layout,
  moduleIcon,
  heroOverlap,
  onBack,
  breadcrumb,
  headerTop,
  headerLeft,
  headerRight,
  headerBottom,
}: FlowHubScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const resolvedLayout: FlowHubHeaderLayout =
    layout ??
    (variant === 'detail' ? (headerRight ? 'detail-action' : 'detail') : headerBottom ? 'root-home' : 'root-tab');
  const isDetail = resolvedLayout === 'detail' || resolvedLayout === 'detail-action';
  const isRoot = resolvedLayout === 'root-tab' || resolvedLayout === 'root-home';
  const overlap = heroOverlap ?? !onBack;
  const bottomPad = Spacing.five + (overlap ? Math.abs(HomeLayout.heroOverlap) : 0);

  const titleStyle =
    resolvedLayout === 'root-home'
      ? styles.titleHome
      : isDetail
        ? styles.titleDetail
        : styles.titleRoot;

  const showTopRow = headerTop != null || onBack != null || headerLeft != null || headerRight != null;
  const rootWithoutTopRow = isRoot && !showTopRow;
  const topPadding = insets.top + (rootWithoutTopRow ? Spacing.four : Spacing.two);

  return (
    <View style={styles.outer}>
      <LinearGradient
        colors={[...FlowHubPalette.gradientHeader]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={[
          styles.container,
          headerBottomShadow,
          {
            paddingTop: topPadding,
            paddingBottom: bottomPad,
          },
        ]}>
        <View
          style={[
            styles.inner,
            rootWithoutTopRow && styles.innerRootCompact,
            {
              paddingLeft: insets.left + Spacing.four,
              paddingRight: insets.right + Spacing.four,
            },
          ]}>
          {showTopRow ? (
            headerTop ?? (
              <View style={styles.topRow}>
                {onBack ? (
                  <Pressable
                    style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
                    onPress={onBack}
                    accessibilityLabel="Voltar">
                    <SymbolView
                      name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
                      size={20}
                      tintColor={FlowHubColors.white}
                    />
                  </Pressable>
                ) : (
                  headerLeft ?? <View style={styles.topSpacer} />
                )}
                {headerRight ?? (onBack ? <View style={styles.topSpacer} /> : null)}
              </View>
            )
          ) : null}

          <View style={[styles.textBlock, rootWithoutTopRow && styles.textBlockRootCompact]}>
            {breadcrumb && breadcrumb.length > 0 ? (
              <FlowHubHeaderBreadcrumb segments={breadcrumb} />
            ) : null}

            <View style={styles.titleRow}>
              {isRoot && moduleIcon ? (
                <View style={styles.moduleIconWrap}>
                  <SymbolView name={moduleIcon} size={22} tintColor={FlowHubColors.turquoise} />
                </View>
              ) : null}
              <View style={styles.titleCol}>
                <ThemedText style={titleStyle} numberOfLines={2} ellipsizeMode="tail">
                  {title}
                </ThemedText>
                {subtitle ? (
                  <ThemedText style={styles.subtitle} numberOfLines={2}>
                    {subtitle}
                  </ThemedText>
                ) : null}
              </View>
            </View>

            {footer ? <FlowHubHeaderFooterChip label={footer} /> : null}
          </View>

          {headerBottom}
        </View>

        <View style={[styles.hairline, { pointerEvents: 'none' }]} />
        <View style={[styles.accentEdge, { pointerEvents: 'none' }]} />
      </LinearGradient>
    </View>
  );
}

const TOP_SIZE = HeaderTokens.actionButtonSize;

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  container: {
    alignSelf: 'stretch',
    width: '100%',
    borderBottomLeftRadius: HomeLayout.headerBottomRadius,
    borderBottomRightRadius: HomeLayout.headerBottomRadius,
    overflow: 'hidden',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
    zIndex: 1,
  },
  innerRootCompact: {
    gap: Spacing.two,
  },
  hairline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: HeaderTokens.bottomHairline,
  },
  accentEdge: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    bottom: 0,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: FlowHubColors.turquoise,
    opacity: 0.55,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: HeaderTokens.topRowMinHeight,
  },
  topSpacer: { width: TOP_SIZE, height: TOP_SIZE },
  backBtn: {
    width: TOP_SIZE,
    height: TOP_SIZE,
    borderRadius: TOP_SIZE / 2,
    backgroundColor: FlowHubPalette.whiteSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionBtn: {
    width: TOP_SIZE,
    height: TOP_SIZE,
    borderRadius: TOP_SIZE / 2,
    backgroundColor: FlowHubPalette.whiteSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textBlock: { gap: Spacing.one },
  textBlockRootCompact: { gap: Spacing.two },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  moduleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(20, 200, 196, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(20, 200, 196, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  titleCol: { flex: 1, gap: 4, minWidth: 0 },
  titleRoot: {
    ...HeaderTypography.rootTitle,
    color: FlowHubColors.white,
  },
  titleHome: {
    ...HeaderTypography.homeTitle,
    color: FlowHubColors.white,
  },
  titleDetail: {
    ...HeaderTypography.detailTitle,
    color: FlowHubColors.white,
  },
  subtitle: {
    ...HeaderTypography.subtitle,
    color: FlowHubPalette.whiteMuted,
  },
  pressed: { opacity: 0.88 },
});
