import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  public SaveToDatabase(formValues: any, resumeUrl: string): Observable<any> {
    const body = {
      id: this.getUniqueField(formValues),
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      jobTitle: formValues.jobTitle,
      experience: formValues.experience,
      location: formValues.location,
      infoSource: formValues.infoSource,
      noticePeriod: formValues.noticePeriod,
      contactDetails: {
        email: formValues.email,
        phone: this.getPhoneNumber(formValues)
      },
      address: {
        addressLine1: formValues.address1,
        addressLine2: formValues.address2,
        city: formValues.city,
        state: formValues.state,
        country: formValues.country,
        zip: formValues.zip
      },
      resume:resumeUrl,
      applicationStatus: "submitted"
    };
    return this.http.post('https://jobapplicationdb.azurewebsites.net/api/CosmosDBFunction?code=OpBFnaNB5uFsjeWYlzJvHjhsfgn7y39E7mJCIKhjW17jLfc6RyIi9Q==', JSON.stringify(body));
  }

  private getUniqueField(formValues: any) {
    return formValues.jobTitle + '_' +
      formValues.firstName + '_' +
      formValues.lastName + '_' +
      formValues.email;
  }

  private getPhoneNumber(formValues: any) {
    return formValues.countryCode +
      formValues.phoneNumber;
  }
}
