import { Component, OnInit } from '@angular/core';
import { ShowPageService } from '../util/showPage.service';
import { LotoService } from '../util/loto.service';
import { Gamer } from '../shared/gamer.interface';
import { JpService } from "../util/jp.service";

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  showTable = false;
  displayedColumns: string[] = ['addressGamer', 'numberTicket'];
  gamersTickets: Gamer[] = [];
  constructor( private lotoService: LotoService, private jpService: JpService) { }

  ngOnInit() {
    this.jpService.checkFreeTickets();
    this.lotoService.gamersTicketsOfGame.subscribe(tickets => {
      this.gamersTickets = tickets;
      console.log('this.gamersTickets :>> ', this.gamersTickets);
      this.showTable = true;
    } );
  }
}
