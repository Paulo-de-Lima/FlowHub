import { serializeDecimal } from './http';

export function normalizarPagamento(deveRaw: unknown, valorPagoRaw: unknown = 0) {
  const deve = Math.max(0, serializeDecimal(deveRaw));
  const valorPago = Math.max(0, Math.min(serializeDecimal(valorPagoRaw), deve));
  const saldo = Math.max(0, deve - valorPago);
  return {
    deve,
    valor_pago: valorPago,
    saldo,
    pago: saldo <= 0,
  };
}

export function saldoEmAberto(deveRaw: unknown, valorPagoRaw: unknown = 0) {
  return normalizarPagamento(deveRaw, valorPagoRaw).saldo;
}
