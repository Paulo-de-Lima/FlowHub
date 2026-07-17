import { type ReactNode } from 'react';

import { FlowHubScreenHeader } from '@/components/ui/FlowHubScreenHeader';

import { formatIntervaloDias, formatProximaViagem } from '@/components/cobrancas/cobrancas-utils';

type CobrancaViagemHeaderProps = {
  nome: string;
  intervaloDias: number;
  dataViagem?: string | null;
  onBack: () => void;
  headerAction?: ReactNode;
};

export function CobrancaViagemHeader({
  nome,
  intervaloDias,
  dataViagem,
  onBack,
  headerAction,
}: CobrancaViagemHeaderProps) {
  return (
    <FlowHubScreenHeader
      title={nome || 'Cobrança'}
      subtitle={`${dataViagem ? `Viagem: ${formatProximaViagem(dataViagem)} · ` : ''}Intervalo: ${formatIntervaloDias(intervaloDias)}`}
      onBack={onBack}
      headerRight={headerAction}
      heroOverlap
      variant="detail"
    />
  );
}
