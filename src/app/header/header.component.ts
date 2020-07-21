import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { JpService } from "../util/jp.service";
import { ShowPageService } from "../util/showPage.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  opened: boolean;
  JackPot: any;

  constructor(
    private matSnackBar: MatSnackBar,
    private showPageService: ShowPageService,
    private jpService: JpService
  ) {}

  ngOnInit(): void {
    this.jpService.checkFreeTickets();
  }

  startJackPot() {
    this.jpService.getJpContract().subscribe((deployed) => {
      const t = deployed.then((contract) => {
        console.log("@contract :>> ", contract);
        contract.play({ from: this.jpService.accounts[0] }).then((result) => {
          // set current address !!!
          console.log("result :>> ", result);
          this.jpService.checkFreeTickets();
          console.log("result.logs[0] :>> ", result.logs[0]);
          const gameOverMessage = `The game 2 is finished. JackPot is ${result.logs[0].args.jackPotNumber}
          and equals 5 tokens. JP get '0x1'. Winners number from ${result.logs[0].args.winnerMinNumber} to
           ${result.logs[0].args.winnerMaxNumber}. Winner prize is 3 tokens`;
          this.matSnackBar.open(gameOverMessage, "Undo", { duration: 8000 });
        });
      });
    });
  }
  changePage(page: string) {
    this.showPageService.changeStatusPage(page);
  }
}
