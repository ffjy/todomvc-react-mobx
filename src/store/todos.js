import { observable, action } from 'mobx';
import { uuid } from '../utils';
class Todos {
  @observable 
  todos = [
    {
      id: uuid(),
      completed: false,
      title: '21:00开始测试',
    },
    {
      id: uuid(),
      completed: true,
      title: '知道了'
    }
  ];

  @action 
  toggleComplete(index) {
    const completed = !this.todos[index].completed;
    this.todos = [
      ...this.todos.slice(0, index),
      {
        ...this.todos[index],
        completed
      },
      ...this.todos.slice(index + 1)
    ]
  }

  @action 
  removeTodo(index) {
    this.todos.splice(index, 1);
  }
}

export default new Todos();