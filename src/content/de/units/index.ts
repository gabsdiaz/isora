import type { UnitContent } from "../../types";
import { a1_1 } from "./a1-1";
import { a1_2 } from "./a1-2";

/**
 * Registro de unidades con contenido listo.
 * Para publicar una unidad nueva: crea su archivo y agrégalo al índice de su nivel.
 */
export const allUnits: UnitContent[] = [...a1_1, ...a1_2];

const byKey = new Map(allUnits.map((u) => [`${u.level}/${u.number}`, u]));

export function getUnitContent(levelId: string, number: number) {
  return byKey.get(`${levelId}/${number}`) ?? null;
}

export function isUnitAvailable(levelId: string, number: number) {
  return byKey.has(`${levelId}/${number}`);
}
