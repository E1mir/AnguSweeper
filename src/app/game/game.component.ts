import { Component, OnDestroy, OnInit } from '@angular/core';
import { BEGINNER, DIFFICULTY_LEVELS } from '../app.constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';
import { Score } from '../models/score.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  public time: number = 0;
  public highScore: Score;
  public difficultySelectFormGroup: FormGroup;
  public DIFFICULTY_LEVELS = DIFFICULTY_LEVELS;

  private startGameSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    this.initializeGameDifficult();
    this.timerSubscription = this.gameService.timer.subscribe(
      (time: number) => {
        this.time = time;
      }
    );
  }

  onStartNewGame(): void {
    this.time = 0;
    const difficult = this.difficultySelectFormGroup.get('difficult').value;
    this.highScore = this.gameService.getHighScore(difficult);
    this.gameService.startGame(difficult);
  }


  private initializeGameDifficult(): void {
    this.difficultySelectFormGroup = new FormGroup({
      difficult: new FormControl(BEGINNER, Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.startGameSubscription.unsubscribe();
  }
}
