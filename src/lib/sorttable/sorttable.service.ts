import { Injectable } from '@angular/core';
import { SortTableRowDirective } from './sorttable-row.directive';
import { SortTableDragColumnDirective } from './sorttable-drag-column.directive';
import { SortTableDirective } from './sorttable.directive';
import { SortTableColumnDirective } from './sorttable-column.directive';
import { SortTableColumnHeadDirective } from './sorttable-column-head.directive';
import {
  SortTableLayoutColumnsWidth,
  SortTableSettingsService,
} from './sorttable.settings.service';

@Injectable({
  providedIn: 'root',
})
export class SortTableService {
  currentDrag: SortTableRowDirective | SortTableDragColumnDirective;
  collections: Record<string, SortTableDirective> = {};
  collectionRows: Record<string, SortTableRowDirective[]> = {};
  collectionDragColumns: Record<string, SortTableDragColumnDirective[]> = {};
  collectionColumnsHead: SortTableColumnHeadDirective[] = [];
  collectionColumnsHeadMap: {
    [key: string]: SortTableColumnHeadDirective;
  } = {};
  collectionColumns: { [key: string]: SortTableColumnDirective[] } = {};

  // Collection for store columns width columnsWidth[collectionName][columnName]
  columnsWidth: SortTableLayoutColumnsWidth;

  constructor(private settingsService: SortTableSettingsService) {
    this.columnsWidth = this.settingsService.columnsWidth;
  }

  // Reset width columns
  resetWidth(): void {
    this.columnsWidth = this.settingsService.columnsWidth;
  }

  // Register new collection from SortTableDirective
  registerCollection(name: string, table: SortTableDirective): void {
    this.collectionRows[name] = [];
    this.collections[name] = table;
  }

  // Unegister new collection from SortTableDirective
  unregisterCollection(name: string): void {
    this.collectionRows[name] = null;
  }

  // Register row for sorting from SortTableRowDirective
  registerRow(name: string, index: number, row: SortTableRowDirective): void {
    if (this.collectionRows[name]) {
      this.collectionRows[name][index] = row;
    }
  }

  // Unregister row for sorting from SortTableRowDirective
  unregisterRow(name: string, index: number): void {
    this.collectionRows[name][index] = null;
  }

  // Register column for sorting from SortTableDragColumnDirective
  registerDragColumn(
    name: string,
    index: number,
    column: SortTableDragColumnDirective,
  ): void {
    this.collectionDragColumns[name][index] = column;
  }

  // Unregister column for sorting from SortTableDragColumnDirective
  unregisterDragColumn(name: string, index: number): void {
    this.collectionDragColumns[name][index] = null;
  }

  getRow(collectionName: string, index: number): SortTableDragColumnDirective {
    return this.collectionDragColumns[collectionName][index];
  }

  // Register column for resize from SortTableColumnDirective
  registerColumn(columnId: string, column: SortTableColumnDirective): void {
    if (!this.collectionColumns[columnId]) {
      this.collectionColumns[columnId] = [];
    }
    this.collectionColumns[columnId].push(column);
    column.index = this.collectionColumns[columnId].length - 1;
    this.setFlexBasis(columnId, this.getFlexBasis(columnId));
  }

  // Unregister column for resize from SortTableColumnDirective
  unregisterColumn(columnId: string, index: number): void {
    this.collectionColumns[columnId][index] = null;
  }

  // Register column head for resize from SortTableColumnHeadDirective
  registerColumnHead(
    columnId: string,
    column: SortTableColumnHeadDirective,
  ): void {
    this.collectionColumnsHeadMap[columnId] = column;
    this.collectionColumnsHead.push(column);

    this.setFlexBasisHead(columnId, this.getFlexBasis(columnId));
  }

  // Unregister column head for resize from SortTableColumnHeadDirective
  unregisterColumnHead(columnId: string): void {
    this.collectionColumnsHeadMap[columnId] = null;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Sorting
  //////////////////////////////////////////////////////////////////////////////

  // Start drag on sorting
  startDrag(name: string, index: number): void {
    const collection = {
      ...this.collectionRows,
      ...this.collectionDragColumns,
    }[name];
    for (let ai = 0; ai < collection.length; ++ai) {
      if (collection[ai]) {
        collection[ai].startSorting();
      }
    }
    this.currentDrag = collection[index];
    this.currentDrag.startDrag();
  }

  // Stop drag on sorting
  stopDrag(name: string): void {
    if (!this.currentDrag) {
      return;
    }

    this.currentDrag.stopDrag();
    this.collections[name].setSort(
      this.currentDrag.index,
      this.currentDrag.newIndex,
    );

    const collection = {
      ...this.collectionRows,
      ...this.collectionDragColumns,
    }[name];
    for (let ai = 0; ai < collection.length; ++ai) {
      if (!collection[ai]) {
        continue;
      }
      collection[ai].stopSorting();
    }

    this.currentDrag = null;
  }
  // Move sorted item on sorting
  moveDrag(name: string, offsetX: number, offsetY: number): void {
    if (this.currentDrag) {
      this.currentDrag.moveDrag(offsetX, offsetY);
    }
  }

  // Move other items in list
  moveOther(
    name: string,
    index: number,
    layer: number,
    vertical = false,
  ): void {
    const collection = {
      ...this.collectionRows,
      ...this.collectionDragColumns,
    }[name];
    if (this.currentDrag) {
      for (let ai = 0; ai < collection.length; ++ai) {
        if (collection[ai]) {
          collection[ai].offsetDrag(0);
        }
        if (ai > this.currentDrag.index && ai < index) {
          if (vertical) {
            collection[ai].offsetDrag(-this.currentDrag.offsetWidth);
          } else {
            collection[ai].offsetDrag(-this.currentDrag.offsetHeight);
          }
        }
        if (ai < this.currentDrag.index && ai > index) {
          if (vertical) {
            collection[ai].offsetDrag(this.currentDrag.offsetWidth);
          } else {
            collection[ai].offsetDrag(this.currentDrag.offsetHeight);
          }
        }
      }
      if (this.currentDrag.index > index) {
        if (vertical) {
          if (layer > this.currentDrag.offsetWidth / 2) {
            this.currentDrag.newIndex = index + 1;
          } else {
            this.currentDrag.newIndex = index;
            collection[index].offsetDrag(this.currentDrag.offsetWidth);
          }
        } else {
          if (layer > this.currentDrag.offsetHeight / 2) {
            this.currentDrag.newIndex = index + 1;
          } else {
            this.currentDrag.newIndex = index;
            collection[index].offsetDrag(this.currentDrag.offsetHeight);
          }
        }
      }

      if (this.currentDrag.index < index) {
        if (vertical) {
          if (layer < this.currentDrag.offsetWidth / 2) {
            this.currentDrag.newIndex = index - 1;
          } else {
            this.currentDrag.newIndex = index;
            collection[index].offsetDrag(-this.currentDrag.offsetWidth);
          }
        } else {
          if (layer < this.currentDrag.offsetHeight / 2) {
            this.currentDrag.newIndex = index - 1;
          } else {
            this.currentDrag.newIndex = index;
            collection[index].offsetDrag(-this.currentDrag.offsetHeight);
          }
        }
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Resize
  //////////////////////////////////////////////////////////////////////////////

  // Return width by columnId
  getFlex(columnId: string): string {
    const ids = columnId.split(':');
    let width = '1 1 100%';
    if (
      this.columnsWidth &&
      this.columnsWidth[ids[0]] &&
      this.columnsWidth[ids[0]][ids[1]]
    ) {
      width = this.columnsWidth[ids[0]][ids[1]] as string;
    }
    return width;
  }

  getFlexBasis(columnId: string): number {
    const ids = columnId.split(':');
    return Number(this.columnsWidth?.[ids[0]]?.[ids[1]]) || 5;
  }

  // Set flex basis for columns head
  setFlexBasisHead(columnId: string, value: number): void {
    if (!this.collectionColumnsHeadMap[columnId]) {
      return;
    }
    const ids = columnId.split(':');
    if (value) {
      if (!this.columnsWidth) {
        this.columnsWidth = {};
      }
      if (!this.columnsWidth[ids[0]]) {
        this.columnsWidth[ids[0]] = {};
      }
      const maxvalue = 100 * Object.keys(this.columnsWidth[ids[0]]).length;
      value = Math.max(Number(value), 40);
      value = Math.min(Number(value), maxvalue);
      this.columnsWidth[ids[0]][ids[1]] = value;
      this.settingsService.columnsWidth = this.columnsWidth;
    }
    this.collectionColumnsHeadMap[columnId].setFlexBasisHead(
      this.getFlexBasis(columnId).toString(),
    );
    this.setFlexBasis(columnId, value);
  }

  // Set flex basis for columns
  setFlexBasis(columnId: string, value: number): void {
    if (this.collectionColumns[columnId]) {
      for (const column of this.collectionColumns[columnId]) {
        if (column) {
          column.setFlexBasis(value);
        }
      }
    }
  }

  getPercent(columnId: string, value: number): number {
    const offsetWidth = this.collectionColumnsHeadMap[columnId].getWidth();
    return (value * this.getFlexBasis(columnId)) / offsetWidth;
  }

  // Call from SortTableColumnHeadDirective on resize, value in pixels
  resizeColumnHead(columnId: string, value: number): void {
    const index: number = this.collectionColumnsHead.indexOf(
      this.collectionColumnsHeadMap[columnId],
    );
    this.setFlexBasisHead(
      columnId,
      this.getFlexBasis(columnId) - this.getPercent(columnId, value),
    );
    for (let i = index + 1; i < this.collectionColumnsHead.length; i++) {
      const id: string = this.collectionColumnsHead[i].columnId;
      const deltaValue =
        value / (this.collectionColumnsHead.length - index - 1);
      this.setFlexBasisHead(
        id,
        this.getFlexBasis(id) + this.getPercent(id, deltaValue),
      );
    }
  }
}
