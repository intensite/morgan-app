import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'pyro',
  templateUrl: './pyro.component.html',
  styleUrls: ['./pyro.component.css']
})
export class PyroComponent implements OnInit {
  testButtons = [true, false, true, false];

  constructor() { }

  ngOnInit(): void {
  }

}
