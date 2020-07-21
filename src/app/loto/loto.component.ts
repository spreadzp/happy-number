import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { JpService } from '../util/jp.service';
import { ShowPageService } from '../util/showPage.service';

@Component({
  selector: 'app-loto',
  templateUrl: './loto.component.html',
  styleUrls: ['./loto.component.scss'],
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
}
