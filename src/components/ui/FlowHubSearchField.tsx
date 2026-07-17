import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { FlowHubColors, FlowHubPalette, Radius, Spacing } from '@/constants/theme';

/** Contorno sutil escuro — destacar busca em repouso; turquoise ao focar. */
export const FlowHubSearchBorder = {
  default: 'rgba(11, 31, 58, 0.16)',
  focused: FlowHubColors.turquoise,
} as const;

type FlowHubSearchFieldProps = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
};

export function FlowHubSearchField({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  style,
}: FlowHubSearchFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.wrap,
        { borderColor: focused ? FlowHubSearchBorder.focused : FlowHubSearchBorder.default },
        focused && styles.wrapFocused,
        style,
      ]}>
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={18}
        tintColor={focused ? FlowHubColors.turquoise : FlowHubColors.darkGray}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={FlowHubColors.darkGray}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: FlowHubPalette.surfaceSunken,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    minHeight: 44,
  },
  wrapFocused: {
    backgroundColor: FlowHubColors.white,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 15,
    color: FlowHubColors.navy,
  },
});
