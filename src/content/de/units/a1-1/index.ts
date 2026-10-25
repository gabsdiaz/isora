import type { UnitContent } from "../../../types";
import u01 from "./01";
import u02 from "./02";
import u03 from "./03";
import u04 from "./04";
import u05 from "./05";
import u06 from "./06";
import u07 from "./07";
import u08 from "./08";
import u09 from "./09";
import u10 from "./10";
import u11 from "./11";
import u12 from "./12";
import u13 from "./13";
import u14 from "./14";
import u15 from "./15";
import u16 from "./16";
import u17 from "./17";
import u18 from "./18";
import u19 from "./19";
import u20 from "./20";

import { extraReadings1 } from "./readings-extra-1";
import { extraReadings2 } from "./readings-extra-2";

const extra = { ...extraReadings1, ...extraReadings2 };

const units: UnitContent[] = [u01, u02, u03, u04, u05, u06, u07, u08, u09, u10, u11, u12, u13, u14, u15, u16, u17, u18, u19, u20];

/** Cada unidad con su lectura extra (más larga) al final */
export const a1_1: UnitContent[] = units.map((u) => (extra[u.number] ? { ...u, readings: [...u.readings, extra[u.number]] } : u));
