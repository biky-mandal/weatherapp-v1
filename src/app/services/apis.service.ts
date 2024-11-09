import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApisService {
  private apiUrl: string = 'https://api.weatherapi.com/v1/'; // Replace with your API endpoint
  private key: string = 'f8e32b943e894971bd9171726240611';

  // All are Behavior Object
  // Any change in this objects will all components that subscribed to it will get notification and data
  weatherData = new BehaviorSubject([]); // Weather data for subscribed component
  recentWeatherData = new BehaviorSubject(null); // Recently searched Weather data for subscribed component
  waiting = new BehaviorSubject(false); // For Loading Screen
  isDay = new BehaviorSubject(false); // To Change theme based on Mode Day or night

  constructor(private http: HttpClient) {
    this.fetchRecentSearch();
  }

  // This function is to fetch recent searched location data from LS.
  fetchRecentSearch() {
    const recentSearchData: string | null =
      localStorage.getItem('recentSearch');

    if (recentSearchData) {
      const parsedData: any = JSON.parse(recentSearchData);

      this.recentWeatherData.next(parsedData); // Publishing data through behavioural object
    } else {
      this.recentWeatherData.next(null);
    }
  }

  //  To Add Data to Recent searched List
  addRecentSearch(WeatherData: any) {
    const recentSearchData: string | null =
      localStorage.getItem('recentSearch');
    let newData: any = [];

    // If there is already data in recent searched
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
      // This is the first time we are going to enter data to recent list
      newData = [WeatherData];

      localStorage.setItem('recentSearch', JSON.stringify(newData));
      this.recentWeatherData.next(newData);
    }
  }

  // API call to fetch search locations
  fetchSearchedLocations(searchedString: string): Observable<any[]> {
    const url: string = `${this.apiUrl}search.json?key=${this.key}&q=${searchedString}`;
    return this.http.get<any[]>(url);
  }

  // To Fetch forcast data using Location
  fetchForcustDetails(location: string): Observable<any[]> {
    const url: string = `${this.apiUrl}forecast.json?key=${this.key}&q=${location}&days=7&aqi=yes&alerts=yes`;
    return this.http.get<any[]>(url);
  }
}
