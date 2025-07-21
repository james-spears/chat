import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Subject, Observable, tap } from 'rxjs';

declare global {
  interface Window {
    clientId: string; // change this
  }
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>; // Declare the WebSocketSubject
  clientId: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      const clientId = window.clientId;
      if (!clientId) {
        throw new Error('clientId not found');
      } else {
        this.clientId = clientId;
      }
    }
    // Initialize the WebSocket connection to your server URL
    this.socket$ = webSocket('ws://localhost:8080');
    this.socket$
      .pipe(
        tap({
          next: (msg) => {
            console.log('received:', msg);
          }, // Handle incoming messages
          error: (err) => console.error('WebSocket error:', err), // Handle errors
          complete: () => console.log('Connection closed'), // Handle closure
        }),
      )
      .subscribe();
  }

  // get sessionId(): string {
  //   return this.sessionId$.value;
  // }

  // Method to send messages to the WebSocket server
  sendMessage(message: any): void {
    console.log('message', message);
    this.socket$.next({ ...message, clientId: this.clientId });
  }

  // Method to receive messages as an Observable
  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  // Method to close the WebSocket connection
  closeConnection(): void {
    this.socket$.complete();
  }
}
