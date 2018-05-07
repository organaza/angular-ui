import { TestBed, inject } from '@angular/core/testing';

import { SortTableSettingsService } from './sorttable.settings.service';
import { Observable } from 'rxjs';

describe('SortTableSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SortTableSettingsService,
      ]
    });
  });

  it('should be created', inject([SortTableSettingsService], (service: SortTableSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
