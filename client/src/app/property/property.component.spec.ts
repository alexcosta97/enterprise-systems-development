import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyComponent } from './property.component';
import { FloorsComponent } from '../floors/floors.component';
import { RoomsComponent } from '../rooms/rooms.component';

describe('PropertyComponent', () => {
  let component: PropertyComponent;
  let fixture: ComponentFixture<PropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyComponent,
      FloorsComponent,
      RoomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
