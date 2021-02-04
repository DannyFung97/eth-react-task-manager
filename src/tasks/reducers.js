import {
    ADD_SMART_CONTRACT,
    CHANGE_FILTER_COMPLETED,
    CHANGE_ETH_COMMIT,
    STORE_TASKS,
    CREATE_TASK,
    TOGGLE_COMPLETED,
    TOGGLE_COMPLETED_TO_BE_CREATED,
    DELETE_TASK,
    DELETE_TASK_TO_BE_CREATED
} from './actions';

const initialState = {
    contract: null,
    filterCompleted: false,
    ethCommit: true,
    tasks: [],
    tasksToCreate: [],
    tasksToDelete: []
}

export const taskState = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case ADD_SMART_CONTRACT: {
            const { contract: contractToAdd } = payload;
            return {
                ...state,
                contract: contractToAdd,
            }
        }
        case CHANGE_FILTER_COMPLETED: {
            return {
                ...state,
                filterCompleted: !state.filterCompleted,
            }
        }
        case CHANGE_ETH_COMMIT: {
            return {
                ...state,
                ethCommit: !state.ethCommit,
            }
        }
        case STORE_TASKS: {
            const { tasks: tasksToStore } = payload;
            return {
                ...state,
                tasks: tasksToStore,
                tasksToCreate: [],
                tasksToDelete: []
            }
        }
        case CREATE_TASK: {
            const { task: newTask } = payload;
            return {
                ...state,
                tasksToCreate: state.tasksToCreate.concat(newTask),
            }
        }
        case TOGGLE_COMPLETED: {
            const { id, timeModified } = payload;
            return {
                ...state,
                tasks: state.tasks.map((task) => {
                    if (task.id === id) {
                        return {
                            ...task,
                            completed: !task.completed,
                            timeModified: timeModified,
                        }
                    }
                    return task
                }),
            }
        }
        case TOGGLE_COMPLETED_TO_BE_CREATED: {
            const { id, content, date, timeModified } = payload;
            return {
                ...state,
                tasksToCreate: state.tasksToCreate.map((task) => {
                    if (task.id === id && task.content === content && task.date === date) {
                        return {
                            ...task,
                            completed: !task.completed,
                            timeModified: timeModified,
                        }
                    }
                    return task
                }),
            }
        }
        case DELETE_TASK: {
            const { id } = payload;
            return {
                ...state,
                tasksToDelete: state.tasksToDelete.concat(
                    state.tasks.filter(task => task.id === id)
                ),
                tasks: state.tasks.filter(task => task.id !== id),
            }
        }
        case DELETE_TASK_TO_BE_CREATED: {
            const { id, content, date } = payload;
            return {
                ...state,
                tasksToCreate: state.tasksToCreate.filter(task => task.id !== id && task.content !== content && task.date !== date)
            }
        }
        default:
            return state
    }
}