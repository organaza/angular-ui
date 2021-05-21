/* eslint-disable rxjs/no-subject-value */
import { BehaviorSubject, of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export type SelectData = unknown | string | number;

export interface ISelectModel {
  list: BehaviorSubject<ISelectItem[]>;
  selected: BehaviorSubject<ISelectItem[]>;
  loading: BehaviorSubject<boolean>;
  haveNext: BehaviorSubject<boolean>;
  currentPage: number;
  many: boolean;
  allowNull: boolean;
  prompt: string;

  // Search for item
  search(query: string): void;
  // Select index
  select(index: number): void;
  // Unselect item
  unselect(index: number): void;
  // Set incoming data
  setData(data: SelectData): void;
  // Set selected values
  getData(): SelectData;
  // Check if item is selected
  isSelected(item: ISelectItem): boolean;
  // Load page with search params
  loadPage(page: number, value?: SelectData): Observable<ISelectItem[]>;
  // Call on select show
  show(): void;
}
export interface ISelectItem {
  id: number | string;
  label: string;
  cantRemove?: boolean;
  item?: SelectData;
  [x: string]: unknown;
}

@Injectable()
export class SelectModelBase implements ISelectModel {
  list = new BehaviorSubject<ISelectItem[]>([]);
  selected = new BehaviorSubject<ISelectItem[]>([]);
  loading = new BehaviorSubject<boolean>(false);
  haveNext = new BehaviorSubject<boolean>(false);

  public currentPage = 0;

  public many: boolean;
  public loadSelected = true;
  public prompt = '---';
  public staticData: ISelectItem[];
  public allowNull: boolean;
  public dataHandler: (
    page: number,
    value?: SelectData,
  ) => Observable<ISelectItem[]>;
  public convertDataToItemHandler: (data: SelectData) => ISelectItem;
  public convertItemToDataHandler: (value: ISelectItem) => SelectData;

  // Need implementation:
  // checkSelection: boolean;
  // removeSelected = true;
  // filterFunction: any;
  // limit: number;
  // createNewOption = false;
  // hideActiveValue = false;
  // hideMoreThan = 1000;
  // reloadOnOpen: boolean;
  // useValidationValue = true;

  private searchString = '';

  constructor() {
    this.selected.next([]);
  }

  search(query: string): void {
    this.searchString = query;
    this.list.next([]);
    this.loadPage(0).subscribe();
  }
  select(index: number): void {
    if (this.many) {
      const existIndex = this.selected
        .getValue()
        .findIndex((i) => this.compareItems(i, this.list.getValue()[index]));
      if (existIndex > -1) {
        this.selected.next([
          ...this.selected.getValue().filter((item, i) => i !== existIndex),
        ]);
      } else {
        this.selected.next([
          ...this.selected.getValue(),
          this.list.getValue()[index],
        ]);
      }
    } else {
      this.selected.next([this.list.getValue()[index]]);
    }
  }
  unselect(index: number): void {
    this.selected.next([
      ...this.selected.getValue().filter((item, i) => i !== index),
    ]);
  }
  getData(): SelectData | SelectData[] {
    return this.convertItemToData();
  }
  setData(data: SelectData | SelectData[]): void {
    if (
      data === undefined ||
      data === null ||
      (this.many && (data as Array<unknown>).length === 0)
    ) {
      this.selected.next([]);
      return;
    }
    if (this.loadSelected) {
      this.loadData(0, data).subscribe((items) => {
        if (this.many) {
          items = items.filter(
            (i) =>
              (data as Array<unknown>).findIndex((d) =>
                this.compareDataWithItem(d, i),
              ) > -1,
          );
          this.selected.next([...items]);
        } else {
          this.selected.next([
            items.find((i) => this.compareDataWithItem(data, i)),
          ]);
        }
      });
    }
  }
  isSelected(item: ISelectItem): boolean {
    return (
      this.selected.getValue().findIndex((i) => this.compareItems(i, item)) > -1
    );
  }
  loadPage(page: number): Observable<ISelectItem[]> {
    this.loading.next(true);
    return this.loadData(page).pipe(
      tap((data) => {
        this.list.next([...this.list.getValue(), ...data]);
        this.loading.next(false);
      }),
    );
  }
  show(): void {
    this.list.next([]);
    this.loadPage(this.currentPage).subscribe();
  }

  protected compareItems(itema: ISelectItem, itemb: ISelectItem): boolean {
    if (!itema && itemb) {
      return false;
    }
    if (itema && !itemb) {
      return false;
    }
    return itema.id === itemb.id;
  }

  protected convertDataToItem(data: SelectData): ISelectItem {
    if (this.convertDataToItemHandler) {
      return this.convertDataToItemHandler(data);
    }
    return { id: data as string | number, label: String(data) };
  }

  protected convertItemToData(): SelectData {
    if (this.many) {
      if (this.convertItemToDataHandler) {
        return this.selected.getValue().map(this.convertItemToDataHandler);
      }
      return this.selected.getValue().map((item) => item.id);
    } else {
      if (this.convertItemToDataHandler) {
        return this.convertItemToDataHandler(
          this.selected.getValue()[0] || undefined,
        );
      }
      return this.selected.getValue()[0]
        ? this.selected.getValue()[0].id
        : undefined;
    }
  }

  protected compareDataWithItem(data: SelectData, item: ISelectItem): boolean {
    return this.compareItems(this.convertDataToItem(data), item);
  }

  protected loadData(
    page: number,
    value?: SelectData,
  ): Observable<ISelectItem[]> {
    // If data is static just display list
    if (this.staticData) {
      return of(
        this.staticData.filter((d) => {
          return (
            d.label
              .toLowerCase()
              .indexOf(this.searchString.toLocaleLowerCase()) > -1
          );
        }),
      ).pipe(tap(() => this.haveNext.next(false)));
    }
    // On load data you have to return observable with data and set haveNext if needed
    if (this.dataHandler) {
      return this.dataHandler(page, value);
    }
    // Test data
    return of([
      { label: '1' + this.searchString, id: 'id1' },
      { label: '2' + this.searchString, id: 'id2' },
      { label: '3' + this.searchString, id: 'id3' },
      { label: '4' + this.searchString, id: 'id4' },
      { label: '5' + this.searchString, id: 'id5' },
      { label: '6' + this.searchString, id: 'id6' },
      { label: '7' + this.searchString, id: 'id7' },
      { label: '8' + this.searchString, id: 'id8' },
      { label: '9' + this.searchString, id: 'id9' },
      { label: '10' + this.searchString, id: 'id10' },
    ]).pipe(tap(() => this.haveNext.next(true)));
  }
}
