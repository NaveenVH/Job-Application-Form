import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
import { DatabaseService } from '../services/database.service';
import { countries } from '../services/Countries';
import { Country } from '../services/Country';
import { codes } from '../services/Codes';
import { CountryCodes } from '../services/CountryCodes';
import { ValidateFile } from './ValidateFile';
import { jobsList, jobLocations, infoSource } from '../services/JobDetails';

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
  public countries: Country[];
  public states!: string[];
  public jobsList!: string[];
  public jobLocations!: string[];
  public infoSource!: string[];
  public codes: CountryCodes[];
  public validFileSelected = false;
  filesSelected = false;
  private resp: any;
  private alphabeticPattern = "^[ a-zA-Z][a-zA-Z ]*$";
  private numericPattern = "^[0-9]*$";

  constructor(private formBuilder: FormBuilder, private http: HttpClient,
    private storageService: StorageService,
    private databaseService: DatabaseService) {
    this.countries = countries;
    this.codes = codes;
    this.jobsList = jobsList;
    this.jobLocations = jobLocations;
    this.infoSource = infoSource;
  }

  ngOnInit(): void {
    this.applicationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(this.alphabeticPattern)]],
      lastName: ['', [Validators.required, Validators.pattern(this.alphabeticPattern)]],
      jobTitle: ['', Validators.required],
      experience: ['', [Validators.required, Validators.pattern(this.numericPattern)]],
      location: ['', Validators.required],
      infoSource: ['', Validators.required],
      noticePeriod: ['', [Validators.required, Validators.pattern(this.numericPattern)]],
      countryCode: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(this.numericPattern)]],
      email: ['', [Validators.required, Validators.email]],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: new FormControl({ value: '', disabled: true }, Validators.required),
      country: ['', Validators.required],
      zip: ['', [Validators.required, Validators.minLength(5)]],
      imageInput: ['', [Validators.required, ValidateFile]],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  public get f() { return this.applicationForm.controls; }

  public minLengthValidator(fc: any): boolean {
    return fc.minlength.actualLength < fc.minlength.requiredLength;
  }

  public countrySelect(event: any) {
    if (event.value) {
      this.states = this.countries.find(country => country.country === event.value)?.states!;
      this.applicationForm.controls.state.enable();
    }
  }

  onFileChange(files: any): void {
    const data = new FormData();
    this.file = files.target.files[0];
    if (this.file.size > 2097152) {
      this.validFileSelected = false;
      alert("File format should not exceed 2MB");
    } else {
      if (this.applicationForm.controls.imageInput.status === "VALID") {
        this.validFileSelected = true;
        data.append('file', this.file);
        // this.http.post('http://localhost:7071/api/FileProcessFunction', data).subscribe(
        //   (response) => {
        //     console.log(response);
        //   },
        //   (error) => console.log(error)
        // )

        this.storageService.UploadFile(this.file).subscribe(
          (response) => {
            this.resp = response;
            this.resumeUrl = this.resp.resumeUrl;
            console.log(this.resumeUrl);
          },
          (error) => console.log(error)
        )
      }
    }
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


    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(body, null, 4));
    // this.http.post('http://localhost:7071/api/CosmosDBFunction', JSON.stringify(body)).subscribe(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (error) => console.log(error)
    // )

    this.databaseService.SaveToDatabase(this.applicationForm.value, this.resumeUrl).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

  public getValidationMessage(errors: any): string {
    if (errors.required) {
      return "Value is Required";
    } else if (errors.pattern) {
      if (errors.pattern.requiredPattern === this.alphabeticPattern) {
        return "Value should be Alphabetic";
      } else if (errors.pattern.requiredPattern === this.numericPattern) {
        return "Value should be Numeric";
      }
    } else if (errors.minlength) {
      return "Value should be atleast " + errors.minlength.requiredLength + " characters"
    }
    return "";
  }

  public hasErrors(errors: any) {
    return errors && errors.length > 0;
  }
}
