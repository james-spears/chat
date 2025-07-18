import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

export type Participant = 'agent' | 'user';

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
})
export class Utterance {
  @Input() utterance: IUtterance | undefined;
}
