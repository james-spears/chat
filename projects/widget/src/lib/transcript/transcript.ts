import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IUtterance, Utterance } from './utterance/utterance';
import { filter, map, mergeMap, Observable, tap } from 'rxjs';
import { ChatService } from '../chat-service';
import { marked } from 'marked';

export type ITranscript = IUtterance[];

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
    this.chatService.transcript$.pipe(
      filter((utterances) => !!utterances?.length),
      mergeMap((utterances) =>
        Promise.all(
          utterances!.map(async (utterance) => ({
            ...utterance,
            text: await marked(utterance.text),
          })),
        ),
      ),
    );
  typing$ = this.chatService.typing$.pipe(
    tap(() => this.transcriptChange.emit()),
  );

  constructor() {
    this.transcript$.subscribe((transcript) => {
      console.log('trans', transcript);
    });
  }
}
