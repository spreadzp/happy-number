import { Component, OnInit } from "@angular/core";
import { LotoService } from "../util/loto.service";
import { MatSnackBar } from '@angular/material';
import { JpService } from '../util/jp.service';
import { Web3Service } from '../util/web3.service';

@Component({
  selector: "app-ball",
  templateUrl: "./ball.component.html",
  styleUrls: ["./ball.component.css"],
})
export class BallComponent implements OnInit {
  activeBalls = [];
  activeAccount = '';
  constructor(private lotoService: LotoService, private matSnackBar: MatSnackBar,
     private jpService: JpService, private web3Service: Web3Service) {}

  ngOnInit() {
    this.lotoService.activeBalls.subscribe((balls) => {
      this.activeBalls = balls;
    });
    this.web3Service.activeAccount.subscribe(account => this.activeAccount = account);
  }
  addBallToBacket(numberTicket: number) {
   // this.lotoService.buyBall(numberTicket);
    this.buyTicket(numberTicket);
  }
  buyTicket(numberTicket: number) {
    this.jpService.getJpContract().subscribe(deployed => {
      console.log('this.web3Service.activeAccount :>> ', this.activeAccount);
      const t = deployed.then((contract) => {
        console.log('@contract :>> ', contract);
        contract.buyTicket(numberTicket, {from: this.activeAccount, gas: 600000})
        .then((result) => { // set current address !!!
           console.log('result :>> ', result);
          if (result && result.logs && result.logs[0]) {
            this.jpService.checkFreeTickets();
            console.log('result.logs[0] :>> ', result.logs[0]);
            this.matSnackBar.open(`You ${result.logs[0].args.LotteryNumber.words[0]} ${numberTicket}`, 'Undo', {duration: 3000});
          } else {
            this.matSnackBar.open(`Some error!`, null, {duration: 3000});
          }
        });
      }
    );
  });
}
}
