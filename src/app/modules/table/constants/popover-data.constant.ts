import { IPopoverData } from "../interfaces/popover-data.interface";
import { IPlanet } from "../interfaces/planet.interface";

export const popoverData: IPopoverData[] = [
  { label: 'Climate:', content: (value: IPlanet | null) => value?.climate ?? '' },
  { label: 'Terrain:', content: (value: IPlanet | null) => value?.terrain ?? '' },
  { label: 'Population:', content: (value: IPlanet | null) => value?.population ?? '' },
];
