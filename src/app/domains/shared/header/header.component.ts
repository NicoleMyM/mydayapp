import { Component, EventEmitter, Output, signal } from '@angular/core';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {Task} from './../../../models/task.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  //initialization
  @Output() addTaskEvent = new EventEmitter<string>();
  tasks = signal<Task[]>([]);

  //constructor


  //life cycle



  //method
  newTaskCtrl = new FormControl('',{
    nonNullable: true,
    
    validators: [
      Validators.required,
    ]
  });

  changeHandler(){
    if(this.newTaskCtrl.valid){
      const value = this.newTaskCtrl.value.trim();
      if(value !== ''){
        this.addTaskEvent.emit(value);
      this.newTaskCtrl.setValue('');
      }
    }
  }

  //private method

}
