import { useCallback, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';

import type { CobrancaViagemFiltro } from '@/components/cobrancas/CobrancaViagemFilters';
import { parseRouteId } from '@/components/cobrancas/route-utils';
import {
  deleteCliente,
  getClientes,
  getCobrancaClientes,
  removerClienteCobranca,
  toggleClienteCobrado,
  updateCliente,
  vincularClienteCobranca,
  type Cliente,
  type CobrancaClienteItem,
  type UpdateClienteInput,
} from '@/services/api';

export type ClienteEditAction = 'desvincular' | 'excluir' | null;

export function useCobrancaClientesScreen(cobrancaIdParam: string | undefined) {
  const cobrancaId = parseRouteId(cobrancaIdParam) ?? Number.NaN;

  const [clientes, setClientes] = useState<CobrancaClienteItem[]>([]);
  const [cobrancaNome, setCobrancaNome] = useState('');
  const [intervaloDias, setIntervaloDias] = useState(30);
  const [dataViagem, setDataViagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<CobrancaViagemFiltro>('todos');
  const [busca, setBusca] = useState('');

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [editItem, setEditItem] = useState<CobrancaClienteItem | null>(null);
  const [confirmItem, setConfirmItem] = useState<CobrancaClienteItem | null>(null);
  const [allClientes, setAllClientes] = useState<Cliente[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [clienteAction, setClienteAction] = useState<ClienteEditAction>(null);
  const [clienteActionError, setClienteActionError] = useState<string | null>(null);
  const [clienteActionLoading, setClienteActionLoading] = useState(false);

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (Number.isNaN(cobrancaId)) {
        setError('Cobrança inválida.');
        setLoading(false);
        return;
      }
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const data = await getCobrancaClientes(cobrancaId);
        setClientes(data.clientes);
        setCobrancaNome(data.cobranca.nome);
        setIntervaloDias(data.cobranca.intervalo_dias);
        setDataViagem(data.cobranca.data_viagem);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar clientes.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [cobrancaId],
  );

  const stats = useMemo(() => {
    const pendentes = clientes.filter((c) => !c.cobrado);
    const cobrados = clientes.filter((c) => c.cobrado);
    return {
      pendentesCount: pendentes.length,
      cobradosCount: cobrados.length,
      totalDeve: pendentes.reduce((s, c) => s + c.totalDeve, 0),
      total: clientes.length,
    };
  }, [clientes]);

  const filtrados = useMemo(() => {
    let lista = [...clientes];
    if (filtro === 'pendentes') lista = lista.filter((c) => !c.cobrado);
    if (filtro === 'cobrados') lista = lista.filter((c) => c.cobrado);
    const termo = busca.trim().toLowerCase();
    if (termo) lista = lista.filter((c) => c.cliente.nome?.toLowerCase().includes(termo));
    return lista.sort((a, b) => {
      if (a.cobrado !== b.cobrado) return a.cobrado ? 1 : -1;
      return (a.cliente.nome ?? '').localeCompare(b.cliente.nome ?? '', 'pt-BR');
    });
  }, [clientes, filtro, busca]);

  const vinculadosIds = useMemo(() => clientes.map((c) => c.cliente.id), [clientes]);

  const filterCounts = useMemo(
    () => ({
      todos: clientes.length,
      pendentes: stats.pendentesCount,
      cobrados: stats.cobradosCount,
    }),
    [clientes.length, stats.pendentesCount, stats.cobradosCount],
  );

  function showSuccess(msg: string) {
    setSuccessMessage(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccessMessage(null), 2500);
  }

  function dismissActionError() {
    setActionError(null);
  }

  async function openAddModal() {
    setFormError(null);
    setAddVisible(true);
    try {
      setAllClientes(await getClientes());
    } catch (err) {
      setAllClientes([]);
      setFormError(err instanceof Error ? err.message : 'Erro ao carregar clientes.');
    }
  }

  function openConfirm(item: CobrancaClienteItem) {
    setConfirmError(null);
    setConfirmItem(item);
    setConfirmVisible(true);
  }

  async function handleConfirmRecebimento() {
    if (!confirmItem) return;
    setConfirming(true);
    setConfirmError(null);
    try {
      await toggleClienteCobrado(cobrancaId, confirmItem.cliente.id, true);
      setConfirmVisible(false);
      setConfirmItem(null);
      showSuccess('Cliente marcado como cobrado na viagem.');
      await loadData(true);
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : 'Erro ao marcar cobrado.');
    } finally {
      setConfirming(false);
    }
  }

  async function desfazerCobrado(item: CobrancaClienteItem) {
    setActionError(null);
    try {
      await toggleClienteCobrado(cobrancaId, item.cliente.id, false);
      showSuccess('Marcação de cobrado desfeita.');
      await loadData(true);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao desfazer cobrança.');
    }
  }

  function openEdit(item: CobrancaClienteItem) {
    setEditItem(item);
    setFormError(null);
    setEditVisible(true);
  }

  function requestDesvincular() {
    if (!editItem) return;
    setEditVisible(false);
    setClienteActionError(null);
    setClienteAction('desvincular');
  }

  function requestExcluir() {
    if (!editItem) return;
    setEditVisible(false);
    setClienteActionError(null);
    setClienteAction('excluir');
  }

  function closeClienteAction() {
    if (clienteActionLoading) return;
    setClienteAction(null);
    setClienteActionError(null);
    setEditItem(null);
  }

  async function handleConfirmClienteAction() {
    if (!editItem || !clienteAction) return;

    setClienteActionLoading(true);
    setClienteActionError(null);

    try {
      if (clienteAction === 'desvincular') {
        await removerClienteCobranca(cobrancaId, editItem.cliente.id);
      } else {
        await deleteCliente(editItem.cliente.id);
      }
      closeClienteAction();
      showSuccess(clienteAction === 'desvincular' ? 'Cliente desvinculado.' : 'Cliente excluído.');
      await loadData(true);
    } catch (err) {
      setClienteActionError(err instanceof Error ? err.message : 'Erro ao processar ação.');
    } finally {
      setClienteActionLoading(false);
    }
  }

  const clienteActionMeta = useMemo(() => {
    if (!editItem || !clienteAction) return null;

    const nome = editItem.cliente.nome?.trim() || 'Cliente';

    if (clienteAction === 'desvincular') {
      return {
        title: 'Desvincular cliente',
        message: 'Desvincular',
        highlight: `${nome} desta cobrança`,
        hint: 'O cliente permanece cadastrado no sistema e pode ser vinculado novamente depois.',
        confirmLabel: 'Desvincular',
      };
    }

    return {
      title: 'Excluir cliente',
      message: 'Excluir',
      highlight: `${nome} permanentemente`,
      hint: 'Mesas, leituras e vínculos com cobranças também serão removidos. Esta ação não pode ser desfeita.',
      confirmLabel: 'Excluir',
    };
  }, [editItem, clienteAction]);

  async function handleEditSave(data: {
    nome: string;
    cpf: string;
    endereco: string;
    numero: string;
  }) {
    if (!editItem || !data.nome.trim()) {
      setFormError('Informe o nome.');
      return;
    }
    const payload: UpdateClienteInput = {
      nome: data.nome.trim(),
      cpf: data.cpf.trim() || null,
      endereco: data.endereco.trim() || null,
      numero: data.numero.trim() || null,
    };
    setSaving(true);
    setFormError(null);
    try {
      await updateCliente(editItem.cliente.id, payload);
      setEditVisible(false);
      await loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleVincular(clienteId: number) {
    setSaving(true);
    setFormError(null);
    try {
      await vincularClienteCobranca(cobrancaId, { clienteId });
      setAddVisible(false);
      await loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao vincular.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCriar(data: {
    nome: string;
    cpf: string;
    endereco: string;
    numero: string;
    mesas: { numeracao: string }[];
  }) {
    if (!data.nome.trim()) {
      setFormError('Informe o nome.');
      return;
    }
    if (data.mesas.length === 0) {
      setFormError('Informe ao menos uma mesa.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await vincularClienteCobranca(cobrancaId, {
        cliente: {
          nome: data.nome.trim(),
          cpf: data.cpf.trim() || null,
          endereco: data.endereco.trim() || null,
          numero: data.numero.trim() || null,
          mesas: data.mesas,
        },
      });
      setAddVisible(false);
      await loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao criar cliente.');
    } finally {
      setSaving(false);
    }
  }

  function goToMesas(clienteId: number) {
    router.push(`/cobrancas/${cobrancaId}/mesas/${clienteId}`);
  }

  function closeConfirm() {
    if (!confirming) {
      setConfirmVisible(false);
      setConfirmItem(null);
      setConfirmError(null);
    }
  }

  return {
    cobrancaId,
    clientes,
    cobrancaNome,
    intervaloDias,
    dataViagem,
    loading,
    refreshing,
    error,
    filtro,
    setFiltro,
    busca,
    setBusca,
    stats,
    filtrados,
    filterCounts,
    vinculadosIds,
    allClientes,
    addVisible,
    setAddVisible,
    editVisible,
    setEditVisible,
    confirmVisible,
    editItem,
    confirmItem,
    saving,
    confirming,
    formError,
    confirmError,
    actionError,
    successMessage,
    dismissActionError,
    dismissSuccess: () => setSuccessMessage(null),
    loadData,
    openAddModal,
    openConfirm,
    handleConfirmRecebimento,
    desfazerCobrado,
    openEdit,
    handleEditSave,
    handleVincular,
    handleCriar,
    goToMesas,
    closeConfirm,
    requestDesvincular,
    requestExcluir,
    clienteActionVisible: clienteAction !== null,
    clienteActionMeta,
    clienteActionLoading,
    clienteActionError,
    closeClienteAction,
    handleConfirmClienteAction,
  };
}
