import { type ReactNode } from 'react';

import { FlowHubScreenHeader } from '@/components/ui/FlowHubScreenHeader';
import type { HeaderBreadcrumbSegment } from '@/components/ui/FlowHubHeaderBreadcrumb';

type MesasClienteHeaderProps = {
  nome: string;
  mesasCount: number;
  onBack: () => void;
  breadcrumb?: HeaderBreadcrumbSegment[];
  headerAction?: ReactNode;
};

export function MesasClienteHeader({
  nome,
  mesasCount,
  onBack,
  breadcrumb,
  headerAction,
}: MesasClienteHeaderProps) {
  const subtitle =
    mesasCount === 0
      ? 'Mesas e leituras'
      : mesasCount === 1
        ? '1 mesa'
        : `${mesasCount} mesas`;

  return (
    <FlowHubScreenHeader
      layout={headerAction ? 'detail-action' : 'detail'}
      title={nome || 'Cliente'}
      subtitle={subtitle}
      breadcrumb={breadcrumb}
      onBack={onBack}
      headerRight={headerAction}
      heroOverlap
    />
  );
}
