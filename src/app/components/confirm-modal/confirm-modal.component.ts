import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-confirm-modal',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './confirm-modal.component.html',
	styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
	@Input() visible = signal(false);
	@Input() dialogText = signal('');
	@Output() confirm = new EventEmitter<boolean>();

	chooseOption(confirmed: boolean): void {
		this.confirm.emit(confirmed);
	}
}
