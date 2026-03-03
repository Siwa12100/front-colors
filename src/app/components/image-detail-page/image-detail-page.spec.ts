import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDetailPage } from './image-detail-page';

describe('ImageDetailPage', () => {
  let component: ImageDetailPage;
  let fixture: ComponentFixture<ImageDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageDetailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
