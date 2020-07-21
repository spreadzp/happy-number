import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Gamer } from '../shared/gamer.interface';
@Injectable({
  providedIn: 'root',
})
export class LotoService {
  balls = [1, 2, 3, 4, 5, 8, 56, 78, 84, 94, 97, 98];
  private ballsSource$ = new BehaviorSubject(this.balls);
  activeBalls = this.ballsSource$.asObservable();
  backetBoughtBalls = [];
  private boughtBallsSource$ = new BehaviorSubject(this.backetBoughtBalls);
  boughtBalls = this.boughtBallsSource$.asObservable();
  gamersTickets: Gamer[] = [];
  private gamersTicketsSource$ = new BehaviorSubject(this.gamersTickets);
  gamersTicketsOfGame = this.gamersTicketsSource$.asObservable();

  constructor() { }

  buyBall(numberBall: number) {
    this.balls = this.balls.filter((i) => i !== numberBall);
    this.addBallToBacket(numberBall);
    return this.ballsSource$.next(this.balls);
  }

  returnBall(numberBall: number) {
    this.balls.push(numberBall);
    this.balls.sort();
    return this.ballsSource$.next(this.balls);
  }

  returnBallFromBacket(numberBall: number) {
    this.backetBoughtBalls = this.backetBoughtBalls.filter(
      (i) => i !== numberBall
    );
    this.returnBall(numberBall);
    return this.boughtBallsSource$.next(this.backetBoughtBalls);
  }

  addBallToBacket(numberBall: number) {
    if (!this.backetBoughtBalls.includes(numberBall)) {
      this.backetBoughtBalls.push(numberBall);
      this.backetBoughtBalls.sort();
      return this.boughtBallsSource$.next(this.backetBoughtBalls);
    }

  }

  setFreeTickets(tickets: string[]) {
    this.balls = [];
    tickets.filter((ticket, ind, arr) => {
      if (ticket === '0x0000000000000000000000000000000000000000') {
        this.balls.push(ind);
      }
    });
    return this.ballsSource$.next(this.balls);
  }

  getStatisticGame(tickets: string[]) {
    this.gamersTickets = [];
    tickets.filter((address, ind, arr) => {
      if (address !== '0x0000000000000000000000000000000000000000') {
        const gamer: Gamer = { addressGamer: address, numberTicket: ind };
        this.gamersTickets.push(gamer);
      }
    });
    return this.gamersTicketsSource$.next(this.gamersTickets);
  }
}
