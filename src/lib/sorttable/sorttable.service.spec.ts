import { TestBed, inject } from '@angular/core/testing';
import { SortTableService } from './sorttable.service';
import { SortTableSettingsService } from './sorttable.settings.service';

describe('SortTableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SortTableSettingsService,
        SortTableService,
      ]
    });
  });

  it('should be created', inject([SortTableService], (service: SortTableService) => {
    expect(service).toBeTruthy();
  }));
});
