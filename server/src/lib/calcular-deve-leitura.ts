export const MAX_LEITURA = 99999;
export const MODULO_LEITURA = 100000;

export function arredondarMoeda(valor: number): number {
  return Math.round(valor * 100) / 100;
}

export function calcularDiferencaLeitura(anterior: number, atual: number): number {
  if (atual >= anterior) {
    return atual - anterior;
  }

  // Rolagem do medidor de 5 dígitos (99999 → 00000)
  return MAX_LEITURA - anterior + 1 + atual;
}

export function calcularDeveLeitura(
  leituraAtual: number,
  leituraAnterior: number | null,
  valorFicha: number,
): number {
  if (leituraAnterior === null) {
    return 0;
  }

  const diferenca = calcularDiferencaLeitura(leituraAnterior, leituraAtual);
  const bruto = diferenca * valorFicha;
  return arredondarMoeda(bruto / 2);
}

export const TOLERANCIA_DEVE = 0.01;

export function deveDiverge(calculado: number, informado: number): boolean {
  return Math.abs(calculado - informado) > TOLERANCIA_DEVE;
}

/*
 * Casos de teste (ficha R$ 1,50):
 * | Anterior | Atual | Diferença | Deve      |
 * |----------|-------|-----------|-----------|
 * | 88744    | 89505 | 761       | R$ 570,75 |
 * | 99605    | 300   | 695       | R$ 521,25 |
 * | 99999    | 0     | 1         | R$ 0,75   |
 * | null     | 300   | —         | R$ 0,00   |
 */
