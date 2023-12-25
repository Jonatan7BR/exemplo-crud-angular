import { Injectable, signal } from '@angular/core';

export enum MessageType {
	Success = 'success',
	Error = 'error'
}

@Injectable({
	providedIn: 'root'
})
export class MessageService {
	message = signal('');
	messageType = signal(MessageType.Success);
	messageVisible = signal(false);

	sendMessage(message: string, messageType: MessageType = MessageType.Success): void {
		this.message.set(message);
		this.messageType.set(messageType);
		this.messageVisible.set(true);

		setTimeout(() => {
			this.messageVisible.set(false);
		}, 5000);
	}
}
