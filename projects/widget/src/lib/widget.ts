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
import { ChatService } from './chat.service';

@Component({
  selector: 'lib-widget',
  imports: [CdkDrag, Transcript, ReactiveFormsModule],
  template: `
    <!-- @let transcript = transcript$ | async; -->
    <div class="example-boundary">
      <div
        [class]="
          isOpen() ? 'example-box rounded-xl' : 'example-icon rounded-full'
        "
        cdkDragBoundary="body"
        cdkDrag
      >
        @if (isOpen()) {
          <span class="icon-button" (click)="toggle()" role="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </span>
          <div #transcript class="grow w-full overflow-y-auto">
            <lib-transcript
              (transcriptChange)="scrollToBottom()"
            ></lib-transcript>
          </div>
          <form class="w-full" [formGroup]="formGroup" (ngSubmit)="submit()">
            <input
              formControlName="text"
              class="text-input block w-full rounded-b-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </form>
        } @else {
          <span class="icon-button" (click)="toggle()" role="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
          </span>
        }
      </div>
    </div>
  `,
  styleUrl: './widget.styles.scss',
})
export class Widget {
  @ViewChild('transcript') transcript: ElementRef<HTMLDivElement> | undefined;

  isOpen = signal(false);

  protected toggle() {
    this.isOpen.set(!this.isOpen());
  }

  formGroup: FormGroup = inject(FormBuilder).group({
    text: ['', Validators.required],
  });

  private chatService = inject(ChatService);
  // transcript$: Observable<ITranscript | undefined> =
  //   this.chatService.transcript$.pipe(
  //     tap(() => {
  //       if (this.transcript) {
  //         this.transcript.nativeElement.scrollTop =
  //           this.transcript.nativeElement.scrollHeight;
  //       }
  //     })
  //   );

  submit() {
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
