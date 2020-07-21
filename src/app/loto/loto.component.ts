import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Web3Service } from "../util/web3.service";
import { LotoService } from "../util/loto.service";
import { JpService } from "../util/jp.service";
import { ShowPageService } from '../util/showPage.service';

declare let require: any;
const jackPot_artifacts = require("./../../../build/contracts/JackPotLottery.json");

@Component({
  selector: "app-loto",
  templateUrl: "./loto.component.html",
  styleUrls: ["./loto.component.scss"],
})
export class LotoComponent implements OnInit {
  JackPot: any;
  activePage = 'loto';
  constructor(
    private matSnackBar: MatSnackBar,
    private showPageService: ShowPageService,
    private jpService: JpService
  ) {}

  ngOnInit(): void {
    this.jpService.checkFreeTickets();
    this.showPageService.getStatusPage().subscribe(namePage =>  this.activePage = namePage);
  }

  startJackPot() {
    this.jpService.getJpContract().subscribe(deployed => {
      const t = deployed.then((contract) => {
        console.log('@contract :>> ', contract);
        contract.play( {from: this.jpService.accounts[0]}).then((result) => { // set current address !!!
           console.log('result :>> ', result);
            this.jpService.checkFreeTickets();
            const gameOverMessage = `The game 2 is finished. JackPot is 60and equals 5 tokens.
             JP get '0x1'. Winners number from 61 to 70. Winner prize is 3 tokens`;
            this.matSnackBar.open(gameOverMessage, 'Undo', {duration: 8000});
        });
      }
    );
  });
  }

}
