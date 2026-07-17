import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import type { HomeBillingPreview } from '@/components/home/home-mock';
import { FlowHubScreenHeader } from '@/components/ui/FlowHubScreenHeader';
import { HeaderLogoNotificationRow } from '@/components/ui/HeaderLogoNotificationRow';
import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, FlowHubPalette, Radius, Spacing } from '@/constants/theme';

type HomeHeaderProps = {
  firstName: string;
  monthLabel: string;
  nextBilling: HomeBillingPreview | null;
  onNotificationPress?: () => void;
  onCobrancaPress?: () => void;
};

export function HomeHeader({
  firstName,
  monthLabel,
  nextBilling,
  onNotificationPress,
  onCobrancaPress,
}: HomeHeaderProps) {
  return (
    <FlowHubScreenHeader
      title={`Olá, ${firstName}!`}
      subtitle={`Resumo de ${monthLabel}`}
      headerTop={<HeaderLogoNotificationRow onNotificationPress={onNotificationPress} />}
      headerBottom={
        <Pressable
          style={({ pressed }) => [styles.cobrancaCard, pressed && styles.pressed]}
          onPress={onCobrancaPress}>
          <View style={styles.cobrancaAccent} />
          <View style={styles.cobrancaContent}>
            {nextBilling ? (
              <>
                <View style={styles.cobrancaTitleRow}>
                  <SymbolView
                    name={{ ios: 'map.fill', android: 'map', web: 'map' }}
                    size={16}
                    tintColor={FlowHubColors.turquoise}
                  />
                  <ThemedText style={styles.cobrancaTitle}>
                    Próxima cobrança: {nextBilling.region}
                  </ThemedText>
                </View>
                <ThemedText style={styles.cobrancaSubtitle}>{nextBilling.subtitle}</ThemedText>
              </>
            ) : (
              <>
                <View style={styles.cobrancaTitleRow}>
                  <SymbolView
                    name={{ ios: 'calendar.badge.plus', android: 'event', web: 'event' }}
                    size={16}
                    tintColor={FlowHubColors.turquoise}
                  />
                  <ThemedText style={styles.cobrancaTitle}>Nenhuma cobrança agendada</ThemedText>
                </View>
                <ThemedText style={styles.cobrancaSubtitle}>
                  Toque para planejar sua próxima rota
                </ThemedText>
              </>
            )}
          </View>
          <View style={styles.cobrancaChevronWrap}>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={14}
              tintColor={FlowHubColors.turquoise}
            />
          </View>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  cobrancaCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: FlowHubPalette.whiteSubtle,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  cobrancaAccent: {
    width: 4,
    backgroundColor: FlowHubColors.turquoise,
  },
  cobrancaContent: {
    flex: 1,
    gap: 3,
    paddingVertical: Spacing.three,
    paddingLeft: Spacing.three,
  },
  cobrancaChevronWrap: {
    justifyContent: 'center',
    paddingRight: Spacing.three,
  },
  cobrancaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cobrancaTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: FlowHubColors.white,
  },
  cobrancaSubtitle: {
    fontSize: 12,
    color: FlowHubPalette.whiteMuted,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
});
