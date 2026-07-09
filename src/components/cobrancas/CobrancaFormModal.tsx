import React from 'react';

import {

  ActivityIndicator,

  KeyboardAvoidingView,

  Modal,

  Platform,

  Pressable,

  ScrollView,

  StyleSheet,

  TextInput,

  View,

} from 'react-native';



import { ThemedText } from '@/components/themed-text';

import { cardShadowSoft, FlowHubColors, Radius, Spacing } from '@/constants/theme';

import {
  formatDate,
  formatRepeticaoPrevista,
  parseDisplayDateToISO,
  todayDisplay,
} from '@/components/cobrancas/cobrancas-utils';
import type { Cobranca, CobrancaInput } from '@/services/api';



type CobrancaFormModalProps = {

  visible: boolean;

  saving: boolean;

  error: string | null;

  cobranca?: Cobranca | null;

  onClose: () => void;

  onSubmit: (data: CobrancaInput) => void;

};



export function CobrancaFormModal({

  visible,

  saving,

  error,

  cobranca,

  onClose,

  onSubmit,

}: CobrancaFormModalProps) {

  const isEditing = cobranca != null;



  const [nome, setNome] = React.useState('');

  const [dataViagem, setDataViagem] = React.useState('');

  const [intervaloDias, setIntervaloDias] = React.useState('30');

  const [observacoes, setObservacoes] = React.useState('');



  React.useEffect(() => {

    if (visible) {

      setNome(cobranca?.nome ?? '');

      setDataViagem(

        cobranca?.data_viagem

          ? formatDate(cobranca.data_viagem)

          : todayDisplay(),

      );

      setIntervaloDias(String(cobranca?.intervalo_dias ?? 30));

      setObservacoes(cobranca?.observacoes ?? '');

    }

  }, [visible, cobranca]);



  const intervaloNum = Number(intervaloDias);

  const repeticaoHint =

    Number.isInteger(intervaloNum) && intervaloNum >= 1

      ? formatRepeticaoPrevista(parseDisplayDateToISO(dataViagem), intervaloNum)

      : null;



  function handleSubmit() {

    const iso = parseDisplayDateToISO(dataViagem);

    onSubmit({

      nome: nome.trim(),

      data_viagem: iso ?? '',

      intervalo_dias: Number(intervaloDias),

      observacoes: observacoes.trim() || null,

    });

  }



  return (

    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>

      <KeyboardAvoidingView

        style={styles.overlay}

        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <View style={[styles.card, cardShadowSoft]}>

          <ThemedText style={styles.title}>

            {isEditing ? 'Editar cobrança' : 'Nova cobrança'}

          </ThemedText>



          <ScrollView

            keyboardShouldPersistTaps="handled"

            showsVerticalScrollIndicator={false}

            contentContainerStyle={styles.form}>

            <Field label="Nome da cobrança *">

              <TextInput

                value={nome}

                onChangeText={setNome}

                placeholder="Ex.: Maceió - AL ou Rota Norte"

                placeholderTextColor={FlowHubColors.darkGray}

                style={styles.input}

              />

              <ThemedText style={styles.hint}>

                Use o nome que preferir para identificar esta rota.

              </ThemedText>

            </Field>



            <Field label="Data da próxima viagem *">

              <TextInput

                value={dataViagem}

                onChangeText={setDataViagem}

                placeholder={todayDisplay()}

                placeholderTextColor={FlowHubColors.darkGray}

                keyboardType="numbers-and-punctuation"

                style={styles.input}

              />

              <ThemedText style={styles.hint}>

                Data agendada para a próxima ida à rota (DD/MM/AAAA).

              </ThemedText>

            </Field>



            <Field label="Intervalo de cobrança (dias) *">

              <TextInput

                value={intervaloDias}

                onChangeText={setIntervaloDias}

                placeholder="30"

                placeholderTextColor={FlowHubColors.darkGray}

                keyboardType="number-pad"

                style={styles.input}

              />

              <ThemedText style={styles.hint}>

                Ex.: 15 para cobrar de 15 em 15 dias, 30 para mensal.

                {repeticaoHint && repeticaoHint !== '—'

                  ? ` Após esta viagem, retorno previsto em ${repeticaoHint}.`

                  : ''}

              </ThemedText>

            </Field>



            <Field label="Observações">

              <TextInput

                value={observacoes}

                onChangeText={setObservacoes}

                placeholder="Opcional"

                placeholderTextColor={FlowHubColors.darkGray}

                multiline

                style={[styles.input, styles.textArea]}

              />

            </Field>



            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}



            <View style={styles.actions}>

              <Pressable style={styles.cancelBtn} onPress={onClose} disabled={saving}>

                <ThemedText style={styles.cancelText}>Cancelar</ThemedText>

              </Pressable>

              <Pressable

                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}

                onPress={handleSubmit}

                disabled={saving}>

                {saving ? (

                  <ActivityIndicator color={FlowHubColors.white} />

                ) : (

                  <ThemedText style={styles.saveText}>

                    {isEditing ? 'Salvar' : 'Criar'}

                  </ThemedText>

                )}

              </Pressable>

            </View>

          </ScrollView>

        </View>

      </KeyboardAvoidingView>

    </Modal>

  );

}



function Field({ label, children }: { label: string; children: React.ReactNode }) {

  return (

    <View style={styles.field}>

      <ThemedText style={styles.label}>{label}</ThemedText>

      {children}

    </View>

  );

}



const styles = StyleSheet.create({

  overlay: {

    flex: 1,

    backgroundColor: 'rgba(11, 31, 58, 0.45)',

    justifyContent: 'flex-end',

  },

  card: {

    backgroundColor: FlowHubColors.white,

    borderTopLeftRadius: Radius.xl,

    borderTopRightRadius: Radius.xl,

    paddingHorizontal: Spacing.four,

    paddingTop: Spacing.four,

    paddingBottom: Spacing.five,

    maxHeight: '90%',

  },

  title: {

    fontSize: 20,

    fontWeight: '700',

    color: FlowHubColors.navy,

    marginBottom: Spacing.three,

  },

  form: { gap: Spacing.three },

  field: { gap: Spacing.one },

  label: { fontSize: 14, fontWeight: '600', color: FlowHubColors.navy },

  hint: {

    fontSize: 12,

    color: FlowHubColors.darkGray,

    lineHeight: 17,

  },

  input: {

    backgroundColor: FlowHubColors.lightGray,

    borderRadius: Radius.md,

    paddingHorizontal: Spacing.three,

    paddingVertical: 14,

    fontSize: 16,

    color: FlowHubColors.navy,

    borderWidth: 1,

    borderColor: '#E2E8EE',

  },

  textArea: { minHeight: 80, textAlignVertical: 'top' },

  error: { color: FlowHubColors.petroleum, fontSize: 14 },

  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two },

  cancelBtn: {

    flex: 1,

    borderRadius: Radius.md,

    paddingVertical: 14,

    alignItems: 'center',

    backgroundColor: FlowHubColors.lightGray,

  },

  cancelText: { color: FlowHubColors.darkGray, fontWeight: '700', fontSize: 15 },

  saveBtn: {

    flex: 1,

    borderRadius: Radius.md,

    paddingVertical: 14,

    alignItems: 'center',

    backgroundColor: FlowHubColors.navy,

  },

  saveBtnDisabled: { opacity: 0.7 },

  saveText: { color: FlowHubColors.white, fontWeight: '700', fontSize: 15 },

});

