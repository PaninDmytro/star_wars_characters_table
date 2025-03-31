import { Component, input, InputSignal } from '@angular/core';

import { popoverData } from "../../constants/popover-data.constant";
import { IPlanet } from "../../interfaces/planet.interface";
import { IPopoverData } from "../../interfaces/popover-data.interface";

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss'
})
export class PopoverComponent {
  planetData: InputSignal<IPlanet | null> = input.required<IPlanet | null>();

  protected readonly popoverData: IPopoverData[] = popoverData;
}
