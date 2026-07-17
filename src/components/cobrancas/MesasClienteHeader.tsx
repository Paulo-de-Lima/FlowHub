import { type ReactNode } from 'react';

import { FlowHubScreenHeader } from '@/components/ui/FlowHubScreenHeader';

type MesasClienteHeaderProps = {
  cobrancaNome?: string;
  nome: string;
  mesasCount: number;
  onBack: () => void;
  headerAction?: ReactNode;
};

export function MesasClienteHeader({
  cobrancaNome,
  nome,
  mesasCount,
  onBack,
  headerAction,
}: MesasClienteHeaderProps) {
  const subtitle = cobrancaNome
    ? `${cobrancaNome} · ${nome}`
    : mesasCount === 0
      ? 'Mesas e leituras'
      : mesasCount === 1
        ? '1 mesa'
        : `${mesasCount} mesas`;

  return (
    <FlowHubScreenHeader
      title={nome || 'Cliente'}
      subtitle={subtitle}
      onBack={onBack}
      headerRight={headerAction}
      heroOverlap
      variant="detail"
    />
  );
}
