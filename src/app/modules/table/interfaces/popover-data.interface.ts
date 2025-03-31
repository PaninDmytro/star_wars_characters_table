import { IPlanet } from "./planet.interface";

export interface IPopoverData {
  label: string;
  content: (element: IPlanet | null) => string;
}
