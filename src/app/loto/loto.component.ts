import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { JpService } from '../util/jp.service';
import { ShowPageService } from '../util/showPage.service';
import { Web3Service } from '../util/web3.service';

@Component({
  selector: 'app-loto',
  templateUrl: './loto.component.html',
  styleUrls: ['./loto.component.scss'],
})
export class LotoComponent implements OnInit {
  JackPot: any;
  activePage = 'loto';
  opened = false;
  lotteryNumber = 1;
  activeAccount = '';

  constructor(
    private matSnackBar: MatSnackBar,
    private showPageService: ShowPageService,
    private jpService: JpService,
    private web3Service: Web3Service
  ) {}

  ngOnInit(): void {
    this.jpService.checkFreeTickets();
    this.showPageService.getStatusPage().subscribe(namePage =>  this.activePage = namePage);
    this.web3Service.activeAccount.subscribe(account => {
      this.activeAccount = account;

    });
    this.getNumberGame();
  }


  getNumberGame() {
    this.jpService.getJpContract().subscribe((deployed) => {
      const t = deployed.then((contract) => {
        console.log('@contract : >> ', contract);
        contract.numberGame.call().then((result) => {
          console.log('########### result :>> ', result);
          this.lotteryNumber =  Number(result);
        });
      });
    });
  }
}
