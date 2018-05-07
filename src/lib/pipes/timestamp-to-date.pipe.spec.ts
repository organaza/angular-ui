import { TimeStampToDatePipe } from './timestamp-to-date.pipe';

describe('TimeStampToDatePipe', () => {
  it('create an instance', () => {
    const pipe = new TimeStampToDatePipe();
    expect(pipe).toBeTruthy();
  });
});
