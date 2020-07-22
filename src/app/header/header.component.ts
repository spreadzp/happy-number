import { Component, OnInit, AfterViewChecked, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { JpService } from '../util/jp.service';
import { ShowPageService } from '../util/showPage.service';
import { Web3Service } from '../util/web3.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  opened: boolean;
  JackPot: any;
  owner = '';
  activeAccount = '';
  @Input() nubmerGame: string;
  constructor(
    private matSnackBar: MatSnackBar,
    private showPageService: ShowPageService,
    private jpService: JpService,
    private web3Service: Web3Service
  ) {}

  ngOnInit(): void {
    this.jpService.checkFreeTickets();
    this.setOwner();
    this.web3Service.activeAccount.subscribe((account) => {
      this.activeAccount = account;

      if (this.owner === '') {
        this.setOwner();
      }
    });
  }
  ngAfterViewChecked() {
    this.isOwner();
  }
  isOwner() {
    return this.owner.toLowerCase() === this.activeAccount.toLowerCase();
  }
  setOwner() {
    this.jpService.getJpContract().subscribe((deployed) => {
      const t = deployed.then((contract) => {
        console.log('@contract :>> ', contract);
        contract.owner().then((result) => {
          this.owner = result;
        });
      });
    });
  }

  startJackPot() {
    this.jpService.getJpContract().subscribe((deployed) => {
      const t = deployed.then((contract) => {
        console.log('@contract :>> ', contract);
        console.log('this.owner :>> ', this.owner);
        contract.play({ from: this.owner, gas: 600000 }).then((result) => {
          // set current address !!!
          console.log('result :>> ', result);
          this.jpService.checkFreeTickets();
          console.log('result.logs[0] :>> ', result.logs[0]);
          const gameOverMessage = `The lottery ${this.nubmerGame} is finished. JackPot number ${result.logs[0].args.jackPotNumber}!
          Winners number from ${result.logs[0].args.winnerMinNumber} to
           ${result.logs[0].args.winnerMaxNumber}.`;
          this.matSnackBar.open(gameOverMessage, 'Undo', { duration: 8000 });
        });
      });
    });
  }
  changePage(page: string) {
    this.showPageService.changeStatusPage(page);
  }
}
