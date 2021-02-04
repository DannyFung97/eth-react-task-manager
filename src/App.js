import './App.css';
import TodoList from './TodoList';

function App() {

  return (
    <div>
      <section className="hero">
        <div className="hero-body">
          <p className="title has-text-white">
            Ethereum Task Manager
          </p>
          <p className="subtitle has-text-white">
            React, Ethereum, and Bulma
          </p>
        </div>
      </section>
      <div className='section'>
        <div className='container'>
          <TodoList />
        </div>
      </div>
    </div>
  );
}

export default App;