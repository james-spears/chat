import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, merge, Observable, tap } from 'rxjs';
import { ITranscript } from './transcript/transcript';
import { IUtterance } from './transcript/utterance/utterance';
import { WebSocketService } from './websocket-service';
import { LocalStorageService } from './local-storage-service';

export interface Configuration {
  title: 'Chat';
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  webSocketService = inject(WebSocketService);
  localStorageService = inject(LocalStorageService);

  messages$ = this.webSocketService.getMessages();

  transcriptSubject: BehaviorSubject<ITranscript | undefined> =
    new BehaviorSubject<ITranscript | undefined>(undefined);
  transcript$: Observable<ITranscript | undefined> =
    this.transcriptSubject.asObservable();

  typingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  typing$: Observable<boolean> = merge(
    this.messages$.pipe(filter((msg) => msg.type === 'bot_thinking')),
    this.messages$
      .pipe(filter((msg) => msg.type === 'chat'))
      .pipe(map(() => void 0)),
  );

  constructor() {
    this.messages$
      .pipe(
        tap({
          next: (msg) => {
            switch (msg.type) {
              case 'connect':
                // pull out session id
                const sessionId = this.localStorageService.getItem('sessionId');
                if (sessionId) {
                  this.webSocketService.sendMessage({
                    type: 'heartbeat',
                    content: null,
                    sessionId,
                  });
                  this.webSocketService.sendMessage({
                    type: 'transcript',
                    content: null,
                    sessionId,
                  });
                } else {
                  this.webSocketService.sendMessage({
                    type: 'session',
                    content: null,
                  });
                }
                break;
              case 'session':
                // pull out session id
                if (msg.sessionId) {
                  this.localStorageService.setItem('sessionId', msg.sessionId);
                } else {
                  throw new Error('no session available');
                }
                break;
              case 'transcript':
                if (msg.content)
                  this.transcriptSubject.next(
                    msg.content.sort(
                      (a: IUtterance, b: IUtterance) =>
                        a.timestamp - b.timestamp,
                    ),
                  );
                break;
              case 'chat':
                if (msg.content) {
                  this.addUtteranceToTranscript(msg.content);
                }
                break;
              default:
                console.log('ignoring message: ', msg.type);
            }
          }, // Handle incoming messages
          error: (err) => console.error('WebSocket error:', err), // Handle errors
          complete: () => console.log('Connection closed'), // Handle closure
        }),
      )
      .subscribe();
  }

  sendEvent(event: Partial<IUtterance>) {
    const sessionId = this.localStorageService.getItem('sessionId');
    const utterance: IUtterance = {
      text: event.text || '',
      participant: 'user',
      timestamp: Date.now() + 2,
    };
    console.log('sendEvent Invoked', sessionId);
    this.addUtteranceToTranscript(utterance);
    this.webSocketService.sendMessage({
      type: 'chat',
      content: utterance,
      sessionId,
    });
  }

  private addUtteranceToTranscript(utterance: IUtterance) {
    const transcript = this.transcriptSubject.value;
    if (transcript) {
      transcript.push(utterance);
      this.transcriptSubject.next(
        transcript.sort(
          (a: IUtterance, b: IUtterance) => a.timestamp - b.timestamp,
        ),
      );
    }
  }
}
