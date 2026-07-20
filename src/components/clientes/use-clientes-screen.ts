import { useCallback, useMemo, useRef, useState } from 'react';

import {
  createCliente,
  deleteCliente,
  getClientesSummary,
  getCobrancas,
  updateCliente,
  type ClienteSummary,
  type Cobranca,
  type CreateClienteInput,
  type UpdateClienteInput,
} from '@/services/api';

export type ClientesFiltroKey = 'com_divida' | 'em_dia' | `cobranca:${number}`;
export type ClientesFiltro = ClientesFiltroKey | null;

export type ClienteFilterOption = {
  key: ClientesFiltroKey;
  label: string;
  count: number;
};

export type ClienteFormData = {
  nome: string;
  cpf: string;
  endereco: string;
  numero: string;
};

export function useClientesScreen() {
  const [clientes, setClientes] = useState<ClienteSummary[]>([]);
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<ClientesFiltro>(null);

  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editItem, setEditItem] = useState<ClienteSummary | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
      const [clientesData, cobrancasResp] = await Promise.all([
        getClientesSummary(),
        getCobrancas(),
      ]);
      setClientes(clientesData);
      setCobrancas(cobrancasResp.cobrancas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const stats = useMemo(() => {
    let comDivida = 0;
    let totalReceber = 0;
    let comMesa = 0;
    let emDia = 0;
    let semMesa = 0;

    for (const c of clientes) {
      if (c.totalDeve > 0) {
        comDivida++;
        totalReceber += c.totalDeve;
      }
      if (c.qtdMesas > 0) comMesa++;
      else semMesa++;
      if (c.qtdMesas > 0 && c.totalDeve === 0) emDia++;
    }

    return {
      total: clientes.length,
      comDivida,
      totalReceber,
      comMesa,
      emDia,
      semMesa,
    };
  }, [clientes]);

  const filterOptions = useMemo((): ClienteFilterOption[] => {
    const cobrancasOrdenadas = [...cobrancas].sort((a, b) =>
      a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }),
    );

    return [
      {
        key: 'com_divida',
        label: 'Com dívida',
        count: clientes.filter((c) => c.totalDeve > 0).length,
      },
      {
        key: 'em_dia',
        label: 'Em dia',
        count: clientes.filter((c) => c.qtdMesas > 0 && c.totalDeve === 0).length,
      },
      ...cobrancasOrdenadas.map((cobranca) => ({
        key: `cobranca:${cobranca.id}` as ClientesFiltroKey,
        label: cobranca.nome,
        count: clientes.filter((c) => c.cobrancaIds.includes(cobranca.id)).length,
      })),
    ];
  }, [clientes, cobrancas]);

  const filtrados = useMemo(() => {
    let lista = [...clientes];

    if (filtro === 'com_divida') {
      lista = lista.filter((c) => c.totalDeve > 0);
    } else if (filtro === 'em_dia') {
      lista = lista.filter((c) => c.qtdMesas > 0 && c.totalDeve === 0);
    } else if (filtro?.startsWith('cobranca:')) {
      const cobrancaId = Number(filtro.slice('cobranca:'.length));
      lista = lista.filter((c) => c.cobrancaIds.includes(cobrancaId));
    }

    const termo = busca.trim().toLowerCase();
    if (termo) {
      lista = lista.filter((c) => {
        const nome = c.nome?.toLowerCase() ?? '';
        const cpf = c.cpf?.toLowerCase() ?? '';
        const tel = c.numero?.toLowerCase() ?? '';
        return nome.includes(termo) || cpf.includes(termo) || tel.includes(termo);
      });
    }

    return lista.sort((a, b) =>
      (a.nome ?? '').localeCompare(b.nome ?? '', 'pt-BR', { sensitivity: 'base' }),
    );
  }, [clientes, filtro, busca]);

  function toggleFiltro(key: ClientesFiltroKey) {
    setFiltro((prev) => (prev === key ? null : key));
  }

  function openCreate() {
    setFormMode('create');
    setEditItem(null);
    setFormError(null);
    setFormVisible(true);
  }

  function openEdit(item: ClienteSummary) {
    setFormMode('edit');
    setEditItem(item);
    setFormError(null);
    setFormVisible(true);
  }

  function closeForm() {
    setFormVisible(false);
    setEditItem(null);
    setFormError(null);
  }

  function toPayload(data: ClienteFormData): CreateClienteInput {
    return {
      nome: data.nome.trim(),
      cpf: data.cpf.trim() || null,
      endereco: data.endereco.trim() || null,
      numero: data.numero.trim() || null,
    };
  }

  async function handleSave(data: ClienteFormData) {
    if (!data.nome.trim()) {
      setFormError('Informe o nome do cliente.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const payload = toPayload(data);
      if (formMode === 'edit' && editItem) {
        await updateCliente(editItem.id, payload as UpdateClienteInput);
        showSuccess('Cliente atualizado.');
      } else {
        await createCliente(payload);
        showSuccess('Cliente criado.');
      }
      closeForm();
      await loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar cliente.');
    } finally {
      setSaving(false);
    }
  }

  function requestDelete() {
    setDeleteError(null);
    setDeleteVisible(true);
  }

  function closeDelete() {
    setDeleteVisible(false);
    setDeleteError(null);
  }

  async function handleConfirmDelete() {
    if (!editItem) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteCliente(editItem.id);
      closeDelete();
      closeForm();
      showSuccess('Cliente excluído.');
      await loadData(true);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao excluir cliente.');
    } finally {
      setDeleting(false);
    }
  }

  return {
    clientes,
    filtrados,
    loading,
    refreshing,
    error,
    busca,
    filtro,
    stats,
    filterOptions,
    formVisible,
    formMode,
    editItem,
    saving,
    formError,
    deleteVisible,
    deleting,
    deleteError,
    successMessage,
    setBusca,
    toggleFiltro,
    loadData,
    openCreate,
    openEdit,
    closeForm,
    handleSave,
    requestDelete,
    closeDelete,
    handleConfirmDelete,
    dismissSuccess: () => setSuccessMessage(null),
  };
}
