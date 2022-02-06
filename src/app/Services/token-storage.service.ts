import { Injectable } from '@angular/core';
import { Homestay } from '../models/homestay.model';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const LIST_KEY = 'homstay-list';
const DATE_KEY = 'search-date';
const REPORT_KEY = 'report-map';
const BILL_KEY = 'bill-map';
const FILTER_KEY = 'list-filter';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }


  public saveDates(data: any): void{
    window.sessionStorage.removeItem(DATE_KEY);
    window.sessionStorage.setItem(DATE_KEY, JSON.stringify(data));
  }
  public getDates(): any{
    const dates = window.sessionStorage.getItem(DATE_KEY);
    if (dates) {
      return JSON.parse(dates);
    }
    return {};
  }
  public clearTokens(): void{
    window.sessionStorage.removeItem(LIST_KEY);
    window.sessionStorage.removeItem(DATE_KEY);
    window.sessionStorage.removeItem(FILTER_KEY);
    window.sessionStorage.removeItem('is-clicked');
    window.sessionStorage.removeItem('search-key');
  }

  public saveHomestays(homestays: Homestay[]): void {
    window.sessionStorage.removeItem(LIST_KEY);
    window.sessionStorage.setItem(LIST_KEY, JSON.stringify(homestays));
  }
  public getHomestays(): Homestay[] {
    let list: Homestay[] = [];
    const homestays = window.sessionStorage.getItem(LIST_KEY);
    if (homestays) {
      list = JSON.parse(homestays);
    }

    return list;
  }

  public saveHomestaysToFilter(homestays: Homestay[]): void {
    window.sessionStorage.removeItem(FILTER_KEY);
    window.sessionStorage.setItem(FILTER_KEY, JSON.stringify(homestays));
  }
  public getHomestaysToFilter(): Homestay[] {
    let list: Homestay[] = [];
    const homestays = window.sessionStorage.getItem(FILTER_KEY);
    if (homestays) {
      list = JSON.parse(homestays);
    }

    return list;
  }

  public setReportMap(map: Map<string, number>): void {
    window.sessionStorage.removeItem(REPORT_KEY);
    window.sessionStorage.setItem(REPORT_KEY, JSON.stringify(map));
  }
  public getReportMap(): any {
    let list: Map<string, number> = new Map();
    const map = window.sessionStorage.getItem(REPORT_KEY);
    if (map) {
      list = JSON.parse(map);
    }

    return list;
  }

  public setBillMap(map: Map<string, number>): void {
    window.sessionStorage.removeItem(BILL_KEY);
    window.sessionStorage.setItem(BILL_KEY, JSON.stringify(map));
  }
  public getBillMap(): any {
    let list: Map<string, number> = new Map();
    const map = window.sessionStorage.getItem(BILL_KEY);
    if (map) {
      list = JSON.parse(map);
    }

    return list;
  }
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public getSearchKey(): string | null {
    return window.sessionStorage.getItem("search-key");
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}
