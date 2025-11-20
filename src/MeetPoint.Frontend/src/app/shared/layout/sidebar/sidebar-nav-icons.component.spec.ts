import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavIconsComponent } from './sidebar-nav-icons.component';

describe('LeftNavComponent', () => {
  let component: SidebarNavIconsComponent;
  let fixture: ComponentFixture<SidebarNavIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNavIconsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNavIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
