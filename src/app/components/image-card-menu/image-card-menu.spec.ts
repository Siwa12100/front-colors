import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCardMenu } from './image-card-menu';

describe('ImageCardMenu', () => {
  let component: ImageCardMenu;
  let fixture: ComponentFixture<ImageCardMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCardMenu]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ImageCardMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
