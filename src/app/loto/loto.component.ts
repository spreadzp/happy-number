import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Web3Service } from "../util/web3.service";
import { LotoService } from "../util/loto.service";
import { JpService } from "../util/jp.service";

declare let require: any;
const jackPot_artifacts = require("./../../../build/contracts/JackPotLottery.json");

@Component({
  selector: "app-loto",
  templateUrl: "./loto.component.html",
  styleUrls: ["./loto.component.css"],
})
export class LotoComponent implements OnInit {
  JackPot: any;

  constructor(
    private matSnackBar: MatSnackBar,

    private jpService: JpService
  ) {}

  ngOnInit(): void {
    this.jpService.checkFreeTickets();
  }

  startJackPot() {
    this.jpService.getJpContract().subscribe(deployed => {
      const t = deployed.then((contract) => {
        console.log('@contract :>> ', contract);
        contract.play( {from: this.jpService.accounts[0]}).then((result) => { // set current address !!!
           console.log('result :>> ', result);
            this.jpService.checkFreeTickets();
        });
      }
    );
  });
  }

}
