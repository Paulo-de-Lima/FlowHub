import { useCallback, useMemo, useRef, useState } from 'react';

import { parseRouteId } from '@/components/cobrancas/route-utils';
import { formatDate, saldoRegistro } from '@/components/cobrancas/cobrancas-utils';
import {
  createMesa,
  createRegistro,
  deleteMesa,
  deleteRegistro,
  getClienteMesas,
  getCobrancaClientes,
  toggleClienteCobrado,
  updateMesa,
  updateRegistro,
  type Mesa,
  type RegistroMesa,
} from '@/services/api';

export type DeleteTarget =
  | { kind: 'registro'; registro: RegistroMesa }
  | { kind: 'mesa'; mesa: Mesa };

export function useClienteMesasScreen(
  clienteIdParam: string | undefined,
  cobrancaIdParam?: string | undefined,
) {
  const clienteIdNum = parseRouteId(clienteIdParam);
  const cobrancaId = parseRouteId(cobrancaIdParam);

  const [clienteNome, setClienteNome] = useState('');
  const [cobrancaNome, setCobrancaNome] = useState('');
  const [clienteCobrado, setClienteCobrado] = useState(false);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mesaModalVisible, setMesaModalVisible] = useState(false);
  const [mesaEditMode, setMesaEditMode] = useState(false);
  const [mesaEditId, setMesaEditId] = useState<number | null>(null);
  const [mesaEditNumeracao, setMesaEditNumeracao] = useState('');
  const [mesaEditValorFicha, setMesaEditValorFicha] = useState(1.5);

  const [leituraModalVisible, setLeituraModalVisible] = useState(false);
  const [leituraMode, setLeituraMode] = useState<'create' | 'edit'>('create');
  const [registroEdit, setRegistroEdit] = useState<RegistroMesa | null>(null);
  const [mesaAtiva, setMesaAtiva] = useState<Mesa | null>(null);

  const [pagamentoModalVisible, setPagamentoModalVisible] = useState(false);
  const [pagamentoRegistro, setPagamentoRegistro] = useState<RegistroMesa | null>(null);

  const [confirmCobradoVisible, setConfirmCobradoVisible] = useState(false);
  const [confirmCobradoError, setConfirmCobradoError] = useState<string | null>(null);
  const [marcandoCobrado, setMarcandoCobrado] = useState(false);

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

  function showSuccess(msg: string) {
    setSuccessMessage(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccessMessage(null), 2500);
  }

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

        if (cobrancaId != null) {
          const cobData = await getCobrancaClientes(cobrancaId);
          setCobrancaNome(cobData.cobranca.nome?.trim() || '');
          const item = cobData.clientes.find((c) => c.cliente.id === clienteIdNum);
          setClienteCobrado(item?.cobrado ?? false);
        }

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
    [clienteIdNum, cobrancaId],
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
    setLeituraMode('create');
    setRegistroEdit(null);
    setFormError(null);
    setLeituraModalVisible(true);
  }

  function openEditLeitura(mesa: Mesa, registro: RegistroMesa) {
    setMesaAtiva(mesa);
    setLeituraMode('edit');
    setRegistroEdit(registro);
    setFormError(null);
    setLeituraModalVisible(true);
  }

  function closeLeituraModal() {
    setLeituraModalVisible(false);
    setRegistroEdit(null);
    setLeituraMode('create');
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
        showSuccess('Mesa atualizada.');
      } else {
        await createMesa(clienteIdNum, data);
        showSuccess('Mesa criada.');
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
    valor_pago?: number;
  }) {
    if (!mesaAtiva) return;

    setSaving(true);
    setFormError(null);

    try {
      if (leituraMode === 'edit' && registroEdit) {
        await updateRegistro(registroEdit.id, {
          data_leitura: data.data_leitura,
          leitura: data.leitura,
          deve: data.deve,
        });
        showSuccess('Leitura atualizada.');
      } else {
        await createRegistro(mesaAtiva.id, {
          data_leitura: data.data_leitura,
          leitura: data.leitura,
          deve: data.deve,
          valor_pago: data.valor_pago ?? 0,
        });
        showSuccess('Leitura salva.');
      }
      setLeituraModalVisible(false);
      setRegistroEdit(null);
      setLeituraMode('create');
      setExpandedId(mesaAtiva.id);
      await loadData(true);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : leituraMode === 'edit'
            ? 'Erro ao editar leitura.'
            : 'Erro ao criar leitura.',
      );
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
      showSuccess('Pagamento registrado.');
      await loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao registrar pagamento.');
    } finally {
      setSaving(false);
    }
  }

  function openMarcarCobrado() {
    if (cobrancaId == null) return;
    setConfirmCobradoError(null);
    setConfirmCobradoVisible(true);
  }

  function closeMarcarCobrado() {
    setConfirmCobradoVisible(false);
    setConfirmCobradoError(null);
  }

  async function handleMarcarCobrado() {
    if (cobrancaId == null || clienteIdNum == null) return;

    setMarcandoCobrado(true);
    setConfirmCobradoError(null);

    try {
      await toggleClienteCobrado(cobrancaId, clienteIdNum, true);
      setConfirmCobradoVisible(false);
      setClienteCobrado(true);
      showSuccess('Cliente marcado como cobrado na viagem.');
    } catch (err) {
      setConfirmCobradoError(
        err instanceof Error ? err.message : 'Erro ao marcar cobrado na viagem.',
      );
    } finally {
      setMarcandoCobrado(false);
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

    setDeleting(true);
    setDeleteError(null);

    try {
      if (deleteTarget.kind === 'registro') {
        await deleteRegistro(deleteTarget.registro.id);
        showSuccess('Leitura excluída.');
      } else {
        await deleteMesa(deleteTarget.mesa.id);
        setExpandedId((prev) => (prev === deleteTarget.mesa.id ? null : prev));
        showSuccess('Mesa excluída.');
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
          ? `Esta mesa tem ${leiturasCount} leitura${leiturasCount !== 1 ? 's' : ''} que serão apagadas permanentemente.`
          : 'Esta ação não pode ser desfeita.',
      confirmDisabled: false,
    };
  }, [deleteTarget]);

  return {
    clienteNome,
    cobrancaNome,
    clienteCobrado,
    mesas,
    expandedId,
    loading,
    refreshing,
    error,
    actionError,
    successMessage,
    stats,
    mesaModalVisible,
    mesaEditMode,
    mesaEditNumeracao,
    mesaEditValorFicha,
    leituraModalVisible,
    leituraMode,
    registroEdit,
    mesaAtiva,
    pagamentoModalVisible,
    pagamentoRegistro,
    confirmCobradoVisible,
    confirmCobradoError,
    marcandoCobrado,
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
    openEditLeitura,
    closeLeituraModal,
    openPagamentoModal,
    closePagamentoModal,
    handleSavePagamento,
    toggleExpanded,
    handleSaveMesa,
    handleSaveLeitura,
    openMarcarCobrado,
    closeMarcarCobrado,
    handleMarcarCobrado,
    openDeleteRegistroConfirm,
    openDeleteMesaConfirm,
    closeDeleteConfirm,
    handleConfirmDelete,
    dismissActionError,
    dismissSuccess: () => setSuccessMessage(null),
  };
}
