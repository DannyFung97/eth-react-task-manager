pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract TodoList {
    uint256 public taskCount = 0;

    struct Task {
        bytes32 id;
        string content;
        bool completed;
        uint256 date;
        uint256 timeModified;
    }

    struct NewTask {
        uint id;
        string content;
        bool completed;
        uint256 date;
        uint256 timeModified;
    }

    mapping(bytes32 => uint256) public tasksMapping;

    Task[] public tasks;

    event TaskCreated(bytes32 id, string content, bool completed, uint256 date);

    event TaskCompleted(
        bytes32 id,
        bool completed,
        uint256 date,
        uint256 timeModified
    );

    event TaskDeleted(
        bytes32 id,
        bool completed,
        uint256 date,
        uint256 timeModified,
        uint256 tasksLength
    );

    constructor() public {
        createTask("Default task", 1612345351537, false, 0);
    }

    function createTask(string memory _content, uint256 _date, bool _completed, uint256 _timeModified) public {
        taskCount++;
        bytes32 id = keccak256(abi.encodePacked(_content, _date));
        Task memory _task = Task(id, _content, _completed, _date, _timeModified);
        tasks.push(_task);
        tasksMapping[id] = tasks.length - 1;
        emit TaskCreated(id, _content, false, _date);
    }

    function toggleCompleted(bytes32 _id, uint256 _timeModified) public {
        Task memory _task = tasks[tasksMapping[_id]];
        _task.completed = !_task.completed;
        _task.timeModified = _timeModified;
        tasks[tasksMapping[_id]] = _task;
        emit TaskCompleted(
            _id,
            _task.completed,
            _task.date,
            _task.timeModified
        );
    }

    function deleteTask(bytes32 _id) public {
        taskCount--;
        uint256 taskIndex = tasksMapping[_id];
        Task memory _task = tasks[taskIndex];
        bytes32 id_ = _task.id;
        bool completed_ = _task.completed;
        uint256 date_ = _task.date;
        uint256 timeModified_ = _task.timeModified;
        delete tasksMapping[_id];

        for (uint256 i = taskIndex; i < tasks.length - 1; i++) {
            tasks[i] = tasks[i + 1];
            tasksMapping[tasks[i].id]--;
        }
        tasks.length--;

        emit TaskDeleted(id_, completed_, date_, timeModified_, tasks.length);
    }

    function commitTasks(NewTask[] memory _tasksToCreate, Task[] memory _tasks, Task[] memory _tasksToDelete) public
    {
        for (uint256 h = 0; h < _tasksToCreate.length; h++) {
            createTask(_tasksToCreate[h].content, _tasksToCreate[h].date, _tasksToCreate[h].completed, _tasksToCreate[h].timeModified);
        }
        for (uint256 k = 0; k < _tasks.length; k++) {
            if (_tasks[k].completed != tasks[tasksMapping[_tasks[k].id]].completed) {
                toggleCompleted(_tasks[k].id, _tasks[k].timeModified);
            }
        }
        for (uint256 j = 0; j < _tasksToDelete.length; j++) {
            deleteTask(_tasksToDelete[j].id);
        }
    }

    function getTaskFromId(bytes32 _id) public view returns (Task memory) {
        return tasks[tasksMapping[_id]];
    }

    function getTasks() public view returns (Task[] memory) {
        return tasks;
    }
}
