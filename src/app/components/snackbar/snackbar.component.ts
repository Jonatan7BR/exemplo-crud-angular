import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';

@Component({
	selector: 'app-snackbar',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './snackbar.component.html',
	styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {
	private messageService = inject(MessageService);

	message = this.messageService.message;
	messageType = this.messageService.messageType;
	visible = this.messageService.messageVisible;

	constructor() {
		effect(() => {
			if (this.visible()) {
				setTimeout(() => {
					this.messageService.hideMessage();
				}, 5000);
			}
		});
	}
}
