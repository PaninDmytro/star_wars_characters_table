import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";
import { TemplatePortal } from "@angular/cdk/portal";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";

import { PopoverComponent } from "../../components/popover/popover.component";
import { TableSectionComponent } from "../../components/table-section/table-section.component";
import { ICharacter } from "../../interfaces/character.interface";
import { IPlanet } from "../../interfaces/planet.interface";
import { IShowPlanet } from "../../interfaces/show-planet.interface";
import { TableService } from "../../services/table.service";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    PopoverComponent,
    TableSectionComponent,
    FormsModule,
    MatFormField,
    MatInput,
    ReactiveFormsModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {
  public dataSource!: MatTableDataSource<ICharacter>;
  public characters: ICharacter[] = [];
  public planetData: IPlanet | null = null;
  public starWarsForm: FormGroup;
  public errorMessage: string | null = null;

  private overlay: Overlay = inject(Overlay);
  private tableService: TableService = inject(TableService);
  private viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private fb: FormBuilder = inject(FormBuilder);
  private planetsCache: Record<string, IPlanet> = {};
  private destroy$: Subject<void> = new Subject<void>();
  private overlayRef!: OverlayRef;

  @ViewChild('planetTooltip') planetTooltip: TemplateRef<{ $implicit: IPlanet }>;
  @ViewChild(TableSectionComponent) tableSection: TableSectionComponent;

  ngOnInit(): void {
    this.getCharacters();
    this.subscribeOnFilterChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor() {
    this.starWarsForm = this.fb.group({
      filterValue: ['']
    });
  }

  public showPlanetInfo(data: IShowPlanet): void {
    const { event, character } = data;
    const clickedElement = event.currentTarget as HTMLElement;

    this.closePopover();

    if (this.planetsCache[character.homeworld]) {
      this.showPopover(clickedElement, this.planetsCache[character.homeworld]);
    } else {
      this.getPlanet(character.homeworld, clickedElement);
    }
  }

  private showPopover(origin: HTMLElement, planetData: IPlanet): void {
    this.closePopover();

    this.planetData = planetData;

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(origin)
        .withPositions([{
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 10
        }])
    });

    const portal = new TemplatePortal(
      this.planetTooltip,
      this.viewContainerRef
    );

    this.overlayRef.attach(portal);

    this.overlayRef.backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.closePopover();
      });
  }

  private getCharacters(): void {
    this.tableService.getCharacters()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ICharacter[]) => {
          this.characters = this.getRandomCharacters(data, 15);
          this.dataSource = new MatTableDataSource(this.characters);
          this.dataSource.sort = this.tableSection.sort;
          this.dataSource.filterPredicate = (data: ICharacter, filter: string) => {
            return data.name.toLowerCase().includes(filter);
          };
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = err.message;
          console.error('Error fetching characters:', err);
          this.characters = [];
          this.dataSource = new MatTableDataSource(this.characters);
        }
      });
  }

  private getPlanet(homeworld: string, clickedElement: HTMLElement): void {
    this.tableService.getPlanet(homeworld)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (planet) => {
          this.planetsCache[homeworld] = planet;
          this.showPopover(clickedElement, planet);
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = `Could not load planet data: ${err.message}`;
          console.error('Error fetching planet:', err);
        }
      });
  }

  private getRandomCharacters(characters: ICharacter[], count: number): ICharacter[] {
    const shuffled = [...characters].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private closePopover(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null!;
      this.planetData = null;
    }
  }

  private subscribeOnFilterChanges(): void {
    this.starWarsForm.get('filterValue')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => this.dataSource.filter = value.trim().toLowerCase());
  }
}
