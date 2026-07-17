import { type SymbolViewProps } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';

import { FlowHubEmptyState } from '@/components/ui/FlowHubEmptyState';
import { FlowHubScreenBackdrop } from '@/components/ui/FlowHubScreenBackdrop';
import { FlowHubScreenHeader } from '@/components/ui/FlowHubScreenHeader';
import { HomeLayout, Spacing } from '@/constants/theme';
import { useTabBarScrollPadding } from '@/hooks/use-tab-bar-scroll-padding';

type PlaceholderScreenProps = {
  title: string;
  description: string;
  icon?: SymbolViewProps['name'];
};

export function PlaceholderScreen({
  title,
  description,
  icon = { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
}: PlaceholderScreenProps) {
  const scrollPad = useTabBarScrollPadding();

  return (
    <FlowHubScreenBackdrop>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: scrollPad }]}
        showsVerticalScrollIndicator={false}>
        <FlowHubScreenHeader title={title} subtitle="Em breve" />

        <View style={styles.heroWrap}>
          <FlowHubEmptyState
            icon={icon}
            title="Estamos preparando este módulo"
            description={description}
          />
        </View>
      </ScrollView>
    </FlowHubScreenBackdrop>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  heroWrap: {
    marginTop: HomeLayout.heroOverlap,
    paddingHorizontal: Spacing.four,
    flex: 1,
    justifyContent: 'center',
  },
});
