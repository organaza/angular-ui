import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { PreventParentScrollDirective } from '../prevent-parent-scroll/prevent-parent-scroll.directive';
import { TextinputComponent } from './textinput.component';
import { IconComponent } from '../icon/icon.component';

describe('TextinputComponent', () => {
  let component: TextinputComponent;
  let fixture: ComponentFixture<TextinputComponent>;

  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [
          PreventParentScrollDirective,
          ButtonComponent,
          TextinputComponent,
          IconComponent,
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TextinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it(`should set value 'works'`, async(() => {
  //   component.writeValue('works');
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('.oz-textinput-container').getAttribute('value')).toContain('works');
  // }));
});
