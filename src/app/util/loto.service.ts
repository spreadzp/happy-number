import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class LotoService {
  balls = [1, 2, 3, 4, 5, 8, 56, 78, 84, 94, 97, 98];
  private ballsSource$ = new BehaviorSubject(this.balls);
  activeBalls = this.ballsSource$.asObservable();
  backetBoughtBalls = [];
  private boughtBallsSource$ = new BehaviorSubject(this.backetBoughtBalls);
  boughtBalls = this.boughtBallsSource$.asObservable();
  constructor() {}
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
    this.backetBoughtBalls.push(numberBall);
    this.backetBoughtBalls.sort();
    return this.boughtBallsSource$.next(this.backetBoughtBalls);
  }
  setFreeTickets(tickets: string[]) {
    this.balls = [];
    tickets.map((address, ind, arr) => {
      // console.log('1ind :>> ', ind);
      if (address === '0x0000000000000000000000000000000000000000') {
        // console.log('2ind ', ind, ':', arr[ind]);
        this.balls.push(ind + 1);

      }
    });
    return this.ballsSource$.next(this.balls);
  }
}
