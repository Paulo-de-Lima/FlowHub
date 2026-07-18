import { useCallback, useMemo, useRef, useState } from 'react';

import {
  computeManutencaoStats,
  validateManutencaoForm,
  type ManutencaoFormPayload,
  type ManutencaoStats,
} from '@/components/manutencao/manutencao-utils';
import {
  createManutencao,
  getClientesSummary,
  getCurrentMonthKey,
  getManutencoes,
  getMateriais,
  type ClienteSummary,
  type Manutencao,
  type Material,
} from '@/services/api';

export function useManutencaoScreen() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [clientes, setClientes] = useState<ClienteSummary[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formVisible, setFormVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const materiaisById = useMemo(
    () => new Map(materiais.map((m) => [m.id, m])),
    [materiais],
  );

  const stats: ManutencaoStats = useMemo(
    () => computeManutencaoStats(manutencoes),
    [manutencoes],
  );

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
      const mes = getCurrentMonthKey();
      const [manutencoesData, clientesData, materiaisData] = await Promise.all([
        getManutencoes(mes),
        getClientesSummary(),
        getMateriais(),
      ]);
      setManutencoes(manutencoesData);
      setClientes(clientesData);
      setMateriais(materiaisData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar manutenções.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const openCreate = useCallback(() => {
    setFormError(null);
    setFormVisible(true);
  }, []);

  const closeForm = useCallback(() => {
    if (saving) return;
    setFormVisible(false);
    setFormError(null);
  }, [saving]);

  const handleSave = useCallback(
    async (data: ManutencaoFormPayload) => {
      const validationError = validateManutencaoForm(data, materiaisById);
      if (validationError) {
        setFormError(validationError);
        return;
      }

      setSaving(true);
      setFormError(null);

      try {
        await createManutencao({
          clienteId: data.clienteId,
          descricao: data.descricao.trim(),
          itens: data.itens,
        });
        setFormVisible(false);
        showSuccess('Manutenção registrada com sucesso.');
        await loadData(true);
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Erro ao registrar manutenção.');
      } finally {
        setSaving(false);
      }
    },
    [loadData, materiaisById],
  );

  return {
    manutencoes,
    clientes,
    materiais,
    loading,
    refreshing,
    error,
    stats,
    formVisible,
    saving,
    formError,
    successMessage,
    loadData,
    openCreate,
    closeForm,
    handleSave,
    dismissSuccess: () => setSuccessMessage(null),
  };
}
