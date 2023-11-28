import { Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  isDarkMode = signal(false);

  setTheme(darkMode: boolean): void {
    this.isDarkMode.set(darkMode);
  }

  toggleTheme(): void {
    this.isDarkMode.update(mode => !mode);
  }
}
