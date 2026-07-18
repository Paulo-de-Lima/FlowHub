import { useCallback, useMemo, useRef, useState } from 'react';

import {
  createLancamento,
  getCurrentMonthKey,
  getFinanceiroLancamentos,
  getFinanceiroResumo,
  type CreateLancamentoInput,
  type FinanceiroResumo,
  type LancamentoFinanceiro,
} from '@/services/api';

export type FinanceiroFiltro = 'todos' | 'receita' | 'despesa';

export type LancamentoFormData = {
  tipo: 'receita' | 'despesa';
  origem: string;
  valor: number;
  dataGasto: string;
};

export function useFinanceiroScreen() {
  const [mes, setMes] = useState(getCurrentMonthKey);
  const [resumo, setResumo] = useState<FinanceiroResumo | null>(null);
  const [lancamentos, setLancamentos] = useState<LancamentoFinanceiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<FinanceiroFiltro>('todos');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState<'receita' | 'despesa'>('receita');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showSuccess(msg: string) {
    setSuccessMessage(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccessMessage(null), 2500);
  }

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [resumoData, lancamentosData] = await Promise.all([
        getFinanceiroResumo(mes),
        getFinanceiroLancamentos({ mes, tipo: 'todos' }),
      ]);
      setResumo(resumoData);
      setLancamentos(lancamentosData.lancamentos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar financeiro.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [mes]);

  const filterCounts = useMemo(
    () => ({
      todos: lancamentos.length,
      receita: lancamentos.filter((l) => l.tipo === 'receita').length,
      despesa: lancamentos.filter((l) => l.tipo === 'despesa').length,
    }),
    [lancamentos],
  );

  const filtrados = useMemo(() => {
    if (filtro === 'todos') return lancamentos;
    return lancamentos.filter((l) => l.tipo === filtro);
  }, [lancamentos, filtro]);

  const openModal = useCallback((tipo: 'receita' | 'despesa' = 'receita') => {
    setModalTipo(tipo);
    setFormError(null);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setFormError(null);
  }, []);

  async function handleSave(data: LancamentoFormData) {
    if (!data.origem.trim()) {
      setFormError('Informe a origem do lançamento.');
      return;
    }

    if (!Number.isFinite(data.valor) || data.valor <= 0) {
      setFormError('Informe um valor válido.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const payload: CreateLancamentoInput = {
        tipo: data.tipo,
        origem: data.origem.trim(),
        valor: data.valor,
        dataGasto: data.dataGasto || undefined,
      };
      await createLancamento(payload);
      closeModal();
      showSuccess(data.tipo === 'receita' ? 'Receita registrada.' : 'Despesa registrada.');
      await loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar lançamento.');
    } finally {
      setSaving(false);
    }
  }

  return {
    mes,
    setMes,
    resumo,
    lancamentos,
    filtrados,
    loading,
    refreshing,
    error,
    filtro,
    filterCounts,
    modalVisible,
    modalTipo,
    saving,
    formError,
    successMessage,
    setFiltro,
    loadData,
    openModal,
    closeModal,
    handleSave,
    dismissSuccess: () => setSuccessMessage(null),
  };
}
