import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<
    HTMLInputElement
  >;
  public applicationForm!: FormGroup;
  public submitted = false;
  public file!: File;
  public resumeUrl!: string;
  filesSelected = false;
  private resp: any;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.applicationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      experience: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      location: ['', Validators.required],
      infoSource: ['', Validators.required],
      noticePeriod: ['', Validators.required],
      countryCode: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      email: ['', [Validators.required, Validators.email]],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', [Validators.required, Validators.minLength(5)]],
      imageInput: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  public get f() { return this.applicationForm.controls; }

  public minLengthValidator(fc: any): boolean {
    return fc.minlength.actualLength < fc.minlength.requiredLength;
  }

  onFileChange(files: any): void {
    const data = new FormData();
    this.file = files.target.files[0];
    data.append('file', this.file);
    // this.http.post('http://localhost:7071/api/FileProcessFunction', data).subscribe(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (error) => console.log(error)
    // )

    this.http.post('https://jobapplicationfunc.azurewebsites.net/api/FileProcessFunction?code=gVb4IvQ1X/TiBnKYxTR7moae0sUm1dHoVqGaCkxc01zoAfoPMPBxWw==', data).subscribe(
      (response) => {
        this.resp = response;
        this.resumeUrl = this.resp.resumeUrl;
        console.log(this.resumeUrl);
      },
      (error) => console.log(error)
    )
  }


  showFileDialog(): void {
    this.fileInput.nativeElement.click();
  }


  public onSubmit() {
    this.submitted = true;
    console.log(this.applicationForm);
    // stop here if form is invalid
    if (this.applicationForm.invalid) {
      return;
    }
    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.applicationForm.value, null, 4));

    const body = {
      id: this.getUniqueField(this.applicationForm.value),
      firstName: this.applicationForm.value.firstName,
      lastName: this.applicationForm.value.lastName,
      jobTitle: this.applicationForm.value.jobTitle,
      experience: this.applicationForm.value.experience,
      location: this.applicationForm.value.location,
      infoSource: this.applicationForm.value.infoSource,
      noticePeriod: this.applicationForm.value.noticePeriod,
      contactDetails: {
        email: this.applicationForm.value.email,
        phone: this.getPhoneNumber(this.applicationForm.value)
      },
      address: {
        addressLine1: this.applicationForm.value.address1,
        addressLine2: this.applicationForm.value.address2,
        city: this.applicationForm.value.city,
        state: this.applicationForm.value.state,
        country: this.applicationForm.value.country,
        zip: this.applicationForm.value.zip
      },
      resume: this.resumeUrl,
      applicationStatus: "submitted"
    };
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(body, null, 4));
    // this.http.post('http://localhost:7071/api/CosmosDBFunction', JSON.stringify(body)).subscribe(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (error) => console.log(error)
    // )

    this.http.post('https://jobapplicationdb.azurewebsites.net/api/CosmosDBFunction?code=OpBFnaNB5uFsjeWYlzJvHjhsfgn7y39E7mJCIKhjW17jLfc6RyIi9Q==', JSON.stringify(body)).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => console.log(error)
    )
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
