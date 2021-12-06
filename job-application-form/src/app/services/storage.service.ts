import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http: HttpClient) { }

  public UploadFile(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    return this.http.post('https://jobapplicationfunc.azurewebsites.net/api/FileProcessFunction?code=gVb4IvQ1X/TiBnKYxTR7moae0sUm1dHoVqGaCkxc01zoAfoPMPBxWw==', data);
  }
}
