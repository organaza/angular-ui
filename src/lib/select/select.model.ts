import { Subject } from 'rxjs';

export interface ISelectModel {
  search(query: string);
  select(index: number);
  setData(any: ISelectItem);
  // set selected values
  updateSelected();
  checkSelected();
  loadNext(index: number);
}
export interface ISelectItem {
  id: any;
  data: any;
}

export class SelectModel implements ISelectModel {
  list: Subject<ISelectItem[]>;
  selected: Subject<ISelectItem>;

  many: boolean;
  checkSelection: boolean;

  search(query: string) {

  }
  select(index: number) {

  }
  setData(any: ISelectItem) {

  }
  // set selected values
  updateSelected() {

  }
  checkSelected() {

  }
  loadNext(index: number) {

  }
}

export class SelectDemoModel implements ISelectModel {
  list: Subject<ISelectItem[]>;
  selected: Subject<ISelectItem>;

  many: boolean;
  checkSelection: boolean;

  search(query: string) {

  }
  select(index: number) {

  }
  setData(any: ISelectItem) {

  }
  // set selected values
  updateSelected() {

  }
  checkSelected() {

  }
  loadNext(index: number) {

  }
}
