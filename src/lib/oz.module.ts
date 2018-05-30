import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlertService } from './alert/alert.service';
import { AlertComponent } from './alert/alert.component';

import { ButtonComponent } from './button/button.component';
import { IconComponent } from './icon/icon.component';

import { CalendarComponent } from './calendar/calendar.component';

import { CheckboxComponent } from './checkbox/checkbox.component';

import { DurationValidatorDirective } from './validators/duration-validator.directive';

import { WithOutSpacesValidatorDirective } from './validators/without-spaces-validator.directive';

import { ColorPickerComponent } from './colorpicker/colorpicker.component';

import { DatePickerComponent } from './datepicker/datepicker.component';

import { DropDownComponent } from './dropdown/dropdown.component';

import { PreventParentScrollDirective } from './prevent-parent-scroll/prevent-parent-scroll.directive';

import { SwitchComponent } from './switch/switch.component';

import { TextinputComponent } from './textinput/textinput.component';

import { RangeComponent } from './range/range.component';

import { TimePickerComponent } from './timepicker/timepicker.component';

import { TooltipService } from './tooltip/tooltip.service';
import { TooltipComponent } from './tooltip/tooltip/tooltip.component';
import { TooltipContainerComponent } from './tooltip/tooltip-container/tooltip-container.component';
import { TooltipDirective } from './tooltip/tooltip.directive';

import { TextWithTooltipComponent } from './text-with-tooltip/text-with-tooltip.component';

import { ToastService } from './toast/toast.service';
import { ToastComponent } from './toast/toast.component';

import { ModalService } from './modal/modal.service';
import { ModalComponent } from './modal/modal/modal.component';
import { ModalHeaderDirective } from './modal/modal/modal.component';
import { ModalSubHeaderDirective } from './modal/modal/modal.component';
import { ModalHeaderButtonsDirective } from './modal/modal/modal.component';
import { ModalCloseDirective } from './modal/modal/modal.component';
import { ModalBodyDirective } from './modal/modal/modal.component';
import { ModalFooterDirective } from './modal/modal/modal.component';
import { ModalContainerDirective } from './modal/modal-container.directive';

import { SortTableService } from './sorttable/sorttable.service';
import { SortTableDirective } from './sorttable/sorttable.directive';
import { SortTableColumnDirective } from './sorttable/sorttable-column.directive';
import { SortTableColumnFixedDirective } from './sorttable/sorttable-column-fixed.directive';
import { SortTableColumnHeadDirective } from './sorttable/sorttable-column-head.directive';
import { SortTableDragColumnDirective } from './sorttable/sorttable-drag-column.directive';
import { SortTableDragColumnHandlerDirective } from './sorttable/sorttable-drag-column-handler.directive';
import { SortTableRowDirective } from './sorttable/sorttable-row.directive';
import { SortTableRowHandlerDirective } from './sorttable/sorttable-row-handler.directive';

import { DragulaDelayLiftDirective } from './dragula-delay-lift/dragula-delay-lift.directive';

import { ObjectKeysPipe } from './pipes/object-keys.pipe';
import { FormatArrayStringPipe } from './pipes/array-string.pipe';
import { DurationToStringPipe } from './pipes/duration-to-string.pipe';
import { TimeStampToDatePipe } from './pipes/timestamp-to-date.pipe';
import { VirtualScrollComponent } from './virtual-scroll/virtual-scroll.component';
import { SortTableSettingsService } from './sorttable/sorttable.settings.service';
import { PagerComponent } from './pager/pager.component';
import { ShortcutService } from './shortcut/shortcut.service';
import { ParseBooleanPipe } from './pipes/parse-boolean.pipe';
import { OzSettingsService } from './settings/settings.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [],
  entryComponents: [
    CalendarComponent,
    TooltipComponent,
  ],
  declarations: [
    AlertComponent,
    ButtonComponent,
    CalendarComponent,
    CheckboxComponent,
    DurationValidatorDirective,
    WithOutSpacesValidatorDirective,
    ColorPickerComponent,
    DatePickerComponent,
    DropDownComponent,
    PreventParentScrollDirective,
    SwitchComponent,
    TextinputComponent,
    RangeComponent,
    TimePickerComponent,
    TooltipComponent,
    TooltipContainerComponent,
    TooltipDirective,
    TextWithTooltipComponent,
    ToastComponent,
    ModalComponent,
    ModalContainerDirective,
    ModalHeaderDirective,
    ModalSubHeaderDirective,
    ModalHeaderButtonsDirective,
    ModalCloseDirective,
    ModalBodyDirective,
    ModalFooterDirective,
    SortTableDirective,
    SortTableColumnDirective,
    SortTableColumnFixedDirective,
    SortTableColumnHeadDirective,
    SortTableDragColumnDirective,
    SortTableDragColumnHandlerDirective,
    SortTableRowDirective,
    SortTableRowHandlerDirective,
    FormatArrayStringPipe,
    DurationToStringPipe,
    TimeStampToDatePipe,
    ObjectKeysPipe,
    ParseBooleanPipe,
    DragulaDelayLiftDirective,
    VirtualScrollComponent,
    IconComponent,
    PagerComponent,
  ],
  exports: [
    AlertComponent,
    ButtonComponent,
    CalendarComponent,
    CheckboxComponent,
    DurationValidatorDirective,
    WithOutSpacesValidatorDirective,
    ColorPickerComponent,
    DatePickerComponent,
    DropDownComponent,
    PreventParentScrollDirective,
    SwitchComponent,
    TextinputComponent,
    RangeComponent,
    TimePickerComponent,
    TooltipComponent,
    TooltipContainerComponent,
    TooltipDirective,
    TextWithTooltipComponent,
    ToastComponent,
    ModalComponent,
    ModalContainerDirective,
    ModalHeaderDirective,
    ModalSubHeaderDirective,
    ModalHeaderButtonsDirective,
    ModalCloseDirective,
    ModalBodyDirective,
    ModalFooterDirective,
    SortTableDirective,
    SortTableColumnDirective,
    SortTableColumnFixedDirective,
    SortTableColumnHeadDirective,
    SortTableDragColumnDirective,
    SortTableDragColumnHandlerDirective,
    SortTableRowDirective,
    SortTableRowHandlerDirective,
    FormatArrayStringPipe,
    DurationToStringPipe,
    TimeStampToDatePipe,
    ObjectKeysPipe,
    ParseBooleanPipe,
    DragulaDelayLiftDirective,
    VirtualScrollComponent,
    IconComponent,
    PagerComponent,
  ],
})
export class OzModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OzModule,
      providers: [
        SortTableSettingsService,
        SortTableService,
        ModalService,
        AlertService,
        ToastService,
        TooltipService,
        ShortcutService,
        OzSettingsService,
      ]
    };
  }
}
