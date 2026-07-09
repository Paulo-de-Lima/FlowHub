import { useCallback, useMemo, useState } from 'react';

import { parseRouteId } from '@/components/cobrancas/route-utils';
import { formatDate, saldoRegistro } from '@/components/cobrancas/cobrancas-utils';
import {
  createMesa,
  createRegistro,
  deleteMesa,
  deleteRegistro,
  getClienteMesas,
  updateMesa,
  updateRegistro,
  type Mesa,
  type RegistroMesa,
} from '@/services/api';

export type DeleteTarget =
  | { kind: 'registro'; registro: RegistroMesa }
  | { kind: 'mesa'; mesa: Mesa };

export function useClienteMesasScreen(clienteIdParam: string | undefined) {
  const clienteIdNum = parseRouteId(clienteIdParam);

  const [clienteNome, setClienteNome] = useState('');
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [mesaModalVisible, setMesaModalVisible] = useState(false);
  const [mesaEditMode, setMesaEditMode] = useState(false);
  const [mesaEditId, setMesaEditId] = useState<number | null>(null);
  const [mesaEditNumeracao, setMesaEditNumeracao] = useState('');
  const [mesaEditValorFicha, setMesaEditValorFicha] = useState(1.5);

  const [leituraModalVisible, setLeituraModalVisible] = useState(false);
  const [mesaAtiva, setMesaAtiva] = useState<Mesa | null>(null);

  const [pagamentoModalVisible, setPagamentoModalVisible] = useState(false);
  const [pagamentoRegistro, setPagamentoRegistro] = useState<RegistroMesa | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const stats = useMemo(() => {
    let totalDeve = 0;
    let totalPago = 0;
    let registrosPendentes = 0;

    for (const mesa of mesas) {
      totalDeve += mesa.totalDeve;
      totalPago += mesa.totalPago;
      for (const reg of mesa.registros) {
        if (saldoRegistro(reg) > 0) registrosPendentes++;
      }
    }

    return {
      totalDeve,
      totalPago,
      mesasCount: mesas.length,
      registrosPendentes,
    };
  }, [mesas]);

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (clienteIdNum === null) {
        setError('Cliente inválido.');
        setLoading(false);
        return;
      }

      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      setActionError(null);

      try {
        const data = await getClienteMesas(clienteIdNum);
        setClienteNome(data.cliente.nome?.trim() || 'Cliente');
        setMesas(data.mesas);

        setExpandedId((prev) => {
          if (!isRefresh && data.mesas.length === 1) return data.mesas[0].id;
          if (prev !== null && data.mesas.some((m) => m.id === prev)) return prev;
          return data.mesas.length === 1 ? (data.mesas[0]?.id ?? null) : prev;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar mesas.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [clienteIdNum],
  );

  function openNovaMesa() {
    setMesaEditMode(false);
    setMesaEditId(null);
    setMesaEditNumeracao('');
    setMesaEditValorFicha(1.5);
    setFormError(null);
    setMesaModalVisible(true);
  }

  function openEditMesa(mesa: Mesa) {
    setMesaEditMode(true);
    setMesaEditId(mesa.id);
    setMesaEditNumeracao(mesa.numeracao);
    setMesaEditValorFicha(mesa.valor_ficha);
    setFormError(null);
    setMesaModalVisible(true);
  }

  function closeMesaModal() {
    setMesaModalVisible(false);
    setFormError(null);
  }

  function openNovaLeitura(mesa: Mesa) {
    setMesaAtiva(mesa);
    setFormError(null);
    setLeituraModalVisible(true);
  }

  function closeLeituraModal() {
    setLeituraModalVisible(false);
    setFormError(null);
  }

  function toggleExpanded(mesaId: number) {
    setExpandedId((prev) => (prev === mesaId ? null : mesaId));
  }

  async function handleSaveMesa(data: { numeracao: string; valor_ficha: number }) {
    if (clienteIdNum === null) return;

    setSaving(true);
    setFormError(null);

    try {
      if (mesaEditMode && mesaEditId !== null) {
        await updateMesa(mesaEditId, data);
      } else {
        await createMesa(clienteIdNum, data);
      }
      setMesaModalVisible(false);
      await loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar mesa.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveLeitura(data: {
    data_leitura: string;
    leitura: number;
    deve: number;
    valor_pago: number;
  }) {
    if (!mesaAtiva) return;

    setSaving(true);
    setFormError(null);

    try {
      await createRegistro(mesaAtiva.id, data);
      setLeituraModalVisible(false);
      setExpandedId(mesaAtiva.id);
      await loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao criar leitura.');
    } finally {
      setSaving(false);
    }
  }

  function openPagamentoModal(registro: RegistroMesa) {
    setPagamentoRegistro(registro);
    setFormError(null);
    setPagamentoModalVisible(true);
  }

  function closePagamentoModal() {
    setPagamentoModalVisible(false);
    setPagamentoRegistro(null);
    setFormError(null);
  }

  async function handleSavePagamento(valorPago: number) {
    if (!pagamentoRegistro) return;

    setSaving(true);
    setFormError(null);
    setActionError(null);

    try {
      await updateRegistro(pagamentoRegistro.id, { valor_pago: valorPago });
      closePagamentoModal();
      await loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao registrar pagamento.');
    } finally {
      setSaving(false);
    }
  }

  function openDeleteRegistroConfirm(registro: RegistroMesa) {
    setDeleteTarget({ kind: 'registro', registro });
    setDeleteError(null);
  }

  function openDeleteMesaConfirm(mesa: Mesa) {
    setDeleteTarget({ kind: 'mesa', mesa });
    setDeleteError(null);
  }

  function closeDeleteConfirm() {
    setDeleteTarget(null);
    setDeleteError(null);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    if (deleteTarget.kind === 'mesa' && deleteTarget.mesa.registros.length > 0) {
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      if (deleteTarget.kind === 'registro') {
        await deleteRegistro(deleteTarget.registro.id);
      } else {
        await deleteMesa(deleteTarget.mesa.id);
        setExpandedId((prev) => (prev === deleteTarget.mesa.id ? null : prev));
      }
      closeDeleteConfirm();
      await loadData(true);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao excluir.');
    } finally {
      setDeleting(false);
    }
  }

  function dismissActionError() {
    setActionError(null);
  }

  const deleteModalMeta = useMemo(() => {
    if (!deleteTarget) return null;

    if (deleteTarget.kind === 'registro') {
      const { registro } = deleteTarget;
      return {
        title: 'Excluir leitura',
        message: 'Deseja excluir a leitura de',
        highlight: `${formatDate(registro.data_leitura)} (leitura ${registro.leitura})`,
        hint: 'Esta ação não pode ser desfeita.',
        confirmDisabled: false,
      };
    }

    const { mesa } = deleteTarget;
    const leiturasCount = mesa.registros.length;
    return {
      title: 'Excluir mesa',
      message: 'Deseja excluir a mesa',
      highlight: mesa.numeracao,
      hint:
        leiturasCount > 0
          ? `Esta mesa possui ${leiturasCount} leitura${leiturasCount !== 1 ? 's' : ''}. Exclua todas as leituras antes de remover a mesa.`
          : 'Esta ação não pode ser desfeita.',
      confirmDisabled: leiturasCount > 0,
    };
  }, [deleteTarget]);

  return {
    clienteNome,
    mesas,
    expandedId,
    loading,
    refreshing,
    error,
    actionError,
    stats,
    mesaModalVisible,
    mesaEditMode,
    mesaEditNumeracao,
    mesaEditValorFicha,
    leituraModalVisible,
    mesaAtiva,
    pagamentoModalVisible,
    pagamentoRegistro,
    deleteVisible: deleteTarget !== null,
    deleteModalMeta,
    deleting,
    deleteError,
    saving,
    formError,
    loadData,
    openNovaMesa,
    openEditMesa,
    closeMesaModal,
    openNovaLeitura,
    closeLeituraModal,
    openPagamentoModal,
    closePagamentoModal,
    handleSavePagamento,
    toggleExpanded,
    handleSaveMesa,
    handleSaveLeitura,
    openDeleteRegistroConfirm,
    openDeleteMesaConfirm,
    closeDeleteConfirm,
    handleConfirmDelete,
    dismissActionError,
  };
}
