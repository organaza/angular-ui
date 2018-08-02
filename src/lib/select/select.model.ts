import { Subject, BehaviorSubject, of, Observable } from 'rxjs';
import { JSONUtils } from '../json/json';
import { delay, tap } from '../../../../../node_modules/rxjs/operators';

export interface ISelectModel {
  list: BehaviorSubject<ISelectItem[]>;
  selected: BehaviorSubject<ISelectItem[]>;
  loading: BehaviorSubject<boolean>;
  haveNext: BehaviorSubject<boolean>;
  currentPage: number;
  many: boolean;
  allowNull: boolean;
  prompt: string;
  iconClosed: string;
  iconOpened: string;

  // Search for item
  search(query: string): void;
  // Select index
  select(index: number): void;
  // Unselect item
  unselect(index: number): void;
  // Set incoming data
  setData(data: any): void;
  // Set selected values
  getData(): any;
  // Check if item is selected
  isSelected(item: ISelectItem): boolean;
  // Load page with search params
  loadPage(page: number): Observable<ISelectItem[]>;
  // Call on select show
  show(): void;
}
export interface ISelectItem {
  id: any;
  label: string;
  canRemove?: boolean;
}

export class SelectModelBase implements ISelectModel {
  list: BehaviorSubject<ISelectItem[]> = new BehaviorSubject([]);
  selected: BehaviorSubject<ISelectItem[]> = new BehaviorSubject([]);
  loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  haveNext: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public currentPage = 0;

  public many: boolean;
  public prompt = '---';
  public iconClosed = 'chevron-down';
  public iconOpened = 'chevron-up';
  public staticData: any;
  public allowNull: boolean;
  public dataHandler: () => Observable<any[]>;

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

  search(query: string) {
    this.searchString = query;
    this.list.next([]);
    this.loadPage(0).subscribe();
  }
  select(index: number) {
    if (this.many) {
      const existIndex = this.selected.getValue().findIndex(i => this.compareItems(i, this.list.getValue()[index]));
      if (existIndex > -1) {
        this.selected.next([...this.selected.getValue().filter((item, i) => i !== existIndex)]);
      } else {
        this.selected.next([...this.selected.getValue(), this.list.getValue()[index]]);
      }
    } else {
      this.selected.next([this.list.getValue()[index]]);
    }
  }
  unselect(index: number) {
    this.selected.next([...this.selected.getValue().filter((item, i) => i !== index)]);
  }
  setData(data: any) {
    if (!data || data.lenght === 0) {
      return;
    }
    this.loadData(0, data).subscribe(items => {
      if (this.many) {
        items = items.filter(i => data.findIndex(d => this.compareDataWithItem(d, i)) > -1);
        this.selected.next([...items]);
      } else {
        this.selected.next([items.find(i => this.compareDataWithItem(data, i))]);
      }
    });
  }
  getData() {
    if (this.many) {
      return this.selected.getValue().map(item => item.id);
    } else {
      return this.selected.getValue()[0].id;
    }
  }
  isSelected(item: ISelectItem) {
    return this.selected.getValue().findIndex(i => this.compareItems(i, item)) > -1;
  }
  loadPage(page: number) {
    this.loading.next(true);
    return this.loadData(page).pipe(tap(data => {
      this.list.next([...this.list.getValue(), ...data]);
      this.loading.next(false);
    }));
  }
  show() {
    this.list.next([]);
    this.loadPage(this.currentPage).subscribe();
  }

  protected compareItems(itema: ISelectItem, itemb: ISelectItem) {
    return itema.id === itemb.id;
  }

  protected convertDataToItem(data: any): ISelectItem {
    return {id: data, label: data};
  }

  protected compareDataWithItem(data: ISelectItem, item: ISelectItem) {
    return this.compareItems(this.convertDataToItem(data), item);
  }

  protected loadData(page: number, value?: any): Observable<ISelectItem[]> {
    // If data is static just display list
    if (this.staticData) {
      return of(this.staticData.filter(d => {
        return d.label.toLowerCase().indexOf(this.searchString.toLocaleLowerCase()) > -1;
      })).pipe(tap(() => this.haveNext.next(false)));
    }
    // On load data you have to return observable with data and set haveNext if needed
    if (this.dataHandler) {
      return this.dataHandler();
    }
    // Test data
    return of([
      {label: '1' + this.searchString, id: 'id1'}, {label: '2' + this.searchString, id: 'id2'},
      {label: '3' + this.searchString, id: 'id3'}, {label: '4' + this.searchString, id: 'id4'},
      {label: '5' + this.searchString, id: 'id5'}, {label: '6' + this.searchString, id: 'id6'},
      {label: '7' + this.searchString, id: 'id7'}, {label: '8' + this.searchString, id: 'id8'},
      {label: '9' + this.searchString, id: 'id9'}, {label: '10' + this.searchString, id: 'id10'}
    ]).pipe(tap(() => this.haveNext.next(true)));
  }
}
