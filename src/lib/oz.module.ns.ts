import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from './alert/alert.service';
import { DurationValidatorDirective } from './validators/duration-validator.directive';
import { WithOutSpacesValidatorDirective } from './validators/without-spaces-validator.directive';
import { PreventParentScrollDirective } from './prevent-parent-scroll/prevent-parent-scroll.directive';
import { TooltipService } from './tooltip/tooltip.service';
import { TooltipDirective } from './tooltip/tooltip.directive';
import { ToastService } from './toast/toast.service';
import { ModalService } from './modal/modal.service';
import { ModalContainerDirective } from './modal/modal-container.directive';
import { SortTableService } from './sorttable/sorttable.service';
import { ObjectKeysPipe } from './pipes/object-keys.pipe';
import { FormatArrayStringPipe } from './pipes/array-string.pipe';
import { DurationToStringPipe } from './pipes/duration-to-string.pipe';
import { TimeStampToDatePipe } from './pipes/timestamp-to-date.pipe';
import { SortTableSettingsService } from './sorttable/sorttable.settings.service';
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

  ],
  declarations: [
    DurationValidatorDirective,
    WithOutSpacesValidatorDirective,
    PreventParentScrollDirective,
    TooltipDirective,
    ModalContainerDirective,
    FormatArrayStringPipe,
    DurationToStringPipe,
    TimeStampToDatePipe,
    ObjectKeysPipe,
    ParseBooleanPipe,
  ],
  exports: [
    DurationValidatorDirective,
    WithOutSpacesValidatorDirective,
    PreventParentScrollDirective,
    TooltipDirective,
    ModalContainerDirective,
    FormatArrayStringPipe,
    DurationToStringPipe,
    TimeStampToDatePipe,
    ObjectKeysPipe,
    ParseBooleanPipe,
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
