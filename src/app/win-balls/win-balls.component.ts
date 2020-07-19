import { Component, OnInit } from '@angular/core';
import { LotoService } from '../util/loto.service';

@Component({
  selector: 'app-win-balls',
  templateUrl: './win-balls.component.html',
  styleUrls: ['./win-balls.component.css']
})
export class WinBallsComponent implements OnInit {
  backetOfBalls = [];
  constructor(private lotoService: LotoService) {}

  ngOnInit() {
    this.lotoService.boughtBalls.subscribe(balls => {
      this.backetOfBalls = balls;
    });
  }

  returnBall(numberBall: number) {
    this.lotoService.returnBallFromBacket(numberBall);
  }

  setDelay(ind: number): string {
    return 0.3 * (ind + 1) + 's';
  }

}
