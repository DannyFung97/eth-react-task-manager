import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { connect } from 'react-redux';
import {
  changeFilterCompleted,
  changeEthCommit,
  addSmartContract,
  storeTasks,
  createTask,
  toggleCompleted,
  toggleCompletedToBeCreated,
  deleteTask,
  deleteTaskToBeCreated
} from './tasks/actions';
import {
  getFilterCompleted,
  getEthCommit,
  getSmartContract,
  getTasks,
  getTasksToCreate,
  getTasksToDelete
} from './tasks/selectors';
import TodoListContract from './contracts/TodoList.json';

import './TodoList.css';

const TodoList = ({
  filterCompleted,
  ethCommit,
  smartContract,
  tasks,
  tasksToCreate,
  tasksToDelete,
  setFilterCompleted,
  changeEthCommit,
  addSmartContract,
  storeTasksInRedux,
  createTaskInRedux,
  toggleCompletedInRedux,
  toggleCompletedToBeCreatedInRedux,
  deleteTaskInRedux,
  deleteTaskToBeCreatedInRedux
}) => {

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const [account, setAccount] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const accounts = await web3.eth.getAccounts()
    const networkId = await web3.eth.net.getId();
    const deployedNetworks = TodoListContract.networks[networkId];
    const todoList = new web3.eth.Contract(TodoListContract.abi, deployedNetworks && deployedNetworks.address)
    const taskCount = await todoList.methods.taskCount().call();
    setTaskCount(taskCount);
    let receivedTasks = [];
    for (var i = 0; i < taskCount; i++) {
      const task = await todoList.methods.tasks(i).call()
      receivedTasks.push(task);
    }
    storeTasksInRedux(receivedTasks);
    setAccount(accounts[0]);
    addSmartContract(todoList);
    setLoading(false);
  }

  async function fetchTasks() {
    const taskCount = await smartContract.methods.taskCount().call();
    setTaskCount(taskCount);
    // console.log(taskCount)
    let receivedTasks = [];
    for (var i = 0; i < taskCount; i++) {
      const task = await smartContract.methods.tasks(i).call()
      receivedTasks.push(task);
    }
    // console.log(receivedTasks)
    storeTasksInRedux(receivedTasks);
    setLoading(false);
  }

  async function createTask(content) {
    setLoading(true);
    smartContract.methods.createTask(content, Date.now(), false, 0).send({ from: account })
      .once('receipt', (receipt) => {
        fetchTasks()
      })
  }

  async function toggleCompleted(taskId) {
    // console.log(taskId)
    setLoading(true);
    const res = await smartContract.methods.toggleCompleted(taskId, Date.now()).send({ from: account })
      .once('receipt', (receipt) => {
        fetchTasks()
      })
  }

  async function deleteTask(taskId) {
    // console.log(taskId)
    setLoading(true);
    smartContract.methods.deleteTask(taskId).send({ from: account })
      .once('receipt', (receipt) => {
        fetchTasks()
      })
  }

  async function commitTasks() {
    setLoading(true);
    console.log(tasksToCreate, tasks, tasksToDelete)
    smartContract.methods.commitTasks(tasksToCreate, tasks, tasksToDelete).send({ from: account })
      .once('receipt', (receipt) => {
        fetchTasks()
      })
  }

  function checkTask() {
    if (content !== '') {
      createTaskHandler(content)
    }
    else {
      document.getElementById('name-required').classList.remove('is-hidden');
    }
  }

  function changeName(task) {
    // console.log(task)
    if (!document.getElementById('name-required').classList.contains('is-hidden')) {
      document.getElementById('name-required').classList.add('is-hidden');
    }
    setContent(task);
  }

  function createTaskHandler(content) {
    if (!ethCommit) {
      createTask(content)
    }
    else {
      const now = Date.now()
      const newTask = [{
        id: 0,
        content: content,
        completed: false,
        date: now,
        timeModified: 0,
    }]
    console.log(tasks, tasksToCreate)
    createTaskInRedux(newTask);
    }
  }

  function toggleCompletedHandler(task) {
    if (!ethCommit) {
      toggleCompleted(task.id)
    }
    else if (task.id === 0) {
      toggleCompletedToBeCreatedInRedux(task.id, task.content, task.date, Date.now());
    }
    else {
      toggleCompletedInRedux(task.id, Date.now());
    }
  }

  function deleteTaskHandler(task) {
    if (!ethCommit) {
      deleteTask(task.id)
    }
    else if (task.id === 0) {
      deleteTaskToBeCreatedInRedux(task.id, task.content, task.date);
    }
    else {
      deleteTaskInRedux(task.id)
    }
  }

  return (
    <div>
      {
        loading ?
          <p>Loading...</p>
          :
          <div className='column'>
            <form onSubmit={(event) => {
              event.preventDefault()
              checkTask()
            }}>
              <div className="field has-addons">
                <div className="control">
                  <input
                    id="newTask"
                    onChange={e => changeName(e.target.value)}
                    className="input is-link" type="text" placeholder="Add a task..." />
                </div>
                <div className="control">
                  <input type="submit" className="button is-link" />
                </div>
              </div>
              <p id='name-required' className="help is-danger is-hidden">Invalid task name</p>
              <label className="taskTemplate" className="checkbox">
                <input type="checkbox" className='checkbox-size' onChange={e => setFilterCompleted()} checked={filterCompleted} />
          Filter Completed Tasks
        </label>
              <label className="taskTemplate" className="checkbox">
                <input type="checkbox" className='checkbox-size' onChange={e => changeEthCommit()} checked={ethCommit} />
          Don't commit any changes until I press
          <button className='button is-success is-small' disabled={!ethCommit} style={{ marginLeft: '1rem' }}
                  onClick={(event) => {
                    commitTasks()
                  }}>
                  Commit
                </button>
              </label>
            </form>
            <table className='table is-fullwidth has-text-centered'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Content</th>
                  <th>Mark Completed</th>
                </tr>
              </thead>
              <tbody>
                {tasksToCreate.concat(tasks).map((task, key) => {
                  if (filterCompleted && task.completed) {
                    return null;
                  }
                  return (
                    <tr>
                      <td>{task.id.toString().substring(0, 10)}...</td>
                      <td>{task.content}</td>
                      <td>
                        <div className="taskTemplate" className="checkbox" key={key}>
                          <input type="checkbox" className='checkbox-size' onChange={(event) => toggleCompletedHandler(task)} checked={task.completed} />
                        </div>
                      </td>
                      <td>
                        <button className='button is-danger is-small'
                          onClick={(event) => {
                            deleteTaskHandler(task)
                          }}>
                          Delete
                </button>
                      </td>
                    </tr>
                  )
                })
                }
              </tbody>
            </table>
            {
              tasksToCreate.concat(tasks).length <= 0 ? <div className='has-text-centered'>If you have tasks, they'll appear here.</div> : null
            }
          </div>
      }
    </div>
  );
}

const mapStateToProps = state => ({
  filterCompleted: getFilterCompleted(state),
  ethCommit: getEthCommit(state),
  smartContract: getSmartContract(state),
  tasks: getTasks(state),
  tasksToCreate: getTasksToCreate(state),
  tasksToDelete: getTasksToDelete(state),
})

const mapDispatchToProps = dispatch => ({
  setFilterCompleted: () => dispatch(changeFilterCompleted()),
  changeEthCommit: () => dispatch(changeEthCommit()),
  addSmartContract: contract => dispatch(addSmartContract(contract)),
  storeTasksInRedux: tasks => dispatch(storeTasks(tasks)),
  createTaskInRedux: task => dispatch(createTask(task)),
  toggleCompletedInRedux: (id, timeModified) => dispatch(toggleCompleted(id, timeModified)),
  toggleCompletedToBeCreatedInRedux: (id, content, date, timeModified) => dispatch(toggleCompletedToBeCreated(id, content, date, timeModified)),
  deleteTaskInRedux: id => dispatch(deleteTask(id)),
  deleteTaskToBeCreatedInRedux: (id, content, date) => dispatch(deleteTaskToBeCreated(id, content, date))
})

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);