import { LinearGradient } from 'expo-linear-gradient';

import { SymbolView } from 'expo-symbols';

import { Platform, Pressable, StyleSheet, View } from 'react-native';



import {

  formatCobrancaTitulo,

  formatCurrency,

  formatIntervaloDias,

  formatProximaViagem,

  formatRepeticaoPrevista,

} from '@/components/cobrancas/cobrancas-utils';

import { ThemedText } from '@/components/themed-text';

import { cardShadowSoft, FlowHubColors, Radius, Spacing } from '@/constants/theme';

import type { Cobranca } from '@/services/api';



type CobrancaCardProps = {

  cobranca: Cobranca;

  destacada?: boolean;

  onIniciar: () => void;

  onEdit: () => void;

  onDelete: () => void;

};



export function CobrancaCard({

  cobranca,

  destacada,

  onIniciar,

  onEdit,

  onDelete,

}: CobrancaCardProps) {

  const titulo = formatCobrancaTitulo(cobranca.nome);

  const progressPct =

    cobranca.totalClientes > 0 ? cobranca.clientesCobrados / cobranca.totalClientes : 0;



  const content = (

    <>

      <View style={styles.header}>

        <View style={styles.titleRow}>

          <SymbolView

            name={{ ios: 'map.fill', android: 'map', web: 'map' }}

            size={18}

            tintColor={destacada ? FlowHubColors.turquoise : FlowHubColors.petroleum}

          />

          <ThemedText style={[styles.title, destacada && styles.titleHighlight]} numberOfLines={1}>

            {titulo}

          </ThemedText>

        </View>

        <View style={styles.headerActions}>

          {destacada ? (

            <View style={styles.badge}>

              <ThemedText style={styles.badgeText}>Próxima</ThemedText>

            </View>

          ) : null}

          <Pressable

            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}

            onPress={onEdit}

            accessibilityLabel="Editar cobrança">

            <SymbolView

              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}

              size={16}

              tintColor={destacada ? FlowHubColors.white : FlowHubColors.petroleum}

            />

          </Pressable>

          <Pressable

            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}

            onPress={onDelete}

            accessibilityLabel="Excluir cobrança">

            <SymbolView

              name={{ ios: 'trash', android: 'delete', web: 'delete' }}

              size={16}

              tintColor={destacada ? '#FFB4B4' : '#C0392B'}

            />

          </Pressable>

        </View>

      </View>



      <View style={styles.metaGrid}>

        <View style={[styles.metaCell, destacada && styles.metaCellHighlight]}>

          <ThemedText style={[styles.metaLabel, destacada && styles.metaHighlight]}>

            Clientes

          </ThemedText>

          <ThemedText style={[styles.metaValue, destacada && styles.titleHighlight]}>

            {cobranca.totalClientes}

          </ThemedText>

        </View>

        <View style={[styles.metaCell, destacada && styles.metaCellHighlight]}>

          <ThemedText style={[styles.metaLabel, destacada && styles.metaHighlight]}>

            Próxima viagem

          </ThemedText>

          <ThemedText style={[styles.metaValue, destacada && styles.titleHighlight]}>

            {formatProximaViagem(cobranca.proximaViagem, cobranca.data_viagem)}

          </ThemedText>

        </View>

      </View>



      <View style={styles.intervaloRow}>

        <ThemedText style={[styles.intervaloLabel, destacada && styles.metaHighlight]}>

          {formatIntervaloDias(cobranca.intervalo_dias)}

        </ThemedText>

        <ThemedText style={[styles.repeticaoLabel, destacada && styles.metaHighlight]}>

          Repetição: {formatRepeticaoPrevista(cobranca.data_viagem, cobranca.intervalo_dias)}

        </ThemedText>

      </View>



      <View style={styles.arrecadadoRow}>

        <ThemedText style={[styles.arrecadadoLabel, destacada && styles.metaHighlight]}>

          Arrecadado anteriormente

        </ThemedText>

        <ThemedText style={[styles.arrecadadoValue, destacada && styles.arrecadadoHighlight]}>

          {formatCurrency(cobranca.totalArrecadadoAnterior)}

        </ThemedText>

      </View>



      <View style={styles.progressSection}>

        <View style={styles.progressHeader}>

          <ThemedText style={[styles.progressLabel, destacada && styles.metaHighlight]}>

            Progresso

          </ThemedText>

          <ThemedText style={[styles.progressCount, destacada && styles.titleHighlight]}>

            {cobranca.clientesCobrados}/{cobranca.totalClientes}

          </ThemedText>

        </View>

        <View style={[styles.progressTrack, destacada && styles.progressTrackHighlight]}>

          <View

            style={[

              styles.progressFill,

              destacada && styles.progressFillHighlight,

              { width: `${progressPct * 100}%` },

            ]}

          />

        </View>

      </View>



      <Pressable

        style={({ pressed }) => [

          styles.iniciarBtn,

          destacada && styles.iniciarBtnHighlight,

          pressed && styles.pressed,

        ]}

        onPress={onIniciar}>

        <ThemedText style={[styles.iniciarText, destacada && styles.iniciarTextHighlight]}>

          Iniciar

        </ThemedText>

        <SymbolView

          name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}

          size={16}

          tintColor={destacada ? FlowHubColors.navy : FlowHubColors.white}

        />

      </Pressable>

    </>

  );



  if (destacada) {

    return (

      <LinearGradient

        colors={[FlowHubColors.navy, FlowHubColors.petroleum]}

        start={{ x: 0, y: 0 }}

        end={{ x: 1, y: 1 }}

        style={[styles.card, styles.cardHighlight, cardShadowSoft, styles.glowBorder]}>

        {content}

      </LinearGradient>

    );

  }



  return <View style={[styles.card, cardShadowSoft, styles.cardNormal]}>{content}</View>;

}



const styles = StyleSheet.create({

  card: {

    borderRadius: Radius.lg,

    padding: Spacing.three,

    gap: Spacing.two,

  },

  cardNormal: {

    backgroundColor: FlowHubColors.white,

    borderWidth: 1,

    borderColor: '#E8EDF2',

  },

  cardHighlight: {

    backgroundColor: 'transparent',

  },

  glowBorder: {

    borderWidth: 1.5,

    borderColor: FlowHubColors.turquoise,

    ...Platform.select({

      web: {

        boxShadow: '0 4px 20px rgba(20, 200, 196, 0.25)',

      },

      default: {

        shadowColor: FlowHubColors.turquoise,

        shadowOffset: { width: 0, height: 4 },

        shadowOpacity: 0.25,

        shadowRadius: 12,

        elevation: 6,

      },

    }),

  },

  header: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: Spacing.two,

  },

  titleRow: {

    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    gap: Spacing.one,

  },

  headerActions: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,

  },

  iconBtn: {

    width: 32,

    height: 32,

    borderRadius: 8,

    alignItems: 'center',

    justifyContent: 'center',

  },

  title: {

    flex: 1,

    fontSize: 16,

    fontWeight: '700',

    color: FlowHubColors.navy,

  },

  titleHighlight: { color: FlowHubColors.white },

  badge: {

    backgroundColor: FlowHubColors.turquoise,

    borderRadius: 8,

    paddingHorizontal: 8,

    paddingVertical: 3,

    marginRight: 2,

  },

  badgeText: {

    fontSize: 11,

    fontWeight: '700',

    color: FlowHubColors.navy,

  },

  metaGrid: {

    flexDirection: 'row',

    gap: Spacing.two,

  },

  metaCell: {

    flex: 1,

    backgroundColor: FlowHubColors.lightGray,

    borderRadius: Radius.md,

    padding: Spacing.two,

    gap: 2,

  },

  metaCellHighlight: {

    backgroundColor: 'rgba(255, 255, 255, 0.1)',

  },

  metaLabel: {

    fontSize: 11,

    fontWeight: '600',

    color: FlowHubColors.darkGray,

    textTransform: 'uppercase',

    letterSpacing: 0.3,

  },

  metaValue: {

    fontSize: 14,

    fontWeight: '700',

    color: FlowHubColors.navy,

  },

  metaHighlight: { color: 'rgba(255,255,255,0.65)' },

  intervaloRow: {

    alignItems: 'flex-start',

    gap: 2,

  },

  intervaloLabel: {

    fontSize: 12,

    fontWeight: '600',

    color: FlowHubColors.petroleum,

  },

  repeticaoLabel: {

    fontSize: 11,

    fontWeight: '500',

    color: FlowHubColors.darkGray,

  },

  arrecadadoRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

  },

  arrecadadoLabel: {

    fontSize: 13,

    color: FlowHubColors.darkGray,

  },

  arrecadadoValue: {

    fontSize: 16,

    fontWeight: '700',

    color: FlowHubColors.petroleum,

  },

  arrecadadoHighlight: {

    color: FlowHubColors.turquoise,

  },

  progressSection: {

    gap: Spacing.one,

  },

  progressHeader: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

  },

  progressLabel: {

    fontSize: 12,

    fontWeight: '600',

    color: FlowHubColors.darkGray,

  },

  progressCount: {

    fontSize: 12,

    fontWeight: '700',

    color: FlowHubColors.petroleum,

  },

  progressTrack: {

    height: 6,

    backgroundColor: '#E2E8EE',

    borderRadius: 3,

    overflow: 'hidden',

  },

  progressTrackHighlight: {

    backgroundColor: 'rgba(255,255,255,0.2)',

  },

  progressFill: {

    height: '100%',

    backgroundColor: FlowHubColors.turquoise,

    borderRadius: 3,

  },

  progressFillHighlight: {

    backgroundColor: FlowHubColors.turquoise,

  },

  iniciarBtn: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: Spacing.one,

    backgroundColor: FlowHubColors.navy,

    borderRadius: Radius.md,

    paddingVertical: 13,

  },

  iniciarBtnHighlight: {

    backgroundColor: FlowHubColors.turquoise,

  },

  iniciarText: {

    color: FlowHubColors.white,

    fontWeight: '700',

    fontSize: 15,

  },

  iniciarTextHighlight: {

    color: FlowHubColors.navy,

  },

  pressed: {

    opacity: 0.88,

    transform: [{ scale: 0.99 }],

  },

});

