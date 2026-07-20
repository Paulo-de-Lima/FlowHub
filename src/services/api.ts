import { Platform } from 'react-native';

export type Cliente = {
  id: number;
  nome: string | null;
  numero: string | null;
  endereco: string | null;
  cpf: string | null;
};

export type ClienteInput = {
  nome?: string | null;
  numero?: string | null;
  endereco?: string | null;
  cpf?: string | null;
};

export type CreateClienteInput = ClienteInput;
export type UpdateClienteInput = ClienteInput;

export function getApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
}

async function parseErrorMessage(response: Response): Promise<string> {
  const text = await response.text();

  if (!text) {
    return `Erro na requisição (${response.status}).`;
  }

  try {
    const body = JSON.parse(text) as { error?: string };
    if (body.error) {
      return body.error;
    }
  } catch {
    // resposta não é JSON
  }

  return text;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type ClienteSummary = Cliente & {
  qtdMesas: number;
  totalDeve: number;
  registrosPendentes: number;
  cobrancaIds: number[];
};

export async function getClientesSummary(): Promise<ClienteSummary[]> {
  return request<ClienteSummary[]>('/clientes?summary=1');
}

export async function getClienteSummary(id: number): Promise<ClienteSummary> {
  return request<ClienteSummary>(`/clientes/${id}?summary=1`);
}

export async function getClientes(): Promise<Cliente[]> {
  return request<Cliente[]>('/clientes');
}

export async function getCliente(id: number): Promise<Cliente> {
  return request<Cliente>(`/clientes/${id}`);
}

export async function createCliente(data: CreateClienteInput): Promise<Cliente> {
  return request<Cliente>('/clientes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCliente(id: number, data: UpdateClienteInput): Promise<Cliente> {
  return request<Cliente>(`/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCliente(id: number): Promise<void> {
  await request<void>(`/clientes/${id}`, { method: 'DELETE' });
}

// --- Cobranças ---

export type Cobranca = {
  id: number;
  nome: string;
  intervalo_dias: number;
  data_viagem: string;
  referenciaBase: string | null;
  proximaViagem: string | null;
  repeticaoPrevista: string | null;
  totalClientes: number;
  clientesCobrados: number;
  totalArrecadadoAnterior: number;
  receitaAtual: number;
  despesasPeriodo: number;
};

export type CobrancaInput = {
  nome: string;
  intervalo_dias: number;
  data_viagem: string;
};

export type CobrancasListResponse = {
  cobrancas: Cobranca[];
  proximaId: number | null;
  arrecadadoMes: number;
};

export type DashboardRankingItem = {
  id: number;
  label: string;
  valor: number;
};

export type CobrancasDashboard = {
  maiorArrecadacao: DashboardRankingItem[];
  maioresDespesas: DashboardRankingItem[];
  maisClientes: DashboardRankingItem[];
};

export type CobrancaClienteItem = {
  vinculoId: number;
  cobrado: boolean;
  data_cobranca: string | null;
  cliente: Cliente;
  qtdMesas: number;
  totalDeve: number;
};

export type CobrancaClientesResponse = {
  cobranca: {
    id: number;
    nome: string;
    intervalo_dias: number;
    data_viagem: string;
  };
  progresso: { total: number; cobrados: number };
  clientes: CobrancaClienteItem[];
};

export type VincularClienteInput =
  | { clienteId: number }
  | {
      cliente: {
        nome: string;
        numero?: string | null;
        endereco?: string | null;
        cpf?: string | null;
        qtdMesas?: number;
        mesas?: { numeracao: string }[];
      };
    };

export async function getCobrancas(): Promise<CobrancasListResponse> {
  return request<CobrancasListResponse>('/cobrancas');
}

export async function getCobrancasDashboard(): Promise<CobrancasDashboard> {
  return request<CobrancasDashboard>('/cobrancas/dashboard');
}

export async function getCobranca(id: number): Promise<Cobranca> {
  return request<Cobranca>(`/cobrancas/${id}`);
}

export async function createCobranca(data: CobrancaInput): Promise<Cobranca> {
  return request<Cobranca>('/cobrancas', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCobranca(id: number, data: Partial<CobrancaInput>): Promise<Cobranca> {
  return request<Cobranca>(`/cobrancas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCobranca(id: number): Promise<void> {
  await request<void>(`/cobrancas/${id}`, { method: 'DELETE' });
}

export async function getCobrancaClientes(cobrancaId: number): Promise<CobrancaClientesResponse> {
  return request<CobrancaClientesResponse>(`/cobrancas/${cobrancaId}/clientes`);
}

export async function vincularClienteCobranca(
  cobrancaId: number,
  data: VincularClienteInput,
): Promise<CobrancaClienteItem> {
  return request<CobrancaClienteItem>(`/cobrancas/${cobrancaId}/clientes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function toggleClienteCobrado(
  cobrancaId: number,
  clienteId: number,
  cobrado: boolean,
): Promise<CobrancaClienteItem> {
  return request<CobrancaClienteItem>(`/cobrancas/${cobrancaId}/clientes/${clienteId}`, {
    method: 'PATCH',
    body: JSON.stringify({ cobrado }),
  });
}

export async function removerClienteCobranca(cobrancaId: number, clienteId: number): Promise<void> {
  await request<void>(`/cobrancas/${cobrancaId}/clientes/${clienteId}`, { method: 'DELETE' });
}

// --- Mesas e registros ---

export type RegistroMesa = {
  id: number;
  mesa_id: number;
  data_leitura: string;
  leitura: number;
  deve: number;
  valor_pago: number;
  saldo?: number;
  pago: boolean;
};

export type Mesa = {
  id: number;
  cliente_id: number;
  numeracao: string;
  valor_ficha: number;
  registros: RegistroMesa[];
  totalDeve: number;
  totalPago: number;
};

export type MesaInput = {
  numeracao: string;
  valor_ficha?: number;
};

export type MesasResponse = {
  cliente: Cliente;
  mesas: Mesa[];
};

export type RegistroInput = {
  data_leitura: string;
  leitura: number;
  deve?: number;
  valor_pago?: number;
  pago?: boolean;
};

export async function getClienteMesas(clienteId: number): Promise<MesasResponse> {
  return request<MesasResponse>(`/clientes/${clienteId}/mesas`);
}

export async function createMesa(clienteId: number, data: MesaInput): Promise<Mesa> {
  return request<Mesa>(`/clientes/${clienteId}/mesas`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMesa(id: number, data: MesaInput): Promise<Mesa> {
  return request<Mesa>(`/mesas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteMesa(id: number): Promise<void> {
  await request<void>(`/mesas/${id}`, { method: 'DELETE' });
}

export async function createRegistro(mesaId: number, data: RegistroInput): Promise<RegistroMesa> {
  return request<RegistroMesa>(`/mesas/${mesaId}/registros`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateRegistro(
  id: number,
  data: Partial<RegistroInput>,
): Promise<RegistroMesa> {
  return request<RegistroMesa>(`/registros/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteRegistro(id: number): Promise<void> {
  await request<void>(`/registros/${id}`, { method: 'DELETE' });
}

// --- Materiais / Estoque ---

export type MaterialStatus = 'VAZIO' | 'BAIXO' | 'ALTO';

export type Material = {
  id: number;
  nome: string;
  unidade: string;
  quantidade: number;
  estoqueMinimo: number;
  status: MaterialStatus;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CompraMaterialInput = {
  nome: string;
  unidade?: string;
  quantidade: number;
  valorTotal: number;
  dataCompra?: string;
};

export type CompraMaterialResponse = {
  material: Material;
  despesa: { id: number; origem: string; valor: number; dataGasto: string | null };
};

export async function getMateriais(status?: MaterialStatus[]): Promise<Material[]> {
  const query =
    status && status.length > 0 ? `?status=${status.join(',')}` : '';
  return request<Material[]>(`/materiais${query}`);
}

export async function registrarCompraMaterial(
  data: CompraMaterialInput,
): Promise<CompraMaterialResponse> {
  return request<CompraMaterialResponse>('/materiais/compra', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// --- Financeiro ---

export type FinanceiroResumo = {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
};

export type LancamentoFinanceiro = {
  id: number;
  dataGasto: string | null;
  origem: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  total: number;
  materialId: number | null;
  automatico: boolean;
};

export type LancamentosResponse = {
  total: number;
  lancamentos: LancamentoFinanceiro[];
};

export type UpdateLancamentoInput = {
  tipo?: 'receita' | 'despesa';
  origem?: string;
  valor?: number;
  dataGasto?: string;
};

export type PagamentoPendenteCliente = {
  id: number;
  nome: string | null;
  numero: string | null;
  totalDeve: number;
  qtdMesas: number;
  registrosPendentes: number;
};

export type CreateLancamentoInput = {
  tipo: 'receita' | 'despesa';
  origem: string;
  valor: number;
  dataGasto?: string;
};

export async function getPagamentosPendentesClientes(): Promise<PagamentoPendenteCliente[]> {
  const clientes = await getClientesSummary();
  return clientes
    .filter((c) => c.totalDeve > 0)
    .map((c) => ({
      id: c.id,
      nome: c.nome,
      numero: c.numero,
      totalDeve: c.totalDeve,
      qtdMesas: c.qtdMesas,
      registrosPendentes: c.registrosPendentes,
    }))
    .sort((a, b) => b.totalDeve - a.totalDeve);
}

export async function getFinanceiroResumo(mes?: string): Promise<FinanceiroResumo> {
  const query = mes ? `?mes=${encodeURIComponent(mes)}` : '';
  return request<FinanceiroResumo>(`/financeiro/resumo${query}`);
}

export async function getFinanceiroLancamentos(params?: {
  mes?: string;
  tipo?: 'receita' | 'despesa' | 'todos';
  busca?: string;
  limit?: number;
  offset?: number;
}): Promise<LancamentosResponse> {
  const search = new URLSearchParams();
  if (params?.mes) search.set('mes', params.mes);
  if (params?.tipo) search.set('tipo', params.tipo);
  if (params?.busca?.trim()) search.set('busca', params.busca.trim());
  if (params?.limit != null) search.set('limit', String(params.limit));
  if (params?.offset != null) search.set('offset', String(params.offset));
  const qs = search.toString();
  return request<LancamentosResponse>(`/financeiro/lancamentos${qs ? `?${qs}` : ''}`);
}

export async function createLancamento(data: CreateLancamentoInput): Promise<LancamentoFinanceiro> {
  return request<LancamentoFinanceiro>('/financeiro/lancamentos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLancamento(
  id: number,
  data: UpdateLancamentoInput,
): Promise<LancamentoFinanceiro> {
  return request<LancamentoFinanceiro>(`/financeiro/lancamentos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteLancamento(id: number): Promise<void> {
  await request<void>(`/financeiro/lancamentos/${id}`, { method: 'DELETE' });
}

export async function createMaterial(data: {
  nome: string;
  unidade?: string;
  quantidade?: number;
  estoqueMinimo?: number;
}): Promise<Material> {
  return request<Material>('/materiais', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export type UpdateMaterialInput = {
  nome?: string;
  unidade?: string;
  quantidade?: number;
  estoqueMinimo?: number;
};

export async function updateMaterial(id: number, data: UpdateMaterialInput): Promise<Material> {
  return request<Material>(`/materiais/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteMaterial(id: number): Promise<void> {
  await request<void>(`/materiais/${id}`, { method: 'DELETE' });
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
