import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Type } from '../theme/typography';
import { spacing } from '../theme/tokens';

interface Props {
  children: React.ReactNode;
}

interface State {
  fout: Error | null;
}

class FoutGrensBinnen extends React.Component<Props & { colors: ReturnType<typeof useTheme>['colors'] }, State> {
  state: State = { fout: null };

  static getDerivedStateFromError(fout: Error): State {
    return { fout };
  }

  componentDidCatch(fout: Error, info: React.ErrorInfo) {
    console.error('FoutGrens ving een fout op:', fout, info);
  }

  render() {
    const { fout } = this.state;
    const { colors } = this.props;

    if (fout) {
      return (
        <View style={[styles.midden, { backgroundColor: colors.achtergrond }]}>
          <Text style={[Type.titel, styles.titel, { color: colors.tekstPrimair }]}>Er ging iets mis</Text>
          <Text style={[Type.body, styles.body, { color: colors.tekstGedimd }]}>
            Er is een onverwachte fout opgetreden. Probeer het opnieuw.
          </Text>
          <Pressable
            style={[styles.knop, { backgroundColor: colors.cta }]}
            onPress={() => this.setState({ fout: null })}
            accessibilityRole="button"
            accessibilityLabel="Opnieuw proberen"
          >
            <RefreshCw size={16} color="white" strokeWidth={2} />
            <Text style={[Type.body, styles.knopTekst]}>Opnieuw proberen</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

export function FoutGrens({ children }: Props) {
  const { colors } = useTheme();
  return <FoutGrensBinnen colors={colors}>{children}</FoutGrensBinnen>;
}

const styles = StyleSheet.create({
  midden: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  titel: { textAlign: 'center', marginBottom: spacing.sm },
  body: { textAlign: 'center', marginBottom: spacing.lg, lineHeight: 24 },
  knop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    minHeight: 44,
  },
  knopTekst: { color: 'white', fontWeight: '600' },
});
