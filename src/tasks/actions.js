export const ADD_SMART_CONTRACT = "ADD_SMART_CONTRACT";
export const addSmartContract = contract => ({
    type: ADD_SMART_CONTRACT,
    payload: { contract }
})

export const CHANGE_FILTER_COMPLETED = "CHANGE_FILTER_COMPLETED";
export const changeFilterCompleted = () => ({
    type: CHANGE_FILTER_COMPLETED
})

export const CHANGE_ETH_COMMIT = "CHANGE_ETH_COMMIT";
export const changeEthCommit = () => ({
    type: CHANGE_ETH_COMMIT
})

export const STORE_TASKS = "STORE_TASKS";
export const storeTasks = tasks => ({
    type: STORE_TASKS,
    payload: { tasks }
})

export const CREATE_TASK = "CREATE_TASK";
export const createTask = task => ({
    type: CREATE_TASK,
    payload: { task }
})

export const TOGGLE_COMPLETED = "TOGGLE_COMPLETED";
export const toggleCompleted = (id, timeModified) => ({
    type: TOGGLE_COMPLETED,
    payload: { id, timeModified }
})

export const TOGGLE_COMPLETED_TO_BE_CREATED = "TOGGLE_COMPLETED_TO_BE_CREATED";
export const toggleCompletedToBeCreated = (id, content, date, timeModified) => ({
    type: TOGGLE_COMPLETED_TO_BE_CREATED,
    payload: { id, content, date, timeModified }
})

export const DELETE_TASK = "DELETE_TASK";
export const deleteTask = id => ({
    type: DELETE_TASK,
    payload: { id }
})

export const DELETE_TASK_TO_BE_CREATED = "DELETE_TASK_TO_BE_CREATED";
export const deleteTaskToBeCreated = (id, content, date) => ({
    type: DELETE_TASK_TO_BE_CREATED,
    payload: { id, content, date }
})