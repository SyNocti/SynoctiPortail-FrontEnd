import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgxIntlTelInputModule, SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-creation-client',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule
  ],
  templateUrl: './creation-client.component.html',
  styleUrls: ['./creation-client.component.css']
})
export class CreationClientComponent implements OnInit {

  registerUsername = '';
  registerEmail = '';
  registerPassword = '';
  registerPasswordConfirm = '';

  clientForm: FormGroup;

  // ngx-intl-tel-input config
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Canada, CountryISO.UnitedStates];

  constructor(
    public userService: UserService,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.clientForm = this.fb.group({
      phone: ['', [Validators.required]]
    });
  }

  ngOnInit(): void { }

  async register(): Promise<void> {
    const phoneNumber = this.clientForm.value.phone?.internationalNumber || '';

    await this.userService.register(
      this.registerUsername,
      this.registerEmail,
      phoneNumber,
      this.registerPassword,
      this.registerPasswordConfirm
    );

    this.registerUsername = '';
    this.registerEmail = '';
    this.clientForm.reset();
    this.registerPassword = '';
    this.registerPasswordConfirm = '';
  }
}
