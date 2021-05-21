import { Injectable } from '@angular/core';
import { JSONUtils } from '../json/json';

export interface SortField {
  name: string;
  direction: string;
}
// string on fixed like '1 1 100%' and flexBased number like 5
export type SortTableColumnsWidth = Record<string, string | number>;
export type SortTableLayoutColumnsWidth = Record<string, SortTableColumnsWidth>;
export interface SortTableSettings {
  columnsWidth: SortTableLayoutColumnsWidth;
}

@Injectable({
  providedIn: 'root',
})
export class SortTableSettingsService {
  settings: SortTableSettings = {
    columnsWidth: {},
  };
  timeout: number;

  constructor() {
    // this.updateSettings(
    //   JSONUtils.parseLocalStorage<SortTableSettings>(
    //     SortTableSettingsService.key,
    //     {} as SortTableSettings,
    //   ),
    // );
  }

  set columnsWidth(value: SortTableLayoutColumnsWidth) {
    this.settings.columnsWidth = value;
    this.save();
  }
  get columnsWidth(): SortTableLayoutColumnsWidth {
    return this.settings.columnsWidth;
  }

  updateSettings(settings: SortTableSettings): void {
    if (!settings) {
      return;
    }
    this.settings = Object.assign(this.settings, settings);
    this.saveInlocalStorage();
  }

  saveInlocalStorage(): void {
    // JSONUtils.setLocalStorage(SortTableSettingsService.key, this.settings);
  }

  save(): void {
    this.saveInlocalStorage();
    clearTimeout(this.timeout);
  }
}
