import React, { Component } from 'react';
import TodosStore from './store/todos';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { observable, autorun } from 'mobx';
import { save, get, uuid } from './utils';
import DevTools from 'mobx-react-devtools';

const todosStore = TodosStore.fromJs(get('todo-list') || []);
const disposer = autorun(() => {
  save('todo-list', todosStore.todos);
});

@observer
class Header extends Component {
  handleKeyUp(e) {
    if (e.keyCode === 13) {
      const title = e.target.value.trim();
      e.target.value = '';
      todosStore.addTodo({
        title,
        completed: false,
        id: uuid(),
      });
    }
  }
  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <input onKeyUp={this.handleKeyUp.bind(this)} className="new-todo" placeholder="What needs to be done?" autoFocus />
      </header>
    )
  }
}

@observer
class Footer extends Component {
  renderLink(filter) {
    return (
      <a
        onClick={this.changeLink.bind(this, filter)}
        className={classnames({'selected': todosStore.todoFilter === filter})}
      >{filter}</a>
    )
  }
  changeLink(filter) {
    todosStore.changeFilter(filter)
  }
  clearCompleted() {
    todosStore.clearCompleted();
  }
  render() {
    const links = ['all', 'active', 'completed'];
    return (
      <footer className="footer">
        <span className="todo-count"><strong>{todosStore.leftItems}</strong> item left</span>
        <ul className="filters">
          {links.map((filter, index) => <li key={index}>{this.renderLink(filter)}</li>)}
        </ul>
        <button style={{ display: todosStore.completedNums === 0 ? 'none': '' }} className="clear-completed" onClick={this.clearCompleted.bind(this)}>Clear completed</button>
      </footer>
    )
  }
}

const Todos = observer((props) => {
  return (
    <ul className="todo-list">
      {props.todos && props.todos.map((todo, index) => <Todo index={index} todo={todo} key={todo.id} />)}
    </ul>
  )
});

@observer
class Todo extends Component {
  @observable editing = false;
  componentWillMount() {
    const { index } = this.props;
    this.index = index;
  }
  editTodo() {
    this.editing = true;
    this.titleCache = this.title;
    this.refs.inputTodo.focus();
  }
  doneEdit(title) {
    this.editing = false;
    todosStore.editTodo(this.index, title);
  }
  cancelEdit() {
    if (this.title !== this.titleCache) {
      this.title = this.titleCache;
    }
  }
  toggleChecked(e) {
    todosStore.toggleComplete(this.index);
  }
  removeTodo(e) {
    todosStore.removeTodo(this.index);
  }
  handleKeyUp(e) {
    if (e.keyCode === 27) {
      this.cancelEdit();
    }
    if (e.keyCode === 13) {
      const title = e.target.value.trim();
      this.doneEdit(title);
    }
  }
  handleBlur(e) {
    const title = e.target.value.trim();
    this.doneEdit(title);
  }
  render() {
    const { todo } = this.props;
    return (
      <li className={classnames({ 'completed': todo.completed, 'editing': this.editing })}>
        <div className="view">
          <input className="toggle" type="checkbox" checked={todo.completed} onChange={this.toggleChecked.bind(this)} />
          <label onDoubleClick={this.editTodo.bind(this)}>{todo.title}</label>
          <button className="destroy" onClick={this.removeTodo.bind(this)}></button>
        </div>
        <input 
          ref="inputTodo" 
          onKeyUp={this.handleKeyUp.bind(this)}
          onBlur={this.handleBlur.bind(this)} 
          className="edit" 
          defaultValue={todo.title} />
      </li>
    )
  }
}

@observer
class App extends Component {
  componentWillUnmount() {
    disposer();
  }
  handleToggle(e) {
    const toggle = e.target.checked;
    todosStore.toggleTodos(toggle);
  }
  render() {
    return (
      <div className="App">
        <div className="todoapp">
          <Header />
          <section className="main">
            <input id="toggle-all" className="toggle-all" type="checkbox" onChange={this.handleToggle.bind(this)}/>
            <label htmlFor="toggle-all">Mark all as complete</label>
            <Todos todos={todosStore.todoList}/>
          </section>
          <Footer />
          <DevTools />
        </div>
        <footer className="info">
          <p>Double-click to edit a todo</p>
          <p>Created by maczyt</p>
          <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
      </div>
    );
  }
}

export default App;
