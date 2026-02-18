import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Column from '../../components/user/Column';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
    Select,
    Option,
    Input,
    Button,
} from '@material-tailwind/react';
import { fetchColumns, updateTaskOrder, updateLocalTaskOrder, setSelectedProjectId, setPriority, setSearch, setDuedate } from '../../redux/Slices/user/columnSlice';
import { getAllProjects } from '../../redux/Slices/user/projectSlice';
import { toast } from 'react-toastify';
import { createTask, addComment, deleteTask, getAllTasks } from '../../redux/Slices/user/taskSlice';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const Tasks = () => {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");

    const projectsList = useSelector((state) => state.userProject.projectsList);
    const tasksList = useSelector((state) => state.managerTask.tasksList)
    const columnsList = useSelector((state) => state.userColumns.columnsList);
    const isSidebarCollapsed = useSelector((state) => state.global.isSidebarCollapsed);
    const isProjectSelected = useSelector((state) => state.userColumns.isProjectSelected);
    const filters = useSelector((state) => state.userColumns.filters);

    const onSearchChange = ({ target }) => setSearchText(target.value);

    const handleProjectSelection = (projectId) => {
        dispatch(setSelectedProjectId(projectId))
        dispatch(fetchColumns());
        dispatch(getAllTasks(projectId))
    };

    const handlePriorityChange = (priority) => {
        dispatch(setPriority(priority));
        dispatch(fetchColumns());
    }

    const handleSearch = () => {
        dispatch(setSearch(searchText));
        dispatch(fetchColumns())
    }

    const handleDateChange = ({ target }) => {
        dispatch(setDuedate(target.value));
        dispatch(fetchColumns())
    }

    const submitNewTask = async (data) => {
        dispatch(createTask(data)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                dispatch(fetchColumns());
                dispatch(getAllTasks(filters.selectedProject))
            } else {
                toast.error(data?.payload?.message)
            }
        })
    }

    const submitNewComment = (data) => {
        dispatch(addComment(data)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                dispatch(fetchColumns());
            } else {
                toast.error(data?.payload?.message)
            }
        })
    }

    const handleTaskDelete = (taskId) => {
        dispatch(deleteTask(taskId)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                dispatch(fetchColumns());
            } else {
                toast.error(data?.payload?.message)
            }
        })
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        const sourceColumnId = columnsList[source.droppableId]._id;
        const destColumnId = columnsList[destination.droppableId]._id;
        const destColumnName = columnsList[destination.droppableId].name;
        if (sourceColumnId === destColumnId) {
            const reorderedTasks = Array.from(columnsList[source.droppableId].tasks);
            const [removedTask] = reorderedTasks.splice(source.index, 1);
            reorderedTasks.splice(destination.index, 0, removedTask);
            dispatch(updateLocalTaskOrder({
                sourceColumnId,
                destColumnId,
                destColumnName,
                sourceIndex: source.index,
                destIndex: destination.index,
                task: removedTask,
            }));
            await Promise.all(
                reorderedTasks.map((task, index) => {
                    return dispatch(updateTaskOrder({
                        taskId: task._id,
                        newColumnId: sourceColumnId,
                        newIndex: index,
                    }));
                })
            );
        }
        else {
            const draggedTask = columnsList[source.droppableId].tasks[source.index];
            dispatch(updateLocalTaskOrder({
                sourceColumnId,
                destColumnId,
                destColumnName,
                sourceIndex: source.index,
                destIndex: destination.index,
                task: draggedTask,
            }));
            dispatch(updateTaskOrder({
                taskId: draggableId,
                newColumnId: destColumnId,
                newIndex: destination.index,
            }));
        }
    };

    useEffect(() => {
        dispatch(getAllProjects({}))
    }, []);

    useEffect(() => {
        if (filters.selectedProject) {
            dispatch(fetchColumns());
            dispatch(getAllTasks(filters.selectedProject))
        }
    }, [filters.selectedProject, dispatch]);

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-6 pt-6">
                <div className="w-full md:w-auto">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Project Tasks</h1>
                    <p className="text-gray-500 dark:text-gray-400">View and track your project progress</p>
                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-dark-secondary border border-gray-100 dark:border-gray-900 mb-8 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between z-50 relative mx-6"
            >
                <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
                    <div className="w-full sm:w-64">
                        <Select
                            label={isProjectSelected ? "Change Project" : "Select Project"}
                            onChange={handleProjectSelection}
                            className="text-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
                        >
                            {projectsList.map((project) => (
                                <Option key={project._id} value={project._id}>
                                    {project.name}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div className="w-full sm:w-44">
                        <Select
                            label="Priority"
                            onChange={handlePriorityChange}
                            className="text-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
                        >
                            <Option value="">All Priorities</Option>
                            <Option value="High">High</Option>
                            <Option value="Medium">Medium</Option>
                            <Option value="Low">Low</Option>
                        </Select>
                    </div>

                    <div className="w-full sm:w-48">
                        <input
                            type='date'
                            name="dueDate"
                            onChange={handleDateChange}
                            className="w-full bg-white dark:bg-dark-tertiary text-gray-700 dark:text-white text-sm px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-900 focus:border-primary-500 outline-none transition-all appearance-none"
                        />
                    </div>
                </div>

                <div className="relative w-full lg:w-72">
                    <Input
                        label="Search Tasks"
                        value={searchText}
                        onChange={onSearchChange}
                        className="pr-12 !border-gray-300 dark:!border-gray-900 focus:!border-primary-500 dark:text-white"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                        icon={<Search size={18} className="text-gray-400 absolute right-3 cursor-pointer" onClick={handleSearch} />}
                    />
                </div>
            </motion.div>

            {isProjectSelected && (
                <div className="px-6 pb-8">
                    <div className={`flex gap-8`}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            {columnsList.map((column, index) => (
                                <Droppable key={column._id} droppableId={String(index)}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            <Column
                                                key={column._id}
                                                id={column._id}
                                                name={column.name}
                                                tasks={column.tasks}
                                                projectId={filters.selectedProject}
                                                submitNewTask={submitNewTask}
                                                submitNewComment={submitNewComment}
                                                handleTaskDelete={handleTaskDelete}
                                                tasksList={tasksList}
                                            />
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </DragDropContext>
                    </div>
                </div>
            )}
        </>
    );
};