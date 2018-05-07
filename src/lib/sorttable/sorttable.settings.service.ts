import { Injectable } from '@angular/core';
import { JSONUtils } from '../json/json';

export class SortField {
  name: string;
  direction: string;
}

@Injectable()
export class SortTableSettingsService {
  settings: {
    columnsWidth: { [key: string]: { [key: string]: any } },
    sortField: { [key: string]: SortField }
   } = {
    columnsWidth: {},
      // {'fixed': {
      //   'Title': '1 1 100%',
      // }},
    sortField: {}
  };
  timeout: any;
  constructor(

  ) {
    this.updateSettings(JSONUtils.parseLocalStorage('sorttable_column_width', {}));
  }

  set columnsWidth(value: { [key: string]: { [key: string]: number } }) {
    this.settings.columnsWidth = value;
    this.save();
  }
  get columnsWidth(): { [key: string]: { [key: string]: number } } {
    return this.settings.columnsWidth;
  }

  getSortField (id: string): SortField {
    if (!this.settings.sortField[id]) {
      return new SortField();
    }
    return this.settings.sortField[id];
  }
  setSortField (id: string, value: SortField) {
    this.settings.sortField[id] = value;
    this.save();
  }

  updateSettings(settings: any) {
    if (!settings) {
      return;
    }
    this.settings = Object.assign(this.settings, settings);
    this.saveInlocalStorage();
  }

  saveInlocalStorage() {
    JSONUtils.setLocalStorage('sorttable_column_width', this.settings);
  }

  save() {
    this.saveInlocalStorage();
    clearTimeout(this.timeout);
  }
}
