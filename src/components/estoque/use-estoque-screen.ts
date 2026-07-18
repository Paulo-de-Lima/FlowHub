import { useCallback, useMemo, useRef, useState } from 'react';

import { sortMateriais, todayIsoDate } from '@/components/estoque/estoque-utils';
import {
  getMateriais,
  registrarCompraMaterial,
  type CompraMaterialInput,
  type Material,
} from '@/services/api';

export type CompraMaterialFormData = {
  nome: string;
  unidade: string;
  quantidade: string;
  valorTotal: string;
  dataCompra: string;
};

export function useEstoqueScreen() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [compraVisible, setCompraVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [compraError, setCompraError] = useState<string | null>(null);

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
      setMateriais(await getMateriais());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estoque.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const stats = useMemo(() => {
    let criticos = 0;
    let vazios = 0;
    let baixos = 0;
    let emDia = 0;

    for (const m of materiais) {
      if (m.status === 'VAZIO') {
        criticos++;
        vazios++;
      } else if (m.status === 'BAIXO') {
        criticos++;
        baixos++;
      } else if (m.status === 'ALTO') {
        emDia++;
      }
    }

    return {
      total: materiais.length,
      criticos,
      vazios,
      baixos,
      emDia,
      comprasMes: 0,
    };
  }, [materiais]);

  const materiaisOrdenados = useMemo(() => sortMateriais(materiais), [materiais]);

  const openCompra = useCallback(() => {
    setCompraError(null);
    setCompraVisible(true);
  }, []);

  const closeCompra = useCallback(() => {
    setCompraVisible(false);
    setCompraError(null);
  }, []);

  async function handleCompra(data: CompraMaterialFormData) {
    const nome = data.nome.trim();
    if (!nome) {
      setCompraError('Informe o nome do material.');
      return;
    }

    const quantidade = Number.parseFloat(data.quantidade.trim().replace(',', '.'));
    if (Number.isNaN(quantidade) || quantidade <= 0) {
      setCompraError('Informe uma quantidade válida.');
      return;
    }

    const valorTotal = Number.parseFloat(data.valorTotal.trim().replace(',', '.'));
    if (Number.isNaN(valorTotal) || valorTotal < 0) {
      setCompraError('Informe um valor total válido.');
      return;
    }

    const dataCompra = data.dataCompra.trim() || todayIsoDate();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataCompra)) {
      setCompraError('Informe a data no formato AAAA-MM-DD.');
      return;
    }

    setSaving(true);
    setCompraError(null);

    const payload: CompraMaterialInput = {
      nome,
      quantidade,
      valorTotal,
      dataCompra,
    };

    const unidade = data.unidade.trim();
    if (unidade) payload.unidade = unidade;

    try {
      await registrarCompraMaterial(payload);
      closeCompra();
      showSuccess('Compra registrada.');
      await loadData(true);
    } catch (err) {
      setCompraError(err instanceof Error ? err.message : 'Erro ao registrar compra.');
    } finally {
      setSaving(false);
    }
  }

  return {
    materiais: materiaisOrdenados,
    loading,
    refreshing,
    error,
    stats,
    compraVisible,
    saving,
    compraError,
    successMessage,
    loadData,
    openCompra,
    closeCompra,
    handleCompra,
    dismissSuccess: () => setSuccessMessage(null),
  };
}
