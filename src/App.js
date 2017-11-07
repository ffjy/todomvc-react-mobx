import React, { Component } from 'react';
import todosStore from './store/todos';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { observable, extendObservable } from 'mobx';
import DevTools from 'mobx-react-devtools';

@observer
class Header extends Component {
  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <input className="new-todo" placeholder="What needs to be done?" autoFocus />
      </header>
    )
  }
}

@observer
class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <span className="todo-count"><strong>0</strong> item left</span>
        <ul className="filters">
          <li>
            <a className="selected" href="#/">All</a>
          </li>
          <li>
            <a href="#/active">Active</a>
          </li>
          <li>
            <a href="#/completed">Completed</a>
          </li>
        </ul>
        <button className="clear-completed">Clear completed</button>
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
    const { todo, index } = this.props;
    this.index = index;
    extendObservable(this, {
      ...todo,
    });
  }
  editTodo() {
    this.editing = true;
    this.titleCache = this.title;
    this.refs.inputTodo.focus();
  }
  doneEdit(title) {
    this.title = title;
    this.editing = false;
  }
  cancelEdit() {
    if (this.title !== this.titleCache) {
      this.title = this.titleCache;
    }
  }
  toggleChecked(e) {
    this.completed = !this.completed
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
    return (
      <li className={classnames({ 'completed': this.completed, 'editing': this.editing })}>
        <div className="view">
          <input className="toggle" type="checkbox" checked={this.completed} onChange={this.toggleChecked.bind(this)} />
          <label onDoubleClick={this.editTodo.bind(this)}>{this.title}</label>
          <button className="destroy" onClick={this.removeTodo.bind(this)}></button>
        </div>
        <input 
          ref="inputTodo" 
          onKeyUp={this.handleKeyUp.bind(this)}
          onBlur={this.handleBlur.bind(this)} 
          className="edit" 
          defaultValue={this.title} />
      </li>
    )
  }
}

@observer
class App extends Component {
  componentWillUnmount() {
    
  }
  render() {
    return (
      <div className="App todoapp">
        <Header />
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <Todos todos={todosStore.todos}/>
        </section>
        <Footer />
        <DevTools />
      </div>
    );
  }
}

export default App;
