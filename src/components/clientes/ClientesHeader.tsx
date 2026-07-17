import { type ReactNode } from 'react';

import {
  FlowHubScreenHeader,
  type FlowHubHeaderLayout,
} from '@/components/ui/FlowHubScreenHeader';
import type { HeaderBreadcrumbSegment } from '@/components/ui/FlowHubHeaderBreadcrumb';

type ClientesHeaderProps = {
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  footer?: string;
  totalClientes?: number;
  breadcrumb?: HeaderBreadcrumbSegment[];
  headerRight?: ReactNode;
  heroOverlap?: boolean;
};

function formatClientesFooter(total: number): string {
  if (total === 0) return 'Nenhum cliente cadastrado';
  if (total === 1) return '1 cliente cadastrado';
  return `${total} clientes cadastrados`;
}

export function ClientesHeader({
  onBack,
  title = 'Clientes',
  subtitle = 'Cadastro permanente e consulta',
  footer,
  totalClientes,
  breadcrumb,
  headerRight,
  heroOverlap,
}: ClientesHeaderProps) {
  const isDetail = Boolean(onBack);
  const layout: FlowHubHeaderLayout = isDetail
    ? headerRight
      ? 'detail-action'
      : 'detail'
    : 'root-tab';

  const footerLabel = !isDetail
    ? footer ?? (totalClientes != null ? formatClientesFooter(totalClientes) : undefined)
    : undefined;

  return (
    <FlowHubScreenHeader
      layout={layout}
      title={title}
      subtitle={subtitle}
      footer={footerLabel}
      moduleIcon={
        !isDetail ? { ios: 'person.2.fill', android: 'group', web: 'group' } : undefined
      }
      breadcrumb={breadcrumb}
      onBack={onBack}
      headerRight={headerRight}
      heroOverlap={heroOverlap ?? true}
    />
  );
}
