import { useCallback, useMemo, useState } from 'react';
import { router } from 'expo-router';

import type { CobrancaViagemFiltro } from '@/components/cobrancas/CobrancaViagemFilters';
import { parseRouteId } from '@/components/cobrancas/route-utils';
import {
  getClientes,
  getCobrancaClientes,
  toggleClienteCobrado,
  updateCliente,
  vincularClienteCobranca,
  type Cliente,
  type CobrancaClienteItem,
  type UpdateClienteInput,
} from '@/services/api';

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

  async function openAddModal() {
    setFormError(null);
    setAddVisible(true);
    try {
      setAllClientes(await getClientes());
    } catch {
      setAllClientes([]);
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
      await loadData(true);
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : 'Erro ao marcar cobrado.');
    } finally {
      setConfirming(false);
    }
  }

  async function desfazerCobrado(item: CobrancaClienteItem) {
    try {
      await toggleClienteCobrado(cobrancaId, item.cliente.id, false);
      await loadData(true);
    } catch {
      /* noop */
    }
  }

  function openEdit(item: CobrancaClienteItem) {
    setEditItem(item);
    setFormError(null);
    setEditVisible(true);
  }

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
      numero: data.numero.trim() ? Number.parseInt(data.numero.trim(), 10) : null,
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
          numero: data.numero.trim() ? Number.parseInt(data.numero.trim(), 10) : null,
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
  };
}
