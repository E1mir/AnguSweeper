import { Component, OnDestroy, OnInit } from '@angular/core';
import { ADVANCED, BEGINNER, EXPERT, INTERMEDIATE } from '../app.constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  public time: number = 0;
  public selectDifficultFormGroup: FormGroup;
  public BEGINNER = BEGINNER;
  public INTERMEDIATE = INTERMEDIATE;
  public ADVANCED = ADVANCED;
  public EXPERT = EXPERT;

  public difficult: string;

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
    this.difficult = this.selectDifficultFormGroup.get('difficult').value;
    this.gameService.startGame();
  }


  private initializeGameDifficult(): void {
    this.difficult = BEGINNER;
    this.selectDifficultFormGroup = new FormGroup({
      difficult: new FormControl(BEGINNER, Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.startGameSubscription.unsubscribe();
  }
}
