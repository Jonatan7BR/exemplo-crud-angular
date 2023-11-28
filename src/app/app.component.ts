import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);

  darkModeOn = this.themeService.isDarkMode;

  constructor() {
    effect(() => {
      if (this.darkModeOn()) {
        document.body.classList.remove('lightmode');
        document.body.classList.add('darkmode');
        document.documentElement.style.setProperty('color-scheme', 'dark');
        localStorage.setItem('darkMode', '1');
      } else {
        document.body.classList.remove('darkmode');
        document.body.classList.add('lightmode');
        document.documentElement.style.setProperty('color-scheme', 'light');
        localStorage.setItem('darkMode', '0');
      }
    });
  }

  ngOnInit(): void {
    let userPrefersDarkMode = false;
    const themePreference = localStorage.getItem('darkMode');
    if (themePreference !== null) {
      userPrefersDarkMode = themePreference === '1';
    } else {
      userPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.themeService.setTheme(userPrefersDarkMode);
  }
}
