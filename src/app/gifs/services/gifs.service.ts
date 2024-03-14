import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = [];

  private apiKey: string = 'hjnN3mfbLDGEYlksNVElpGeHktoWheou'
  private _tagHistory: string[] = [];
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'

constructor( private http: HttpClient) {
  this.loadLocalStorage();
 }


get tagHistory() {
  return [...this._tagHistory]
}

private organizedHistory(tag: string) {

  tag = tag.toLowerCase();
  if (this._tagHistory.includes(tag)) {
    this._tagHistory = this._tagHistory.filter((oldTag) => oldTag !== tag)
  }

  this._tagHistory.unshift(tag)
  this._tagHistory = this._tagHistory.splice(0,10);
  this.saveLocalStorage();
}

private saveLocalStorage():void {
  localStorage.setItem('History', JSON.stringify(this._tagHistory))
}

private loadLocalStorage():void {
  if( !localStorage.getItem('History')) return;
  this._tagHistory = JSON.parse(localStorage.getItem('History')!)

  if (this._tagHistory.length === 0) return;
  this.searchTag(this._tagHistory[0])

}

public searchTag( tag: string): void {
  if (tag.length === 0) return
  this.organizedHistory(tag)

  const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag)


  this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
    .subscribe(resp => {

      this.gifList = resp.data
    })


}

}
