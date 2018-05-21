import { Injectable } from '@angular/core';
import { JSONUtils } from '../json/json';

export class SortField {
  name: string;
  direction: string;
}

@Injectable()
export class SortTableSettingsService {
  static key = 'sorttable_column_width';

  settings: {
    columnsWidth: { [key: string]: { [key: string]: any } },
    sortField: { [key: string]: SortField },
  } = {
    columnsWidth: {},
    sortField: {}
  };
  timeout: any;

  constructor(

  ) {
    this.updateSettings(JSONUtils.parseLocalStorage(SortTableSettingsService.key, {}));
  }

  set columnsWidth(value: { [key: string]: { [key: string]: any } }) {
    this.settings.columnsWidth = value;
    this.save();
  }
  get columnsWidth(): { [key: string]: { [key: string]: any } } {
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
    JSONUtils.setLocalStorage(SortTableSettingsService.key, this.settings);
  }

  save() {
    this.saveInlocalStorage();
    clearTimeout(this.timeout);
  }
}
