import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Utterance } from './utterance';

describe('Utterance', () => {
  let component: Utterance;
  let fixture: ComponentFixture<Utterance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Utterance],
    }).compileComponents();

    fixture = TestBed.createComponent(Utterance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
