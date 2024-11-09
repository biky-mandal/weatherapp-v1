import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApisService {
  private apiUrl: string = 'https://api.weatherapi.com/v1/'; // Replace with your API endpoint
  private key: string = 'f8e32b943e894971bd9171726240611';

  weatherData = new BehaviorSubject([]);
  recentWeatherData = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.fetchRecentSearch();
  }

  fetchRecentSearch() {
    const recentSearchData: string | null =
      localStorage.getItem('recentSearch');

    if (recentSearchData) {
      const parsedData: any = JSON.parse(recentSearchData);

      this.recentWeatherData.next(parsedData);
    } else {
      this.recentWeatherData.next(null);
    }
  }

  addRecentSearch(WeatherData: any) {
    const recentSearchData: string | null =
      localStorage.getItem('recentSearch');
    let newData: any = [];

    if (recentSearchData) {
      const parsedData: any = JSON.parse(recentSearchData);

      if (parsedData.length === 2) {
        newData.push(parsedData[0]);
        newData.unshift(WeatherData);
      } else {
        parsedData.unshift(WeatherData);
        newData = [...parsedData];
      }

      localStorage.setItem('recentSearch', JSON.stringify(newData));
      this.recentWeatherData.next(newData);
    } else {
      newData = [WeatherData];

      localStorage.setItem('recentSearch', JSON.stringify(newData));
      this.recentWeatherData.next(newData);
    }
  }

  fetchSearchedLocations(searchedString: string): Observable<any[]> {
    const url: string = `${this.apiUrl}search.json?key=${this.key}&q=${searchedString}`;
    // return this.http.get<any[]>(url);
    return of([]);
  }

  fetchForcustDetails(location: string): Observable<any[]> {
    const url: string = `${this.apiUrl}forecast.json?key=${this.key}&q=${location}&days=7&aqi=yes&alerts=yes`;
    // return this.http.get<any[]>(url);
    return of([]);
  }
}
