import { createSelector } from 'reselect';

export const getFilterCompleted = state => state.taskState.filterCompleted;
export const getSmartContract = state => state.taskState.contract;
export const getEthCommit = state => state.taskState.ethCommit;
export const getTasks = state => state.taskState.tasks;
export const getTasksToCreate = state => state.taskState.tasksToCreate;
export const getTasksToDelete = state => state.taskState.tasksToDelete;