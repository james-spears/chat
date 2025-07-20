import { DatePipe } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

export type Participant = 'bot' | 'agent' | 'user';

export interface IUtterance {
  text: string;
  participant: Participant;
  timestamp: number;
}

@Component({
  selector: 'lib-utterance',
  imports: [DatePipe],
  templateUrl: './utterance.html',
  styleUrl: './utterance.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Utterance {
  @Input() utterance: IUtterance | undefined;
}
