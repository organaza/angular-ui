import { Injectable } from '@angular/core';
import { SortTableRowDirective } from './sorttable-row.directive';
import { SortTableDragColumnDirective } from './sorttable-drag-column.directive';
import { SortTableDirective } from './sorttable.directive';
import { SortTableColumnDirective } from './sorttable-column.directive';
import { SortTableColumnHeadDirective } from './sorttable-column-head.directive';
import { SortTableSettingsService } from '../sorttable/sorttable.settings.service';

@Injectable({
  providedIn: 'root',
})
export class SortTableService {
  currentDrag: any; // SortTableRowDirective, SortTableDragColumnDirective
  collections: { [key: string]: SortTableDirective } = {};
  collectionItems: { [key: string]: any[] } = {}; // SortTableRowDirective, SortTableDragColumnDirective
  collectionColumnsHead: SortTableColumnHeadDirective[] = [];
  collectionColumnsHeadMap: { [key: string]: SortTableColumnHeadDirective } = {};
  collectionColumns: { [key: string]: SortTableColumnDirective[] } = {};

  // Collection for store columns width columnsWidth[collectionName][columnName]
  columnsWidth: any;

  constructor(
    private settingsService: SortTableSettingsService
  ) {
    this.columnsWidth = this.settingsService.columnsWidth;
  }

  // Reset width columns
  resetWidth() {
    this.columnsWidth = this.settingsService.columnsWidth;
  }

  // Register new collection from SortTableDirective
  registerCollection(name: string, table: SortTableDirective) {
    this.collectionItems[name] = [];
    this.collections[name] = table;
  }

  // Unegister new collection from SortTableDirective
  unregisterCollection(name: string) {
    this.collectionItems[name] = null;
  }

  // Register row for sorting from SortTableRowDirective
  registerRow(name: string, index: number, row: SortTableRowDirective) {
    if (this.collectionItems[name]) {
      this.collectionItems[name][index] = row;
    }
  }

  // Unregister row for sorting from SortTableRowDirective
  unregisterRow(name: string, index: number) {
    this.collectionItems[name][index] = null;
  }

  // Register column for sorting from SortTableDragColumnDirective
  registerDragColumn(name: string, index: number, column: SortTableDragColumnDirective) {
    this.collectionItems[name][index] = column;
  }

  // Unregister column for sorting from SortTableDragColumnDirective
  unregisterDragColumn(name: string, index: number) {
    this.collectionItems[name][index] = null;
  }

  getRow(collectionName: string, index: number) {
    return this.collectionItems[collectionName][index];
  }

  // Register column for resize from SortTableColumnDirective
  registerColumn(columnId: string, column: SortTableColumnDirective) {
    if (!this.collectionColumns[columnId]) {
      this.collectionColumns[columnId] = [];
    }
    this.collectionColumns[columnId].push(column);
    column.index = this.collectionColumns[columnId].length - 1;
    this.setFlexBasis(columnId, this.getWidth(columnId));
  }

  // Unregister column for resize from SortTableColumnDirective
  unregisterColumn(columnId: string, index: number) {
    this.collectionColumns[columnId][index] = null;
  }

  // Register column head for resize from SortTableColumnHeadDirective
  registerColumnHead(columnId: string, column: SortTableColumnHeadDirective) {
    this.collectionColumnsHeadMap[columnId] = column;
    this.collectionColumnsHead.push(column);

    this.setFlexBasisHead(columnId, this.getWidth(columnId));
  }

  // Unregister column head for resize from SortTableColumnHeadDirective
  unregisterColumnHead(columnId: string) {
    this.collectionColumnsHeadMap[columnId] = null;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Sorting
  //////////////////////////////////////////////////////////////////////////////

  // Start drag on sorting
  startDrag(name: string, index: number) {
    const collection: any[] = this.collectionItems[name];
    for (let ai = 0; ai < collection.length; ++ai) {
      if (collection[ai]) {
        collection[ai].startSorting();
      }
    }
    this.currentDrag = collection[index];
    this.currentDrag.startDrag();
  }

  // Stop drag on sorting
  stopDrag(name: string) {
    if (!this.currentDrag) {
      return;
    }

    this.currentDrag.stopDrag();
    this.collections[name].setSort(this.currentDrag.index, this.currentDrag.newIndex);

    const collection: any[] = this.collectionItems[name];
    for (let ai = 0; ai < collection.length; ++ai) {
      if (!collection[ai]) {
        continue;
      }
      collection[ai].stopSorting();
    }

    this.currentDrag = null;
  }
  // Move sorted item on sorting
  moveDrag(name: string, offsetX: number, offsetY: number) {
    if (this.currentDrag) {
      this.currentDrag.moveDrag(offsetX, offsetY);
    }
  }

  // Move other items in list
  moveOther(name: string, index: number, layer: number, vertical = false) {
    const collection: any[] = this.collectionItems[name];
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
  getWidth(columnId: string): any {
    const ids = columnId.split(':');
    let width = '1 1 100%';
    if (this.columnsWidth && this.columnsWidth[ids[0]] && this.columnsWidth[ids[0]][ids[1]]) {
      width = this.columnsWidth[ids[0]][ids[1]];
    }
    return width;
  }

  // Set flex basis for columns head
  setFlexBasisHead(columnId: string, value: number) {
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
    this.collectionColumnsHeadMap[columnId].setFlexBasisHead(this.getWidth(columnId).toString());
    this.setFlexBasis(columnId, value);
  }

  // Set flex basis for columns
  setFlexBasis(columnId: string, value: number) {
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
    return value * this.getWidth(columnId) / offsetWidth;
  }

  // Call from SortTableColumnHeadDirective on resize, value in pixels
  resizeColumnHead(columnId: string, value: number) {
    const index: number = this.collectionColumnsHead.indexOf(this.collectionColumnsHeadMap[columnId]);
    this.setFlexBasisHead(columnId, this.getWidth(columnId) - this.getPercent(columnId, value));
    for (let i = index + 1; i < this.collectionColumnsHead.length; i++) {
      const id: string = this.collectionColumnsHead[i].columnId;
      const deltaValue = value / (this.collectionColumnsHead.length - index - 1);
      this.setFlexBasisHead(id, this.getWidth(id) + this.getPercent(id, deltaValue));
    }
  }
}
