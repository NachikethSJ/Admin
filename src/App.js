
import React, { useState, useEffect, useContext } from 'react';
import { ApplicationSessionContext } from '../src/Context/ApplicationSessionContext';
import './App.css';

function App(props) {
  //API calling example using useEffect

  const { userName, setRoute } = useContext(ApplicationSessionContext);
  const [todo, setTodo] = useState([]);

  useEffect(() => {
    props.history.push('/home/');

    console.log('Session name is', userName);
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => setTodo(data))
  }, []);




  // const [todo, setTodo] = useState([
  //   {
  //     text: 'Hello react js',
  //     isCompleted: false
  //   },
  //   {
  //     text: 'I just wanna master you boy!',
  //     isCompleted: false
  //   },
  //   {
  //     text: 'Let me just do it!',
  //     isCompleted: false
  //   },

  // ]);


  function TodoForm({ addTodo }) {
    const [value, setValue] = useState('');

    const handleSubmit = e => {
      // e.preventDefalut();
      if (!value) return;
      addTodo(value);
      setValue('');
    }

    const navigateHome = () => {
      setRoute('home');
      props.history.push('/home/');
    }
  


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button onClick={navigateHome}>
          Go to Home
        </button>
        <input
          type='text'
          className='input'
          value={value}
          placeholder='Add Todo'
          onChange={e => setValue(e.target.value)} />
      </form>

    </div >
  )
}

const addTodo = title => {
  const newTodos = [...todo, { title }];
  setTodo(newTodos);
}

function TodoList({ index, todo, completeTodo, removeTodo }) {
  return (
    <div
      style={{ textDecoration: todo.isCompleted ? 'line-through' : '' }}
      className='todo'>{todo.title}
      <div>
        <button onClick={() => completeTodo(index)}>complete</button>

        <button onClick={() => removeTodo(index)}>X</button>
      </div>
    </div>
  )
}

const completeTodo = index => {
  console.log('inex is', index)
  const updateTodo = [...todo];
  updateTodo[index].isCompleted = true;
  setTodo(updateTodo);
}

const removeTodo = index => {
  const delTodo = [...todo];
  delTodo.splice(index, 1);
  setTodo(delTodo);
}


return (
  <div className="app">
    {/* <div className="todolist">
      {
        todo.map((todo, index) => (
          <TodoList
            key={index}
            todo={todo}
            index={index}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
          />
        ))}
      <TodoForm addTodo={addTodo} />
    </div> */}

  </div>
)


}

export default App;