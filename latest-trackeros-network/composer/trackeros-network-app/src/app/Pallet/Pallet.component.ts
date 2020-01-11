/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PalletService } from './Pallet.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-pallet',
  templateUrl: './Pallet.component.html',
  styleUrls: ['./Pallet.component.css'],
  providers: [PalletService]
})
export class PalletComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  palletId = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  holder = new FormControl('', Validators.required);
  lat = new FormControl('', Validators.required);
  lng = new FormControl('', Validators.required);
  loc = new FormControl('', Validators.required);

  constructor(public servicePallet: PalletService, fb: FormBuilder) {
    this.myForm = fb.group({
      palletId: this.palletId,
      owner: this.owner,
      holder: this.holder,
      lat: this.lat,
      lng: this.lng,
      loc: this.loc
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicePallet.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.trackerosnetwork.Pallet',
      'palletId': this.palletId.value,
      'owner': this.owner.value,
      'holder': this.holder.value,
      'lat': this.lat.value,
      'lng': this.lng.value,
      'loc': this.loc.value
    };

    this.myForm.setValue({
      'palletId': null,
      'owner': null,
      'holder': null,
      'lat': null,
      'lng': null,
      'loc': null
    });

    return this.servicePallet.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'palletId': null,
        'owner': null,
        'holder': null,
        'lat': null,
        'lng': null,
        'loc': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.trackerosnetwork.Pallet',
      'owner': this.owner.value,
      'holder': this.holder.value,
      'lat': this.lat.value,
      'lng': this.lng.value,
      'loc': this.loc.value
    };

    return this.servicePallet.updateAsset(form.get('palletId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.servicePallet.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.servicePallet.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'palletId': null,
        'owner': null,
        'holder': null,
        'lat': null,
        'lng': null,
        'loc': null
      };

      if (result.palletId) {
        formObject.palletId = result.palletId;
      } else {
        formObject.palletId = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      if (result.holder) {
        formObject.holder = result.holder;
      } else {
        formObject.holder = null;
      }

      if (result.lat) {
        formObject.lat = result.lat;
      } else {
        formObject.lat = null;
      }

      if (result.lng) {
        formObject.lng = result.lng;
      } else {
        formObject.lng = null;
      }

      if (result.loc) {
        formObject.loc = result.loc;
      } else {
        formObject.loc = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'palletId': null,
      'owner': null,
      'holder': null,
      'lat': null,
      'lng': null,
      'loc': null
      });
  }

}
