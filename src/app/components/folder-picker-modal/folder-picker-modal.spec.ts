import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderPickerModal } from './folder-picker-modal';

describe('FolderPickerModal', () => {
  let component: FolderPickerModal;
  let fixture: ComponentFixture<FolderPickerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderPickerModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderPickerModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
