import {
  FlowHubScreenHeader,
  type FlowHubHeaderLayout,
} from '@/components/ui/FlowHubScreenHeader';

type EstoqueHeaderProps = {
  totalMateriais?: number;
  criticos?: number;
};

function formatEstoqueFooter(total: number, criticos: number): string {
  const materiaisLabel = total === 1 ? '1 material' : `${total} materiais`;
  const criticosLabel = criticos === 1 ? '1 crítico' : `${criticos} críticos`;
  return `${materiaisLabel} · ${criticosLabel}`;
}

export function EstoqueHeader({ totalMateriais = 0, criticos = 0 }: EstoqueHeaderProps) {
  const layout: FlowHubHeaderLayout = 'root-tab';

  return (
    <FlowHubScreenHeader
      layout={layout}
      title="Estoque"
      subtitle="Materiais e níveis de estoque"
      footer={formatEstoqueFooter(totalMateriais, criticos)}
      moduleIcon={{ ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' }}
      heroOverlap
    />
  );
}
