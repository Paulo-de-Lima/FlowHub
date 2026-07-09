import { Platform } from 'react-native';

export type Cliente = {
  id: number;
  nome: string | null;
  numero: number | null;
  endereco: string | null;
  cpf: string | null;
};

export type ClienteInput = {
  nome?: string | null;
  numero?: number | null;
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
  observacoes: string | null;
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
  observacoes?: string | null;
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
        numero?: number | null;
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
  registros: RegistroMesa[];
  totalDeve: number;
  totalPago: number;
};

export type MesasResponse = {
  cliente: Cliente;
  mesas: Mesa[];
};

export type RegistroInput = {
  data_leitura: string;
  leitura: number;
  deve: number;
  valor_pago?: number;
  pago?: boolean;
};

export async function getClienteMesas(clienteId: number): Promise<MesasResponse> {
  return request<MesasResponse>(`/clientes/${clienteId}/mesas`);
}

export async function createMesa(clienteId: number, numeracao: string): Promise<Mesa> {
  return request<Mesa>(`/clientes/${clienteId}/mesas`, {
    method: 'POST',
    body: JSON.stringify({ numeracao }),
  });
}

export async function updateMesa(id: number, numeracao: string): Promise<Mesa> {
  return request<Mesa>(`/mesas/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ numeracao }),
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
