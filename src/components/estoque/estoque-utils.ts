import type { FlowHubStatusBadgeVariant } from '@/components/ui/FlowHubStatusBadge';
import { FeatureColors, FlowHubColors, FlowHubPalette } from '@/constants/theme';
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

export function getMaterialStockRatio(material: Pick<Material, 'quantidade' | 'estoqueMinimo'>): number {
  if (material.estoqueMinimo <= 0) return material.quantidade > 0 ? 1 : 0;
  return Math.min(1.5, material.quantidade / material.estoqueMinimo);
}

export function materialStatusBlockStyle(status: MaterialStatus): {
  backgroundColor: string;
  valueColor: string;
} {
  switch (status) {
    case 'VAZIO':
      return { backgroundColor: FeatureColors.expenseBg, valueColor: FeatureColors.expense };
    case 'BAIXO':
      return { backgroundColor: FeatureColors.materialBg, valueColor: FeatureColors.material };
    default:
      return { backgroundColor: FlowHubPalette.surfaceSunken, valueColor: FlowHubColors.navy };
  }
}

export function formatMaterialDate(iso: string | null): string {
  if (!iso) return '—';
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('pt-BR');
}

export function getMaterialDisplayDate(material: Pick<Material, 'updatedAt' | 'createdAt'>): string {
  return formatMaterialDate(material.updatedAt ?? material.createdAt);
}

export function sortMateriais(list: Material[]): Material[] {
  const priority: Record<MaterialStatus, number> = { VAZIO: 0, BAIXO: 1, ALTO: 2 };
  return [...list].sort((a, b) => {
    const byStatus = priority[a.status] - priority[b.status];
    if (byStatus !== 0) return byStatus;
    return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' });
  });
}
