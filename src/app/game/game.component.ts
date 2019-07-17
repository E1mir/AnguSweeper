import { Component, OnInit } from '@angular/core';
import { EASY, HARD, MEDIUM } from '../app.constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  public timer: number = 0;
  public selectDifficultFormGroup: FormGroup;
  public EASY = EASY;
  public MEDIUM = MEDIUM;
  public HARD = HARD;
  public difficult: string;

  private interval;

  constructor() {
  }

  ngOnInit() {
    this.difficult = EASY;
    this.selectDifficultFormGroup = new FormGroup({
      'difficult': new FormControl(EASY, Validators.required),
    });
  }

  onStartNewGame() {
    this.difficult = this.selectDifficultFormGroup.get('difficult').value;
    if (this.interval) {
      clearInterval(this.interval);
      this.timer = 0;
    }
    this.interval = setInterval(() => {
      this.timer++;
    }, 1000);
  }
}
