import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IUtterance, Utterance } from './utterance/utterance';
import { Observable, tap } from 'rxjs';
import { ChatService } from '../chat.service';

export interface ITranscript {
  utterances: IUtterance[];
}

@Component({
  selector: 'lib-transcript',
  imports: [AsyncPipe, Utterance],
  templateUrl: './transcript.html',
  styleUrl: './transcript.scss',
})
export class Transcript {
  @Output() transcriptChange: EventEmitter<void> = new EventEmitter<void>();
  chatService = inject(ChatService);
  transcript$: Observable<ITranscript | undefined> =
    this.chatService.transcript$;
  typing$ = this.chatService.typing$.pipe(
    tap(() => this.transcriptChange.emit()),
  );
}
