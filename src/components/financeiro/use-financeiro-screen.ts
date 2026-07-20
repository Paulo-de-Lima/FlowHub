import { useCallback, useMemo, useRef, useState } from 'react';

import {
  createLancamento,
  deleteLancamento,
  getFinanceiroLancamentos,
  getFinanceiroResumo,
  getPagamentosPendentesClientes,
  updateLancamento,
  type CreateLancamentoInput,
  type FinanceiroResumo,
  type LancamentoFinanceiro,
  type PagamentoPendenteCliente,
} from '@/services/api';

export type FinanceiroTab = 'historico' | 'pendentes';
export type FinanceiroFiltro = 'todos' | 'receita' | 'despesa';

export type LancamentoFormData = {
  tipo: 'receita' | 'despesa';
  origem: string;
  valor: number;
  dataGasto: string;
};

export function useFinanceiroScreen() {
  const [mes] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [resumo, setResumo] = useState<FinanceiroResumo | null>(null);
  const [lancamentos, setLancamentos] = useState<LancamentoFinanceiro[]>([]);
  const [pendentes, setPendentes] = useState<PagamentoPendenteCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<FinanceiroTab>('historico');
  const [filtro, setFiltro] = useState<FinanceiroFiltro>('todos');
  const [busca, setBusca] = useState('');
  const [buscaPendentes, setBuscaPendentes] = useState('');

  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editItem, setEditItem] = useState<LancamentoFinanceiro | null>(null);
  const [modalTipo, setModalTipo] = useState<'receita' | 'despesa'>('receita');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailItem, setDetailItem] = useState<LancamentoFinanceiro | null>(null);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
      const [resumoData, lancamentosData, pendentesData] = await Promise.all([
        getFinanceiroResumo(mes),
        getFinanceiroLancamentos({ tipo: 'todos', limit: 500 }),
        getPagamentosPendentesClientes(),
      ]);
      setResumo(resumoData);
      setLancamentos(lancamentosData.lancamentos);
      setPendentes(pendentesData);
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
    let lista = [...lancamentos];
    if (filtro !== 'todos') lista = lista.filter((l) => l.tipo === filtro);

    const termo = busca.trim().toLowerCase();
    if (termo) {
      lista = lista.filter((l) => l.origem.toLowerCase().includes(termo));
    }

    return lista;
  }, [lancamentos, filtro, busca]);

  const pendentesFiltrados = useMemo(() => {
    const termo = buscaPendentes.trim().toLowerCase();
    if (!termo) return pendentes;

    return pendentes.filter((c) => {
      const nome = c.nome?.toLowerCase() ?? '';
      const tel = c.numero?.toLowerCase() ?? '';
      return nome.includes(termo) || tel.includes(termo);
    });
  }, [pendentes, buscaPendentes]);

  const openModal = useCallback((tipo: 'receita' | 'despesa' = 'receita') => {
    setFormMode('create');
    setEditItem(null);
    setModalTipo(tipo);
    setFormError(null);
    setFormVisible(true);
  }, []);

  const openEditFromDetail = useCallback(() => {
    if (!detailItem || detailItem.automatico) return;
    setFormMode('edit');
    setEditItem(detailItem);
    setModalTipo(detailItem.tipo);
    setFormError(null);
    setDetailVisible(false);
    setFormVisible(true);
  }, [detailItem]);

  const closeModal = useCallback(() => {
    setFormVisible(false);
    setEditItem(null);
    setFormError(null);
  }, []);

  function openDetail(item: LancamentoFinanceiro) {
    setDetailItem(item);
    setDetailVisible(true);
  }

  function closeDetail() {
    setDetailVisible(false);
    setDetailItem(null);
  }

  function requestDeleteFromDetail() {
    if (!detailItem || detailItem.automatico) return;
    setDeleteError(null);
    setDeleteVisible(true);
  }

  function closeDelete() {
    setDeleteVisible(false);
    setDeleteError(null);
  }

  async function handleSave(data: LancamentoFormData) {
    if (!data.origem.trim()) {
      setFormError('Informe a origem do registro.');
      return;
    }

    if (!Number.isFinite(data.valor) || data.valor <= 0) {
      setFormError('Informe um valor válido.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (formMode === 'edit' && editItem) {
        await updateLancamento(editItem.id, {
          tipo: data.tipo,
          origem: data.origem.trim(),
          valor: data.valor,
          dataGasto: data.dataGasto || undefined,
        });
        closeModal();
        closeDetail();
        showSuccess('Registro atualizado.');
      } else {
        const payload: CreateLancamentoInput = {
          tipo: data.tipo,
          origem: data.origem.trim(),
          valor: data.valor,
          dataGasto: data.dataGasto || undefined,
        };
        await createLancamento(payload);
        closeModal();
        showSuccess(data.tipo === 'receita' ? 'Receita registrada.' : 'Despesa registrada.');
      }
      await loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar registro.');
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!detailItem) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteLancamento(detailItem.id);
      closeDelete();
      closeDetail();
      showSuccess('Registro excluído.');
      await loadData(true);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao excluir registro.');
    } finally {
      setDeleting(false);
    }
  }

  return {
    mes,
    resumo,
    lancamentos,
    filtrados,
    pendentesFiltrados,
    pendentesCount: pendentes.length,
    loading,
    refreshing,
    error,
    tab,
    filtro,
    filterCounts,
    busca,
    buscaPendentes,
    formVisible,
    formMode,
    editItem,
    modalTipo,
    saving,
    formError,
    detailVisible,
    detailItem,
    deleteVisible,
    deleting,
    deleteError,
    successMessage,
    setTab,
    setFiltro,
    setBusca,
    setBuscaPendentes,
    loadData,
    openModal,
    openEditFromDetail,
    closeModal,
    openDetail,
    closeDetail,
    requestDeleteFromDetail,
    closeDelete,
    handleSave,
    handleConfirmDelete,
    dismissSuccess: () => setSuccessMessage(null),
  };
}
