import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);

  darkModeOn = this.themeService.isDarkMode;
  buttonTitle = computed(() => this.darkModeOn() ? 'Mudar para tema claro' : 'Mudar para tema escuro');

  changeTheme(): void {
    this.themeService.toggleTheme();
  }
}
