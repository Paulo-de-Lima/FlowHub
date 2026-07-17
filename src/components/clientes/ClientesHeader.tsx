import { FlowHubScreenHeader } from '@/components/ui/FlowHubScreenHeader';

type ClientesHeaderProps = {
  onBack?: () => void;
  title?: string;
  subtitle?: string;
};

export function ClientesHeader({
  onBack,
  title = 'Clientes',
  subtitle = 'Cadastro permanente e consulta',
}: ClientesHeaderProps) {
  return (
    <FlowHubScreenHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      variant={onBack ? 'detail' : 'root'}
    />
  );
}
