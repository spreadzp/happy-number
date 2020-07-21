import { Component, OnInit } from '@angular/core';
import { LotoService } from '../util/loto.service';
import { JpService } from '../util/jp.service';
import { Web3Service } from '../util/web3.service';

@Component({
  selector: 'app-win-balls',
  templateUrl: './win-balls.component.html',
  styleUrls: ['./win-balls.component.scss'],
})
export class WinBallsComponent implements OnInit {
  backetOfBalls = [];
  activeAccount = '';
  constructor(
    private lotoService: LotoService,
    private jpService: JpService,
    private web3Service: Web3Service
  ) {}

  ngOnInit() {
    this.lotoService.boughtBalls.subscribe((balls) => {
      this.backetOfBalls = balls;
    });
    this.web3Service.activeAccount.subscribe((account) => {
      this.activeAccount = account;
      this.jpService.getBoughtTickets(this.activeAccount);
    });

  }

  returnBall(numberBall: number) {
    this.lotoService.returnBallFromBacket(numberBall);
  }

  setDelay(ind: number): string {
    return 0.3 * (ind + 1) + 's';
  }
}
