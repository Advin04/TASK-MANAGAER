import React, { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Draggable } from 'react-beautiful-dnd';
import EditTaskModal from './EditTaskModal';
import {
    Input,
    Select,
    Option,
    Card,
    CardBody,
    Typography,
    Button,
    Avatar,
    Chip,
    Dialog,
    DialogBody,
    Textarea,
    Popover,
    PopoverHandler,
    PopoverContent,
} from "@material-tailwind/react";
import { PlusSquare, Trash2, MoreHorizontal, Calendar, Paperclip, MessageSquare } from 'lucide-react';
import Multiselect from '../Multiselect';
import { useSelector } from 'react-redux';
import CommentsModal from './CommentsModal';
import TaskInfo from './TaskInfo';
import { motion } from 'framer-motion';

const Column = ({ color, name, id, tasks, membersList, submitNewTask, handleTaskDelete, handleEditTask, submitNewComment, projectId, tasksList }) => {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, reset, control, setError, clearErrors, formState: { errors } } = useForm();
    const handleOpen = () => setOpen(!open);
    const [attachments, setAttachments] = useState([])
    const user = useSelector((state) => state.auth.user)
    const onSubmit = async (data) => {
        const taskData = new FormData();
        taskData.append("name", data.name);
        taskData.append("description", data.description);
        taskData.append("priority", data.priority);
        taskData.append("dueDate", data.dueDate);
        taskData.append("projectId", projectId);
        taskData.append("createdBy", user._id);
        taskData.append("columnId", id);
        taskData.append("state", name);
        attachments.forEach((file, index) => {
            taskData.append(`attachments`, file);
        });
        data.assignees.forEach((assignee) => {
            taskData.append("assignees[]", assignee.value);
        })
        data.dependencies?.forEach((dependencie) => {
            taskData.append("dependencies[]", dependencie.value);
        })
        submitNewTask(taskData)
        handleOpen();
        reset();
        setAttachments([])
    };

    // File validation
    const validateFileTypes = (files) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/plain'];
        for (let i = 0; i < files.length; i++) {
            if (!validTypes.includes(files[i].type)) {
                setError("file", {
                    type: "manual",
                    message: "Only JPEG, PNG, JPG, TXT and PDF files are allowed",
                });
                return false;
            }
        }
        clearErrors("file"); // Clear error if files are valid
        return true;
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col min-w-[350px] max-w-[350px] rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-900 h-full max-h-[82vh] transition-colors duration-300">
                {/* Column Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-900">
                    <div className="flex items-center gap-3">
                        <div
                            className="h-4 w-4 rounded-full shadow-sm"
                            style={{ backgroundColor: `${color}` }}
                        />
                        <span className="font-bold text-gray-700 dark:text-gray-200 text-lg">{name}</span>
                        <span className="bg-gray-200 dark:bg-dark-tertiary text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs font-medium">
                            {tasks.length}
                        </span>
                    </div>
                    <button
                        id={`add-task-btn-${id}`}
                        onClick={handleOpen}
                        className="text-gray-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 p-1.5 rounded-lg transition-colors"
                    >
                        <PlusSquare size={20} />
                    </button>
                </div>

                {/* Dialog Form (Kept mostly same but styled) */}
                <Dialog size="sm" open={open} handler={handleOpen} className="bg-white dark:bg-dark-bg border border-transparent dark:border-gray-900 overflow-hidden">
                    <DialogBody className="p-0">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
                            <p className="text-2xl text-gray-800 font-bold dark:text-white text-center mb-2">
                                Create New Task
                            </p>
                            <Input
                                id="task-name"
                                name="name"
                                size="lg"
                                label="Task Name"
                                {...register("name", { required: "Task Name is required" })}
                                className="dark:text-white text-gray-800"
                            />
                            <Textarea
                                id="task-description"
                                label="Description"
                                {...register("description", { required: "Description is required" })}
                                className="dark:text-white text-gray-800"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="priority"
                                    control={control}
                                    rules={{ required: "Priority is required" }}
                                    render={({ field }) => (
                                        <Select id="task-priority" label="Priority" {...field} className="text-gray-800 dark:text-white">
                                            <Option value="High">High</Option>
                                            <Option value="Medium">Medium</Option>
                                            <Option value="Low">Low</Option>
                                        </Select>
                                    )}
                                />
                                <input
                                    id="task-due-date"
                                    type='date'
                                    {...register("dueDate", { required: "Due Date is required" })}
                                    className="w-full bg-transparent text-gray-700 dark:text-gray-300 text-sm px-3 py-2 rounded-lg border border-blue-gray-200 dark:border-gray-900 focus:border-primary-500 outline-none"
                                />
                            </div>
                            <Controller
                                name="assignees"
                                control={control}
                                rules={{ required: "Select assignee" }}
                                render={({ field }) => (
                                    <Multiselect
                                        id="task-assignees"
                                        options={membersList.map((user) => ({ label: user.name, value: user._id }))}
                                        selected={field.value || []}
                                        onChange={field.onChange}
                                        placeholder="Assignees"
                                    />
                                )}
                            />
                            <Controller
                                name="dependencies"
                                control={control}
                                render={({ field }) => (
                                    <Multiselect
                                        id="task-dependencies"
                                        options={tasksList.map((task) => ({ label: task.name, value: task._id }))}
                                        selected={field.value || []}
                                        onChange={field.onChange}
                                        placeholder="Dependencies"
                                    />
                                )}
                            />
                            <div className="space-y-1">
                                <label className="text-sm text-gray-600 dark:text-gray-400">Attachments</label>
                                <input
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                    type="file" multiple
                                    onChange={(e) => {
                                        const selectedFiles = Array.from(e.target.files);
                                        if (validateFileTypes(selectedFiles)) setAttachments(selectedFiles);
                                    }}
                                />
                                {errors.file && <p className="text-red-500 text-xs">{errors.file.message}</p>}
                            </div>
                            <Button id="task-submit" type="submit" className="btn-primary" fullWidth>Create Task</Button>
                        </form>
                    </DialogBody>
                </Dialog>

                {/* Task List */}
                <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                    {tasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className={`bg-white dark:bg-dark-bg p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-900 hover:shadow-md transition-shadow group relative ${new Date(task.dueDate) < new Date() && task.state !== 'Completed' ? 'ring-1 ring-red-400' : ''}`}>

                                            {/* Priority Badge */}
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex gap-2">
                                                    <Chip
                                                        variant="ghost"
                                                        value={task.priority}
                                                        size="sm"
                                                        className={`rounded-full px-2 py-0.5 capitalize ${task.priority === 'High' ? 'bg-red-50 text-red-600' :
                                                            task.priority === 'Medium' ? 'bg-orange-50 text-orange-600' :
                                                                'bg-green-50 text-green-600'
                                                            }`}
                                                    />
                                                    {task.category && task.category !== "Uncategorized" && (
                                                        <Chip
                                                            variant="ghost"
                                                            value={task.category}
                                                            size="sm"
                                                            className={`rounded-full px-2 py-0.5 capitalize ${task.category === 'Bug' ? 'bg-red-100 text-red-800' :
                                                                task.category === 'UI/UX' ? 'bg-purple-100 text-purple-800' :
                                                                    task.category === 'Backend' ? 'bg-blue-100 text-blue-800' :
                                                                        task.category === 'Frontend' ? 'bg-cyan-100 text-cyan-800' :
                                                                            task.category === 'DevOps' ? 'bg-indigo-100 text-indigo-800' :
                                                                                task.category === 'Feature' ? 'bg-emerald-100 text-emerald-800' :
                                                                                    'bg-gray-100 text-gray-800'
                                                                }`}
                                                        />
                                                    )}
                                                </div>
                                                <Popover placement="bottom-end">
                                                    <PopoverHandler>
                                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-md">
                                                            <MoreHorizontal size={16} className="text-gray-400" />
                                                        </button>
                                                    </PopoverHandler>
                                                    <PopoverContent className="p-2 w-40 z-[9999]">
                                                        <div className="flex flex-col gap-1">
                                                            <button onClick={() => handleTaskDelete(task._id)} className="flex items-center gap-2 text-red-500 hover:bg-red-50 p-2 rounded-lg text-sm transition-colors text-left w-full">
                                                                <Trash2 size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            {/* Task Name */}
                                            <Typography className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1 leading-tight">
                                                {task.name}
                                            </Typography>

                                            {/* Date */}
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                                                <Calendar size={12} />
                                                <span className={`${new Date(task.dueDate) < new Date() && task.state !== 'Completed' ? 'text-red-500 font-medium' : ''}`}>
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {/* Footer: User Avatars + Action Icons */}
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-900 mt-2">
                                                <div className="flex -space-x-2">
                                                    {task.assignees.slice(0, 3).map((assignee, i) => (
                                                        <Avatar
                                                            key={i}
                                                            size="xs"
                                                            variant="circular"
                                                            src={`https://ui-avatars.com/api/?background=random&name=${assignee.name}`}
                                                            className="border-2 border-white dark:border-dark-bg w-6 h-6"
                                                        />
                                                    ))}
                                                    {task.assignees.length > 3 && (
                                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 border-2 border-white font-medium">
                                                            +{task.assignees.length - 3}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <TaskInfo task={task} />
                                                    <EditTaskModal task={task} editTask={handleEditTask} membersList={membersList} />
                                                    <div className="relative">
                                                        <CommentsModal comments={task.comments} taskId={task._id} submitNewComment={submitNewComment} commenterName={user.name} commenterId={user._id} />
                                                        {task.comments?.length > 0 && (
                                                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {tasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                            <Typography variant="small">No tasks</Typography>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Column;