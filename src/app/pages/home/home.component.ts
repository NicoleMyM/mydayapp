import { Component, OnInit } from '@angular/core';

import {Task} from './../../models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  //tasks = signal<Task[]>([]);

  constructor() { }

  ngOnInit(): void {
  }

}
