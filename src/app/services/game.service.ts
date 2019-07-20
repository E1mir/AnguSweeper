import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Score } from '../models/score.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public timer = new Subject<number>();
  public onStartGame = new Subject<string>();

  private _storage: Storage;
  private _time: number;
  private _interval;

  constructor() {
    this._storage = localStorage;
  }

  updateHighScore(timeInSeconds: number, difficultyLevel: string) {
    const previousHighScore = this.getHighScore(difficultyLevel);
    const currentScore = new Score(timeInSeconds, difficultyLevel);
    const key = `high-score-${difficultyLevel}`;

    if (previousHighScore) {
      if (previousHighScore.time > timeInSeconds) {
        this._storage.setItem(key, JSON.stringify(currentScore));
      }
    } else {
      this._storage.setItem(key, JSON.stringify(currentScore));
    }
  }

  getHighScore(difficultyLevel: string): Score {
    return JSON.parse(this._storage.getItem(`high-score-${difficultyLevel}`));
  }

  set time(time: number) {
    this._time = time;
  }

  get time(): number {
    return this._time;
  }

  startGame(difficult: string) {
    this.onStartGame.next(difficult);
    this.time = 0;
    if (this._interval) {
      clearInterval(this._interval);
    }
    this._interval = setInterval(() => {
      this.time++;
      this.timer.next(this.time);
    }, 1000);
  }

  gameWon(difficultyLevel: string) {
    if (this._interval) {
      clearInterval(this._interval);
      this.updateHighScore(this.time, difficultyLevel);
    }
  }

  stopGame() {
    if (this._interval) {
      this.time = 0;
      clearInterval(this._interval);
    }
  }
}
