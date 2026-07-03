import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { FlowHubColors, Spacing } from '@/constants/theme';

type PlaceholderScreenProps = {
  title: string;
  description: string;
};

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.description} themeColor="textSecondary">
          {description}
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FlowHubColors.lightGray,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: FlowHubColors.navy,
  },
  description: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
});
