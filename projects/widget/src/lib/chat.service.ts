import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ITranscript } from './transcript/transcript';
import { IUtterance } from './transcript/utterance/utterance';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  transcriptSubject: BehaviorSubject<ITranscript | undefined> =
    new BehaviorSubject<ITranscript | undefined>(undefined);
  transcript$: Observable<ITranscript | undefined> =
    this.transcriptSubject.asObservable();

  typingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  typing$: Observable<boolean> = this.typingSubject.asObservable();

  constructor() {
    this.retrieveTranscript();
  }

  retrieveTranscript(): void {
    of({
      utterances: [
        { text: 'Hello!', participant: 'user', timestamp: Date.now() },
        {
          text: 'Good day to you, Sir!',
          participant: 'agent',
          timestamp: Date.now() + 1,
        },
        { text: 'Good day!', participant: 'user', timestamp: Date.now() + 2 },
      ] as IUtterance[],
    })
      .pipe(tap((res) => this.transcriptSubject.next(res)))
      .subscribe();
  }

  sendEvent(event: Partial<IUtterance>) {
    const transcript = this.transcriptSubject.value;
    transcript?.utterances.push({
      text: event.text || '',
      participant: 'user',
      timestamp: Date.now() + 2,
    });
    this.transcriptSubject.next(transcript);
    this.typingSubject.next(true);
    setTimeout(() => {
      this.typingSubject.next(false);
      const transcript = this.transcriptSubject.value;
      transcript?.utterances.push({
        text: "I'm sorry, I dun understand",
        participant: 'agent',
        timestamp: Date.now() + 2,
      });
      this.transcriptSubject.next(transcript);
    }, 5000);
  }
}
