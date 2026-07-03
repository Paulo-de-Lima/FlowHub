import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { cardShadowSoft, FeatureColors, FlowHubColors, quickActionShadow, Spacing } from '@/constants/theme';

const LOGO_SOURCE = require('@/assets/images/FlowHub/LogoMarcaBW.png');

const QUICK_ACTIONS = [
  [
    {
      id: 'novo-cliente',
      label: 'Novo\ncliente',
      icon: { ios: 'person.badge.plus', android: 'person_add', web: 'person_add' },
      color: FeatureColors.client,
      bg: FeatureColors.clientBg,
    },
    {
      id: 'novo-registro',
      label: 'Novo\nregistro',
      icon: { ios: 'doc.text.fill', android: 'description', web: 'description' },
      color: FeatureColors.record,
      bg: FeatureColors.recordBg,
    },
    {
      id: 'nova-manutencao',
      label: 'Nova\nmanutenção',
      icon: { ios: 'wrench.and.screwdriver.fill', android: 'build', web: 'build' },
      color: FeatureColors.maintenance,
      bg: FeatureColors.maintenanceBg,
    },
  ],
  [
    {
      id: 'nova-receita',
      label: 'Nova\nreceita',
      icon: { ios: 'arrow.down.circle.fill', android: 'trending_down', web: 'trending_down' },
      color: FeatureColors.income,
      bg: FeatureColors.incomeBg,
    },
    {
      id: 'nova-despesa',
      label: 'Nova\ndespesa',
      icon: { ios: 'arrow.up.circle.fill', android: 'trending_up', web: 'trending_up' },
      color: FeatureColors.expense,
      bg: FeatureColors.expenseBg,
    },
    {
      id: 'novo-material',
      label: 'Novo\nmaterial',
      icon: { ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' },
      color: FeatureColors.material,
      bg: FeatureColors.materialBg,
    },
  ],
] as const;

const STOCK_SUMMARY = [
  { label: 'Estoques vazios', value: 0, color: FeatureColors.expense },
  { label: 'Itens escassos', value: 0, color: FeatureColors.material },
  { label: 'Estoques cheios', value: 0, color: FeatureColors.income },
] as const;

function getCurrentMonthLabel() {
  const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
  return month.charAt(0).toUpperCase() + month.slice(1);
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { nome } = useLocalSearchParams<{ nome?: string }>();
  const userName = nome?.trim() || 'Usuário';
  const firstName = userName.split(' ')[0];
  const headerPadding = Spacing.four;

  return (
    <View style={styles.screen}>
      <View style={[styles.headerLayer, { paddingTop: insets.top }]}>
        <View
          style={[
            styles.headerTop,
            {
              paddingLeft: insets.left + headerPadding,
              paddingRight: insets.right + headerPadding,
            },
          ]}>
          <Image
            source={LOGO_SOURCE}
            style={styles.logo}
            contentFit="contain"
            contentPosition="left center"
            accessibilityLabel="FlowHub"
          />
          <ThemedText style={styles.greeting}>Olá, {firstName}!</ThemedText>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.cobrancaCard,
            { paddingRight: insets.right + headerPadding },
            pressed && styles.pressed,
          ]}>
          <View style={styles.cobrancaAccent} />
          <View style={styles.cobrancaContent}>
            <View style={styles.cobrancaTitleRow}>
              <SymbolView
                name={{ ios: 'map.fill', android: 'map', web: 'map' }}
                size={16}
                tintColor={FlowHubColors.turquoise}
              />
              <ThemedText style={styles.cobrancaTitle}>Próxima cobrança: Alagoas</ThemedText>
            </View>
            <ThemedText style={styles.cobrancaSubtitle}>Clique para ver as informações</ThemedText>
          </View>
          <View style={styles.cobrancaChevronWrap}>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={14}
              tintColor={FlowHubColors.turquoise}
            />
          </View>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.financeCard}>
          <View style={styles.financeHeader}>
            <ThemedText style={styles.financeTitle}>{getCurrentMonthLabel()}</ThemedText>
            <Pressable>
              <ThemedText style={styles.financeLink}>Ver detalhes →</ThemedText>
            </Pressable>
          </View>

          <View style={styles.financeMetrics}>
            <View style={styles.metric}>
              <ThemedText style={styles.metricLabel}>Receita</ThemedText>
              <ThemedText style={styles.metricValueIncome}>{formatCurrency(0)}</ThemedText>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <ThemedText style={styles.metricLabel}>Despesas</ThemedText>
              <ThemedText style={styles.metricValueExpense}>{formatCurrency(0)}</ThemedText>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <ThemedText style={styles.metricLabel}>Lucro</ThemedText>
              <ThemedText style={styles.metricValueProfit}>{formatCurrency(0)}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Acesso rápido</ThemedText>
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.quickRow}>
                {row.map((action) => (
                  <Pressable
                    key={action.id}
                    style={({ pressed }) => [styles.quickItem, pressed && styles.pressed]}
                    onPress={() => {}}>
                    <View
                      style={[
                        styles.quickIconWrap,
                        quickActionShadow,
                        { backgroundColor: action.bg },
                      ]}>
                      <SymbolView name={action.icon} size={26} tintColor={action.color} />
                    </View>
                    <ThemedText style={styles.quickLabel}>{action.label}</ThemedText>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.infoCard, cardShadowSoft]}>
            <ThemedText style={styles.infoCardTitle}>Manutenções pendentes</ThemedText>
            <View style={styles.infoList}>
              <ThemedText style={styles.emptyInfoText} themeColor="textSecondary">
                Nenhuma manutenção pendente.
              </ThemedText>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadowSoft]}>
            <ThemedText style={styles.infoCardTitle}>Situação de estoques</ThemedText>
            <View style={styles.stockList}>
              {STOCK_SUMMARY.map((item) => (
                <View key={item.label} style={styles.stockRow}>
                  <ThemedText style={[styles.stockValue, { color: item.color }]}>
                    {item.value}
                  </ThemedText>
                  <ThemedText style={styles.stockLabel}>{item.label}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: FlowHubColors.lightGray,
  },
  headerLayer: {
    zIndex: 2,
    elevation: 2,
    backgroundColor: FlowHubColors.navy,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },
  headerTop: {
    gap: Spacing.three,
    paddingBottom: Spacing.three,
  },
  logo: {
    width: 220,
    height: 64,
    alignSelf: 'flex-start',
  },
  greeting: {
    color: FlowHubColors.white,
    fontSize: 30,
    fontWeight: '700',
  },
  cobrancaCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: FlowHubColors.petroleum,
    borderTopWidth: 1,
    borderTopColor: 'rgba(20, 200, 196, 0.18)',
    gap: Spacing.two,
    paddingLeft: 0,
  },
  cobrancaAccent: {
    width: 4,
    backgroundColor: FlowHubColors.turquoise,
  },
  cobrancaContent: {
    flex: 1,
    gap: 3,
    paddingVertical: 14,
    paddingLeft: Spacing.three,
  },
  cobrancaChevronWrap: {
    justifyContent: 'center',
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
    color: 'rgba(255, 255, 255, 0.65)',
  },
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  financeCard: {
    backgroundColor: FlowHubColors.white,
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: '#E2E8EE',
    ...cardShadowSoft,
  },
  financeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  financeLink: {
    fontSize: 13,
    fontWeight: '600',
    color: FlowHubColors.turquoise,
  },
  financeMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metric: {
    flex: 1,
    gap: 4,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8EE',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: FlowHubColors.darkGray,
    textTransform: 'capitalize',
  },
  metricValueIncome: {
    fontSize: 15,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  metricValueExpense: {
    fontSize: 15,
    fontWeight: '700',
    color: FeatureColors.expense,
  },
  metricValueProfit: {
    fontSize: 15,
    fontWeight: '700',
    color: FlowHubColors.turquoise,
  },
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  quickGrid: {
    gap: Spacing.three,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    paddingVertical: Spacing.one,
    minHeight: 96,
  },
  quickIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
    color: FlowHubColors.navy,
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'stretch',
  },
  infoCard: {
    flex: 1,
    backgroundColor: FlowHubColors.white,
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: '#E2E8EE',
    minHeight: 120,
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: FlowHubColors.navy,
    lineHeight: 18,
  },
  infoList: {
    gap: 6,
  },
  emptyInfoText: {
    fontSize: 12,
    lineHeight: 18,
  },
  stockList: {
    gap: 8,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '800',
    minWidth: 18,
  },
  stockLabel: {
    fontSize: 12,
    color: FlowHubColors.darkGray,
    flex: 1,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
