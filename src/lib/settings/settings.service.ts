import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OzSettingsService {
  dateFormat = 'YYYY-MM-DDTHH:mm:ssZ';

  dateTimeShowFormat = 'L LT';
  dateShowFormat = 'L';

  timepickerHelperIcon = 'timelapse';
  selectIconUp = 'keyboard_arrow_up';
  selectIconDown = 'keyboard_arrow_down';
}
