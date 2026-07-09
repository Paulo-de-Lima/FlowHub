import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import { StyleSheet, View } from 'react-native';



import { formatCurrency } from '@/components/cobrancas/cobrancas-utils';

import { ThemedText } from '@/components/themed-text';

import { cardShadowSoft, FlowHubColors, Radius, Spacing } from '@/constants/theme';



type CobrancasKpiStripProps = {

  viagens: number;

  clientes: number;

  arrecadadoMes: number;

  monthLabel: string;

};



type KpiItem = {

  id: string;

  label: string;

  displayValue: string;

  compact?: boolean;

  hint: string;

  valueColor: string;

  icon: SymbolViewProps['name'];

};



export function CobrancasKpiStrip({

  viagens,

  clientes,

  arrecadadoMes,

  monthLabel,

}: CobrancasKpiStripProps) {

  const items: KpiItem[] = [

    {

      id: 'viagens',

      label: 'Viagens',

      displayValue: String(viagens),

      hint: 'cadastradas',

      valueColor: FlowHubColors.turquoise,

      icon: { ios: 'map.fill', android: 'map', web: 'map' },

    },

    {

      id: 'clientes',

      label: 'Clientes',

      displayValue: String(clientes),

      hint: 'vinculados',

      valueColor: FlowHubColors.petroleum,

      icon: { ios: 'person.2.fill', android: 'group', web: 'group' },

    },

    {

      id: 'arrecadado',

      label: 'Arrecadado',

      displayValue: formatCurrency(arrecadadoMes),

      compact: true,

      hint: `em ${monthLabel.toLowerCase()}`,

      valueColor: FlowHubColors.turquoise,

      icon: { ios: 'dollarsign.circle.fill', android: 'paid', web: 'paid' },

    },

  ];



  return (

    <View style={styles.row}>

      {items.map((item) => (

        <View key={item.id} style={[styles.item, cardShadowSoft]}>

          <View style={styles.iconWrap}>

            <SymbolView name={item.icon} size={18} tintColor={FlowHubColors.petroleum} />

          </View>

          <ThemedText

            style={[

              styles.value,

              item.compact && styles.valueCompact,

              { color: item.valueColor },

            ]}

            numberOfLines={1}

            adjustsFontSizeToFit>

            {item.displayValue}

          </ThemedText>

          <ThemedText style={styles.label}>{item.label}</ThemedText>

          <ThemedText style={styles.hint}>{item.hint}</ThemedText>

        </View>

      ))}

    </View>

  );

}



const styles = StyleSheet.create({

  row: {

    flexDirection: 'row',

    gap: Spacing.two,

  },

  item: {

    flex: 1,

    backgroundColor: FlowHubColors.white,

    borderRadius: Radius.lg,

    paddingVertical: Spacing.three,

    paddingHorizontal: Spacing.two,

    alignItems: 'center',

    gap: 2,

  },

  iconWrap: {

    width: 32,

    height: 32,

    borderRadius: 10,

    backgroundColor: '#E0F9F8',

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: Spacing.one,

  },

  value: {

    fontSize: 22,

    fontWeight: '800',

    lineHeight: 26,

  },

  valueCompact: {

    fontSize: 14,

    lineHeight: 18,

  },

  label: {

    fontSize: 11,

    fontWeight: '700',

    color: FlowHubColors.navy,

    textAlign: 'center',

  },

  hint: {

    fontSize: 10,

    fontWeight: '500',

    color: FlowHubColors.darkGray,

    textAlign: 'center',

  },

});

