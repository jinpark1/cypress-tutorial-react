import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import Footer from './Footer'
import { saveTodo, loadTodos, destroyTodo, updateTodo } from '../lib/service';
import { filteredTodos } from '../lib/utils'
// import { spawn, spawnSync } from 'child_process';


export default class TodoApp extends Component {
  constructor() {
    super()

    this.state = {
      currentTodo: '',
      todos: []
    }
    this.handleNewTodoChange = this.handleNewTodoChange.bind(this)
    this.handleTodoSubmit = this.handleTodoSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentDidMount(){
    loadTodos().then(({data}) => {
      console.dir(data)
      this.setState({todos: data})
    }).catch(this.setState({error: true}))
  }

  handleNewTodoChange(evt){
    this.setState({currentTodo: evt.target.value})
  }

  handleToggle(id){
    const targetTodo = this.state.todos.find(e => e.id === id)
    const updated = {
      ...targetTodo,
      isComplete: !targetTodo.isComplete
    }
    updateTodo(updated)
    .then(({data}) => {
      // console.log('data', data, this.state.todos)
      // debugger
      const targetIndex = this.state.todos.findIndex(e => e.id === data.id)
     const todos = this.state.todos.map(e => e.id === data.id ? data : e)
      console.log(todos)
      this.setState({
        todos: todos
      })
    })
  }

  handleTodoSubmit(evt){
    evt.preventDefault()
    const newTodo = {name: this.state.currentTodo, isComplete: false}
    setTimeout(() => {

      saveTodo(newTodo)
        .then(({data}) => this.setState({
          todos: this.state.todos.concat(data),
          currentTodo: '',
          error: false
        })).catch(() => {
          console.log('uh oh')
          this.setState({error: true})})
    }, 4500)
  }

  handleDelete(id){
    destroyTodo(id)
    .then(() => this.setState({
      todos: this.state.todos.filter(e => e.id !== id)
    }))
  }

  render () {
    // console.log('render', this.state)
    const remaining = this.state.todos.filter(e => !e.isComplete).length
    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error ? <span className='error'>Oh no!</span> : null}
            <TodoForm currentTodo={this.state.currentTodo} handleNewTodoChange={this.handleNewTodoChange} handleTodoSubmit={this.handleTodoSubmit} />
          </header>
          <section className="main">
          <Route path='/:filter?' render={({match}) => 
            <TodoList 
            todos={filteredTodos(match.params.filter, this.state.todos)} 
            handleDelete={this.handleDelete} 
            handleToggle={this.handleToggle}/>} />
          </section>
          <Footer remaining={remaining}/>
        </div>
      </Router>
    )
  }
}
