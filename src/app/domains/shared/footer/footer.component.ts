import { Component, computed, Input, EventEmitter, Output } from '@angular/core';
import { RouterLinkWithHref, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLinkWithHref, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  //initialization
  @Input() tasks: { id: number; title: string; completed: boolean }[] = [];
  @Input() filter!: 'all' | 'pending' | 'completed';

  // Output to notify parent component when filter changes
  @Output() filterChange: EventEmitter<'all' | 'pending' | 'completed'> = new EventEmitter();
  // Output to notify parent when tasks are cleared
  @Output() tasksUpdated: EventEmitter<{ id: number; title: string; completed: boolean }[]> = new EventEmitter();


  taskByFilter = computed(() => {
    if (this.filter === 'pending') return this.tasks.filter(task => !task.completed);
    if (this.filter === 'completed') return this.tasks.filter(task => task.completed);
    return this.tasks;
  });

  //method
  //method to emit filter change
  onFilterChange(newFilter: 'all' | 'pending' | 'completed') {
    this.filterChange.emit(newFilter);  // Emit the new filter to parent
  }

  //check if there are any completed tasks
  hasCompletedTasks(): boolean {
    return (this.taskByFilter() ?? []).some(task => task.completed);
  }

  //clear completed tasks and notify parent
  clearCompletedTasks() {
    this.tasks = this.tasks.filter(task => !task.completed);  // Remove completed tasks
    this.tasksUpdated.emit(this.tasks);  // Emit updated tasks to parent
  }
}
