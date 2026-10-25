import type { UnitContent } from "../../types";
import a1_1_01 from "./a1-1/01-vorstellung";

/**
 * Registro de unidades con contenido listo.
 * Para publicar una unidad nueva: crea su archivo y agrégalo aquí.
 */
const units: UnitContent[] = [a1_1_01];

const byKey = new Map(units.map((u) => [`${u.level}/${u.number}`, u]));

export function getUnitContent(levelId: string, number: number) {
  return byKey.get(`${levelId}/${number}`) ?? null;
}

export function isUnitAvailable(levelId: string, number: number) {
  return byKey.has(`${levelId}/${number}`);
}
