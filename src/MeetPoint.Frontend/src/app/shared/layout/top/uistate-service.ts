import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UIStateService {
  private _location = inject(Location);
  theme: string = 'dark';

  constructor() {
    const saved = sessionStorage.getItem('theme');
    this.theme = saved ?? 'dark';
    sessionStorage.setItem('theme', this.theme);
    document.documentElement.classList.add(this.theme);
  }

  setDefault(theme: 'dark' | 'light'): void {
    sessionStorage.setItem('theme', theme);
    document.documentElement.classList.add(theme);
  }

  get canGoBack(): boolean {
    return window.history.length > 1;
  }

  get isDarkTheme(): boolean {
    return this.theme == 'dark';
  }

  goBack(): void {
    this._location.back();
  }

  toggleTheme(): void {
    const newTheme = this.theme == 'dark' ? 'light' : 'dark';
    document.documentElement.classList.replace(this.theme, newTheme);

    this.theme = newTheme;
    sessionStorage.setItem('theme', this.theme);
  }
}
