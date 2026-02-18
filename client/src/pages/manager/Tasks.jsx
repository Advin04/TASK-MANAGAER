import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Column from '../../components/manager/Column';
import { PlusSquare, Search } from 'lucide-react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
    Input,
    Select,
    Option,
    Button,
    DialogBody,
    Dialog
} from '@material-tailwind/react';
import { fetchColumns, updateTaskOrder, updateLocalTaskOrder, setSelectedProjectId, createColumn, setPriority, setSearch, setDuedate } from '../../redux/Slices/manager/columnSlice';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { getAllProjects } from '../../redux/Slices/manager/projectSlice';
import { toast } from 'react-toastify';
import { createTask, addComment, deleteTask, editTask, getAllTasks } from '../../redux/Slices/manager/taskSlice';
import { getProjectMembers } from '../../redux/Slices/userSlice';

export const Tasks = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, reset } = useForm();
    const [searchText, setSearchText] = useState("");

    const membersList = useSelector((state) => state.user.membersList);
    const tasksList = useSelector((state) => state.managerTask.tasksList)
    const projectsList = useSelector((state) => state.managerProject.projectsList);
    const columnsList = useSelector((state) => state.managerColumns.columnsList);
    const isSidebarCollapsed = useSelector((state) => state.global.isSidebarCollapsed);
    const isProjectSelected = useSelector((state) => state.managerColumns.isProjectSelected);
    const filters = useSelector((state) => state.managerColumns.filters);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

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

    const onSubmit = async (data) => {
        const columnData = {
            ...data,
            projectId: filters.selectedProject,
        };
        dispatch(createColumn(columnData)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                dispatch(fetchColumns());

            } else {
                toast.error(data?.payload?.message)
            }
        })
        handleOpen();
        reset();
    };

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

    const handleEditTask = async (data) => {
        dispatch(editTask(data)).then((data) => {
            if (data?.payload.success) {
                toast.success(data?.payload?.message)
                dispatch(fetchColumns());
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
            dispatch(getProjectMembers(filters.selectedProject))
            dispatch(getAllTasks(filters.selectedProject))
        }
    }, [filters.selectedProject, dispatch]);

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-6 pt-6">
                <div className="w-full md:w-auto">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Project Tasks</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage and track your project progress</p>
                </div>

                {isProjectSelected && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpen}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all font-medium"
                    >
                        <PlusSquare size={18} />
                        <span>Add Column</span>
                    </motion.button>
                )}
            </div>

            <Dialog size="sm" open={open} handler={handleOpen} className="bg-white dark:bg-dark-bg border border-transparent dark:border-gray-900 overflow-hidden">
                <DialogBody>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center p-6">
                        <div className="flex flex-col gap-6 min-w-[100%] m-auto">
                            <p className="text-2xl text-gray-800 font-bold dark:text-white text-center">
                                Create Column
                            </p>
                            <Input
                                name="name"
                                size="lg"
                                label="Column Name"
                                {...register('name', { required: 'Column Name is required' })}
                                className="!border-gray-300 dark:!border-gray-900 focus:!border-primary-500 dark:text-white"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                            <Button type="submit" className="btn-primary" fullWidth>
                                {'Create New Column'}
                            </Button>
                        </div>
                    </form>
                </DialogBody>
            </Dialog>

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
                                                membersList={membersList}
                                                submitNewTask={submitNewTask}
                                                submitNewComment={submitNewComment}
                                                handleTaskDelete={handleTaskDelete}
                                                handleEditTask={handleEditTask}
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