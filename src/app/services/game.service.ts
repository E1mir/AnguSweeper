import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public timer = new Subject<number>();
  public onStartGame = new Subject<boolean>();

  private storage: Storage;
  private _highScore: number;
  private _time: number;
  private interval;

  constructor() {
    this.storage = localStorage;
  }

  set highScore(timeInSeconds: number) {
    this.storage.setItem('high-score', `${timeInSeconds}`);
  }

  get highScore(): number {
    return +this.storage.getItem('high-score');
  }

  set time(time: number) {
    this._time = time;
  }

  get time(): number {
    return this._time;
  }

  startGame() {
    this.onStartGame.next(true);
    this.time = 0;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.time++;
      this.timer.next(this.time);
    }, 1000);
  }
}
