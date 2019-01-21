import { Injectable } from '@angular/core';
import { JSONUtils } from '../json/json';
import { SortOptions } from 'web/model/sort.model';

export class SortField {
  name: any;
  direction: string;
}

@Injectable({
  providedIn: 'root',
})
export class SortTableSettingsService {
  static key = 'sorttable_column_width';

  settings: {
    columnsWidth: { [key: string]: { [key: string]: any } },
    sortOptions: { [key: string]: SortOptions },
  } = {
    columnsWidth: {},
    sortOptions: {}
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

  getSortOptions (id: string): SortOptions {
    if (!this.settings.sortOptions[id]) {
      return new SortOptions();
    }
    return this.settings.sortOptions[id];
  }
  setSortOptions (id: string, value: SortOptions) {
    this.settings.sortOptions[id] = value;
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
