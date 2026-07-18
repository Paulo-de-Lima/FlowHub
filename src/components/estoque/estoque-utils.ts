import type { FlowHubStatusBadgeVariant } from '@/components/ui/FlowHubStatusBadge';
import type { Material, MaterialStatus } from '@/services/api';

export function materialStatusLabel(status: MaterialStatus): string {
  switch (status) {
    case 'VAZIO':
      return 'Vazio';
    case 'BAIXO':
      return 'Baixo';
    case 'ALTO':
      return 'Em dia';
    default:
      return status;
  }
}

export function materialStatusBadgeVariant(status: MaterialStatus): FlowHubStatusBadgeVariant {
  switch (status) {
    case 'VAZIO':
      return 'debt';
    case 'BAIXO':
      return 'pending';
    case 'ALTO':
      return 'ok';
    default:
      return 'neutral';
  }
}

export function formatMaterialQuantidade(material: Pick<Material, 'quantidade' | 'unidade'>): string {
  const qtd = material.quantidade;
  const unidade = material.unidade?.trim() || 'un';
  return `${qtd} ${unidade}`;
}

export function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isMaterialCritico(status: MaterialStatus): boolean {
  return status === 'VAZIO' || status === 'BAIXO';
}

export function sortMateriais(list: Material[]): Material[] {
  const priority: Record<MaterialStatus, number> = { VAZIO: 0, BAIXO: 1, ALTO: 2 };
  return [...list].sort((a, b) => {
    const byStatus = priority[a.status] - priority[b.status];
    if (byStatus !== 0) return byStatus;
    return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' });
  });
}
