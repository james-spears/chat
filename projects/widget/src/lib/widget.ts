import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Transcript } from './transcript/transcript';
import { ChatService } from './chat-service';
import { WebSocketService } from './websocket-service';

@Component({
  selector: 'lib-widget',
  imports: [CdkDrag, Transcript, ReactiveFormsModule],
  templateUrl: './widget.html',
  styleUrl: './widget.scss',
})
export class Widget {
  @ViewChild('transcript') transcript: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('button') button: ElementRef<HTMLButtonElement> | undefined;

  isOpen = signal(false);

  protected toggle() {
    this.isOpen.set(!this.isOpen());
    this.scrollToBottom();
  }

  formGroup: FormGroup = inject(FormBuilder).group({
    text: ['', Validators.required],
  });

  private chatService = inject(ChatService);
  private webSocketService = inject(WebSocketService);

  messages = this.webSocketService.getMessages().subscribe();

  submit() {
    const text = this.formGroup.get('text')?.value;
    if (text) {
      try {
        this.chatService.sendEvent(this.formGroup.value);
        this.formGroup.reset();
        this.scrollToBottom();
      } catch (e) {
        if (e instanceof Error) {
          console.log(e);
        }
      }
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.transcript) {
        this.transcript.nativeElement.scrollTo({
          top: this.transcript.nativeElement.scrollHeight, // or a specific pixel value
          behavior: 'smooth',
        });
      }
    }, 100);
  }
}
