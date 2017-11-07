import { observable, action, computed } from 'mobx';

class Todos {
  @observable 
  todos = [];

  @observable
  todoFilter = 'all';

  @computed get activedTodos() {
    return this.todos.filter(todo => !todo.completed);
  }
  @computed get completedTodos() {
    return this.todos.filter(todo => todo.completed);
  }
  @computed get completedNums() {
    return this.completedTodos.length;
  }
  @computed get leftItems() {
    return this.activedTodos.length;
  }

  @computed get todoList() {
    switch (this.todoFilter) {
      case 'active':
        return this.activedTodos;
      case 'completed':
        return this.completedTodos;
      case 'all':
      default:
        return this.todos;
    }
  }

  @action
  changeFilter(filter) {
    this.todoFilter = filter;
  }

  @action 
  toggleComplete(index) {
    this.todos[index].completed = !this.todos[index].completed;
  }

  @action
  addTodo(todo) {
    this.todos.unshift(todo);
  }
  @action 
  removeTodo(index) {
    this.todos.splice(index, 1);
  }
  @action
  editTodo(index, title) {
    this.todos[index].title = title;
  }

  @action
  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.completed);
  }
  @action toggleTodos(toggle) {
    this.todos = this.todos.map(todo => ({
      ...todo,
      completed: toggle,
    }));
  }

  static fromJs(array = []) {
    const todos = new Todos();
    todos.todos = array;
    return todos;
  }
}

export default Todos;