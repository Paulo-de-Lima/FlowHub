import { formatDate } from '@/components/cobrancas/cobrancas-utils';
import { getCurrentMonthLabel } from '@/components/home/home-utils';
import type { Manutencao, Material } from '@/services/api';

export type ManutencaoStats = {
  totalMes: number;
  materiaisUsadosMes: number;
  clientesAtendidos: number;
  monthLabel: string;
};

export type ManutencaoFormPayload = {
  clienteId: number;
  descricao: string;
  itens: { materialId: number; quantidade: number }[];
};

export function formatManutencaoDate(value: string): string {
  return formatDate(value);
}

export function summarizeDescricao(descricao: string, maxLength = 100): string {
  const trimmed = descricao.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1).trim()}…`;
}

export function formatQuantidade(quantidade: number, unidade: string): string {
  const qtd =
    Number.isInteger(quantidade) ? String(quantidade) : quantidade.toLocaleString('pt-BR');
  return `${qtd} ${unidade}`;
}

export function formatMaterialChipLabel(
  nome: string,
  quantidade: number,
  unidade: string,
): string {
  return `${nome} · ${formatQuantidade(quantidade, unidade)}`;
}

export function formatManutencoesFooter(totalMes: number): string {
  if (totalMes === 0) return 'Nenhuma manutenção este mês';
  if (totalMes === 1) return '1 manutenção este mês';
  return `${totalMes} manutenções este mês`;
}

export function computeManutencaoStats(manutencoes: Manutencao[]): ManutencaoStats {
  const clientes = new Set<number>();
  let materiaisUsadosMes = 0;

  for (const m of manutencoes) {
    clientes.add(m.clienteId);
    for (const item of m.itens) {
      materiaisUsadosMes += item.quantidade;
    }
  }

  return {
    totalMes: manutencoes.length,
    materiaisUsadosMes,
    clientesAtendidos: clientes.size,
    monthLabel: getCurrentMonthLabel(),
  };
}

export function validateManutencaoForm(
  data: ManutencaoFormPayload,
  materiaisById: Map<number, Material>,
): string | null {
  if (!Number.isFinite(data.clienteId) || data.clienteId <= 0) {
    return 'Selecione um cliente.';
  }

  if (!data.descricao.trim()) {
    return 'Informe a descrição da manutenção.';
  }

  if (data.itens.length === 0) {
    return 'Adicione pelo menos um material.';
  }

  const totals = new Map<number, number>();

  for (const item of data.itens) {
    if (!Number.isFinite(item.materialId) || item.materialId <= 0) {
      return 'Selecione todos os materiais.';
    }

    const qtd = Number(item.quantidade);
    if (!Number.isFinite(qtd) || qtd <= 0) {
      return 'Cada material deve ter quantidade maior que zero.';
    }

    totals.set(item.materialId, (totals.get(item.materialId) ?? 0) + qtd);
  }

  for (const [materialId, total] of totals) {
    const material = materiaisById.get(materialId);
    if (!material) {
      return 'Um ou mais materiais não foram encontrados.';
    }
    if (material.quantidade < total) {
      return `Estoque insuficiente de "${material.nome}". Disponível: ${formatQuantidade(material.quantidade, material.unidade)}.`;
    }
  }

  return null;
}
