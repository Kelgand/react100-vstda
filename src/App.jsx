import React, { Component } from 'react';

class App extends Component {
  constructor(){
    super();
    this.state = {
      currentKey: 0,
      todos: [{
        priority: "0" , 
        description: "", 
        key: 0, 
        isDone: false, 
        isEditing: false
      }]
    }

    this.DeleteTodo = this.DeleteTodo.bind(this);
    this.MarkForEditing = this.MarkForEditing.bind(this);
    this.SaveTodo = this.SaveTodo.bind(this);
  }

  SaveTodo(key){
    let priority = document.getElementById("todoPriority" + key).value;

    if(priority === "0"){
      return;
    }

    let description = document.getElementById("todoDescription" + key).value;
    
    let todos = this.state.todos.map(todo => {
      if(todo.key === key){        
        todo.priority = priority;
        todo.description = description;
        todo.isEditing = false;
      }
      return todo;
    });
    
    let currentKey = this.state.currentKey;
    
    if(key === currentKey){
      currentKey++;
      todos.push({
        priority: "0" , 
        description: "", 
        key: currentKey, 
        isDone: false, 
        isEditing: false
      })
      document.getElementById("todoDescription" + key).value = "";
      document.getElementById("todoPriority" + key).value = "0";
    }
    
    this.setState({
      todos: todos,
      currentKey: currentKey
    })
    
    //console.log(this.state);
  }

  DeleteTodo(key){
    let todos = this.state.todos.filter(todo => {
      return todo.key !== key;
    })

    this.setState({
      todos: todos
    })
  }

  SortTodo(){
    let todos = this.state.todos.slice(0, this.state.todos.length - 1).sort((a, b) => {
      if(a.priority < b.priority){
        return -1;
      } else if (a.priority > b.priority){
        return 1;
      } else {
        return 0;
      }
    })

    this.setState({
      todos: todos.concat(this.state.todos[todos.length])
    })
  }
  
  MarkForEditing(key){
    let todos = this.state.todos.map(todo => {
      if(todo.key === key){
        todo.isEditing = true;
      }
      return todo;
    });
    
    this.setState({
      todos: todos
    });
  }
  

  render() {
    return (
      <div className='mainContainer'>
        <Header />
        <div className="mainFlexContainer">
          <AddNew todo={this.state.todos[this.state.todos.length-1]} sort={() => this.SortTodo()} onClick={() => this.SaveTodo(this.state.currentKey)}/>
          <ViewTodos todos={this.state.todos.slice(0, this.state.todos.length-1)} edit={this.MarkForEditing} delete={this.DeleteTodo} save={this.SaveTodo} />
        </div>
      </div>
    );
  }
}

class Header extends React.Component{
  render(){
    return (
      <div>
        <h2>
          Very Simple Todo App
        </h2>
        <h3>
          Track all of the things
        </h3>
        <hr />
      </div>
    )
  }
}

class AddNew extends React.Component{
  render(){
    return (
      <div className="column addNew">
        <div className="columnHeader">
          Add New Todo
        </div>
        <div className="columnBody">
          <p className="label">I want to...</p>
          <textarea id={"todoDescription" + this.props.todo.key} className="create-todo-text"></textarea><br />
          <p className="label">How much of a priority is this?</p>
          <select id={"todoPriority" + this.props.todo.key} className="create-todo-priority">
            <option value="0">Select a Priority</option>
            <option value="1">Low Priority</option>
            <option value="2">Medium Priority</option>
            <option value="3">High Priority</option>
          </select>
        </div>
        <div className="columnFooter">
            <button className="create-todo" onClick={this.props.onClick}>Add</button>
            <button className="sort" onClick={this.props.sort}>Sort Existing</button>
        </div>
      </div>
    )
  }
}

class ViewTodos extends React.Component{

  render(){
    return(
      <div className="column todos">
        <div className="columnHeader">
          View Todos
        </div>
        <div className="columnBody">
          <Todos todos={this.props.todos} edit={this.props.edit} delete={this.props.delete} save={this.props.save} />
        </div>
      </div>
    )
  }
}

class Todos extends React.Component{
  render(){
    if(this.props.todos.length === 0){
      return (
        <div className="welcome">
          <div className="bold">
            Welcome to Very Simple Todo App!
          </div>
          <div>
            Get started now by adding a todo on the left.
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <ul>
          {
            this.props.todos.map(todo => {
              return <Todo key={todo.key} data={todo} edit={() => this.props.edit(todo.key)} delete={() => this.props.delete(todo.key)} save={() => this.props.save(todo.key)} />
            })
          }
          </ul>
        </div>
      )
    }
  }
}

class Todo extends React.Component{
  render(){
    if(this.props.data.isEditing){
      return (
        <li className={`todo priority${this.props.data.priority}`}>
          <div className="columnBody">
            <p className="label">Description</p>
            <textarea id={"todoDescription" + this.props.data.key} className="update-todo-text create-todo-text" defaultValue={this.props.data.description}></textarea><br />
            <p className="label">Priority?</p>
            <select id={"todoPriority" + this.props.data.key} className="create-todo-priority" defaultValue={this.props.data.priority}>
              <option value="1">Low Priority</option>
              <option value="2">Medium Priority</option>
              <option value="3">High Priority</option>
            </select>
          </div>
          <div className="saveContainer">
            <button className="update-todo" onClick={this.props.save}>Save</button>
          </div>
        </li>
      )
    } else {
      return (
        <li className={`todo success priority${this.props.data.priority}`}>
          <input type="checkbox" defaultChecked={this.props.data.isDone} />
          <span className="label">{this.props.data.description}</span>
          <i className="delete-todo far fa-trash-alt" onClick={this.props.delete}></i>
          <i className="edit-todo fas fa-edit" onClick={this.props.edit}></i>
        </li>
      )
    }
  }
}

class Sort extends React.Component{
  render(){
    return (
      <button onClick={this.props.sort}>Sort</button>
    )
  }
}

export default App;
