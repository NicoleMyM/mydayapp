import { Component, OnInit, computed, signal, effect, inject, Injector } from '@angular/core';
import { RouterLinkWithHref, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {Task} from './../../models/task.model';
import { HeaderComponent } from "../../domains/shared/header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  tasks = signal<Task[]>([]);
  injector = inject(Injector);

  filter = signal<'all' | 'pending' | 'completed'>('all');

  constructor(private route: ActivatedRoute) { 
    this.route.url.subscribe(url => {
      const path = url[0]?.path;
  
      if (path === 'all' || path === 'pending' || path === 'completed') {
        this.filter.set(path); 
      } else {
        this.filter.set('all'); 
      }
    });
  }

  //Computed calcula nuevos estados y genera una nueva señal a partir de ese estado
  taskByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks() ?? [];
    
    if (filter === 'pending') {
      const pendingTasks = tasks.filter(task => !task.completed);
      return pendingTasks;
    }
    
    if (filter === 'completed') {
      const completedTasks = tasks.filter(task => task.completed);
      return completedTasks;
    }
    return tasks;
  });
  

  newTaskCtrl = new FormControl('',{
    nonNullable: true,
    
    validators: [
      Validators.required,
    ]
  });

  ngOnInit(): void {
    const storage = localStorage.getItem('mydayapp-angular');
    if(storage){
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTask();
  }

  trackTask(){
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('mydayapp-angular', JSON.stringify(tasks));
    }, {
      injector: this.injector
    })
  }

  addTask(title: string){
    const newTask = {
      id: Date.now(),
      title,
      completed: false
    };

    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number){
    this.tasks.update((tasks) => tasks.filter((task, position) => position !== index));
  }

  updateTask(index: number){
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if(position === index) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    })
  }

  updateTaskEditingMode(index: number){
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if(position === index) {
          return {
            ...task,
            editing: true
          }
        }
        return {
          ...task,
          editing: false
        }
      })
    })
  }

  updateTaskText(index: number, event: Event){
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if(position === index) {
          return {
            ...task,
            title: value,
            editing: false
          }
        }
        return task;
      })
    })
  }

  changeFilter(filter: 'all' | 'pending' | 'completed'){
    this.filter.set(filter);
  }

  hasCompletedTasks(): boolean {
    return (this.taskByFilter() ?? []).some(task => task.completed);
  }

  clearCompletedTasks(){
    const updatedTasks = this.taskByFilter().filter(task => !task.completed);
    this.tasks.set(updatedTasks);
  }
}
