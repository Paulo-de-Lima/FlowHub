import { useCallback, useRef, useState } from 'react';

import { parseRouteId } from '@/components/clientes/route-utils';
import {
  getCliente,
  getClienteMesas,
  getClienteSummary,
  type Cliente,
  type ClienteSummary,
} from '@/services/api';

export function useClienteDetailScreen(clienteIdParam: string | undefined) {
  const clienteId = parseRouteId(clienteIdParam);

  const [cliente, setCliente] = useState<ClienteSummary | null>(null);
  const [clienteBase, setClienteBase] = useState<Cliente | null>(null);
  const [totalPago, setTotalPago] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showSuccess(msg: string) {
    setSuccessMessage(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccessMessage(null), 2500);
  }

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (clienteId === null) {
        setError('Cliente inválido.');
        setLoading(false);
        return;
      }

      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const [summary, mesasData, base] = await Promise.all([
          getClienteSummary(clienteId),
          getClienteMesas(clienteId),
          getCliente(clienteId),
        ]);
        setCliente(summary);
        setClienteBase(base);
        setTotalPago(mesasData.mesas.reduce((s, m) => s + m.totalPago, 0));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar cliente.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [clienteId],
  );

  return {
    clienteId,
    cliente,
    clienteBase,
    totalPago,
    loading,
    refreshing,
    error,
    successMessage,
    loadData,
    showSuccess,
    dismissSuccess: () => setSuccessMessage(null),
  };
}
