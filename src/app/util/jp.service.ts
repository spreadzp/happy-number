import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Web3Service } from './web3.service';
import { LotoService } from './loto.service';

declare let require: any;
const jackPot_artifacts = require('./../../../build/contracts/JackPotLottery.json');

@Injectable({
  providedIn: "root",
})
export class JpService {
  accounts = [];
  jpContractSources$ = null;
  jpContract: Observable<any> = null;
  JackPotAbstraction = null;
  constructor(private web3Service: Web3Service,  private lotoService: LotoService) {
      this.JackPotAbstraction = this.setJpAbstraction();
      this.watchAccount();

  }
   getJpContract(): Observable<any>  {
     if(this.JackPotAbstraction === null) {
      this.JackPotAbstraction = this.setJpAbstraction();
     }
          this.jpContractSources$ = new BehaviorSubject(this.JackPotAbstraction);
          console.log('t :>> ', this.JackPotAbstraction);
          return this.jpContract = this.jpContractSources$.asObservable();


  }
  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
    });
  }

  checkFreeTickets() {
    this.getJpContract().subscribe((deployed) => {
      deployed.then((contract) =>
        contract.getTickets.call().then((tickets) => {
          this.lotoService.setFreeTickets(tickets);
        })
      );
      /// const t = deployed.getTickets.call().then(tickets => {
      //this.lotoService.setFreeTickets(tickets);
      //});
    });
  }

  setJpAbstraction() {
   // const t = this.web3Service.artifactsToContract(jackPot_artifacts).asObservable();
    return this.web3Service.artifactsToContract(jackPot_artifacts)
    .then(async (JackPotAbstraction) => {
      return JackPotAbstraction.deployed();
    });
   // return t.subscribe(JackPotAbstraction => JackPotAbstraction.deployed().asObservable());
  }
}
