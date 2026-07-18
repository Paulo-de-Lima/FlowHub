export type MaterialStatusDb = 'VAZIO' | 'BAIXO' | 'ALTO';

export function calcularStatusMaterial(
  quantidade: number,
  estoqueMinimo: number,
): MaterialStatusDb {
  if (quantidade <= 0) return 'VAZIO';
  if (quantidade <= estoqueMinimo) return 'BAIXO';
  return 'ALTO';
}

export function serializeMaterial(material: {
  id: number;
  nome: string;
  unidade: string;
  quantidade: number;
  estoque_minimo: number;
  status: MaterialStatusDb;
  created_at: Date | null;
  updated_at: Date | null;
}) {
  return {
    id: material.id,
    nome: material.nome,
    unidade: material.unidade,
    quantidade: material.quantidade,
    estoqueMinimo: material.estoque_minimo,
    status: material.status,
    createdAt: material.created_at?.toISOString() ?? null,
    updatedAt: material.updated_at?.toISOString() ?? null,
  };
}
