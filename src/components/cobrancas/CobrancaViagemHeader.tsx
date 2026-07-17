import { type ReactNode } from 'react';

import { formatIntervaloDias, formatProximaViagem } from '@/components/cobrancas/cobrancas-utils';
import { FlowHubScreenHeader } from '@/components/ui/FlowHubScreenHeader';
import type { HeaderBreadcrumbSegment } from '@/components/ui/FlowHubHeaderBreadcrumb';

type CobrancaViagemHeaderProps = {
  nome: string;
  intervaloDias: number;
  dataViagem?: string | null;
  onBack: () => void;
  breadcrumb?: HeaderBreadcrumbSegment[];
  headerAction?: ReactNode;
};

export function CobrancaViagemHeader({
  nome,
  intervaloDias,
  dataViagem,
  onBack,
  breadcrumb,
  headerAction,
}: CobrancaViagemHeaderProps) {
  const subtitle = dataViagem
    ? formatProximaViagem(dataViagem)
    : formatIntervaloDias(intervaloDias);

  return (
    <FlowHubScreenHeader
      layout={headerAction ? 'detail-action' : 'detail'}
      title={nome || 'Cobrança'}
      subtitle={subtitle}
      breadcrumb={breadcrumb}
      onBack={onBack}
      headerRight={headerAction}
      heroOverlap
    />
  );
}
