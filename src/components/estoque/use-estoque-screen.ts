import { useCallback, useMemo, useRef, useState } from 'react';

import { sortMateriais } from '@/components/estoque/estoque-utils';
import {
  createMaterial,
  deleteMaterial,
  getMateriais,
  updateMaterial,
  type Material,
} from '@/services/api';

import type { MaterialFormData } from './MaterialFormModal';

export function useEstoqueScreen() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editItem, setEditItem] = useState<Material | null>(null);
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

    return { total: materiais.length, criticos, vazios, baixos, emDia };
  }, [materiais]);

  const materiaisOrdenados = useMemo(() => sortMateriais(materiais), [materiais]);

  const openCreate = useCallback(() => {
    setFormMode('create');
    setEditItem(null);
    setFormError(null);
    setFormVisible(true);
  }, []);

  const openEdit = useCallback((item: Material) => {
    setFormMode('edit');
    setEditItem(item);
    setFormError(null);
    setFormVisible(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormVisible(false);
    setEditItem(null);
    setFormError(null);
  }, []);

  async function handleSave(data: MaterialFormData) {
    const nome = data.nome.trim();
    if (!nome) {
      setFormError('Informe o nome do material.');
      return;
    }

    const unidade = data.unidade.trim();
    if (!unidade) {
      setFormError('Informe a unidade do material.');
      return;
    }

    const estoqueMinimo = Number.parseInt(data.estoqueMinimo.trim(), 10);
    if (Number.isNaN(estoqueMinimo) || estoqueMinimo <= 0) {
      setFormError('Informe um estoque mínimo válido.');
      return;
    }

    const quantidade = Number.parseFloat(data.quantidade.trim().replace(',', '.'));
    if (Number.isNaN(quantidade) || quantidade < 0) {
      setFormError('Informe uma quantidade válida.');
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      nome,
      unidade,
      quantidade,
      estoqueMinimo,
    };

    try {
      if (formMode === 'edit' && editItem) {
        await updateMaterial(editItem.id, payload);
        closeForm();
        showSuccess('Material atualizado.');
      } else {
        await createMaterial(payload);
        closeForm();
        showSuccess('Material registrado.');
      }
      await loadData(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar material.');
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
      await deleteMaterial(editItem.id);
      closeDelete();
      closeForm();
      showSuccess('Material excluído.');
      await loadData(true);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao excluir material.');
    } finally {
      setDeleting(false);
    }
  }

  return {
    materiais: materiaisOrdenados,
    loading,
    refreshing,
    error,
    stats,
    formVisible,
    formMode,
    editItem,
    saving,
    formError,
    deleteVisible,
    deleting,
    deleteError,
    successMessage,
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
