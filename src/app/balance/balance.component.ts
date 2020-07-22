import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { JpService } from '../util/jp.service';
import { Web3Service } from '../util/web3.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {
tokens = 0;
activeAccount = '';
  constructor(private matSnackBar: MatSnackBar,
    private jpService: JpService,
    private web3Service: Web3Service) { }

  ngOnInit() {
    this.web3Service.activeAccount.subscribe(account => {
      this.activeAccount = account;
      this.getBalance(this.activeAccount);
    });
  }
  getBalance(addressGamer: string) {
    this.jpService.getJpContract().subscribe((deployed) => {
      const t = deployed.then((contract) => {
        contract.balanceOf(addressGamer).then((result) => {
          this.tokens = Number(result);

        });
      });
    });
  }
}
