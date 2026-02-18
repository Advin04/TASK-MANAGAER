import React, { useEffect, useRef } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
    Button,
    Card,
    Input,
    List,
    ListItem
} from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../redux/Slices/userSlice';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { clearUser, getAllChats, getRecentChats, markAsReadChats, sendChat, setUser } from '../redux/Slices/chatSlice';

const Chat = () => {
    const dispatch = useDispatch()
    const { register, handleSubmit, reset } = useForm()
    const usersList = useSelector((state) => state.user.usersList);
    const recentChats = useSelector((state) => state.chat.recentChats);
    const chatUser = useSelector((state) => state.chat.chatUser)
    const allChats = useSelector((state) => state.chat.allChats)
    const user = useSelector((state) => state.auth.user)
    const me = useSelector((state) => state.auth.user)

    const lastChat = useRef(null)

    const onSubmit = (data) => {
        const chatData = {
            ...data,
            receiver: chatUser.id
        }
        dispatch(sendChat(chatData));
        dispatch(getAllChats());
        dispatch(getRecentChats())
        reset()
    }

    useEffect(() => {
        dispatch(getAllUsers())
        dispatch(getRecentChats())
        dispatch(clearUser())
    }, [])

    useEffect(() => {
        if (lastChat.current) {
            lastChat.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [allChats, chatUser]);

    return (
        <div className='p-6'>
            <div className="flex gap-3">
                <Card className="h-[calc(100vh-7rem)] w-full max-w-[18rem] p-4 bg-white dark:bg-dark-secondary border border-gray-100 dark:border-gray-900 shadow-sm transition-all duration-300">
                    <div className="mb-2 p-2 bg-gray-50 dark:bg-dark-tertiary rounded-lg border border-gray-100 dark:border-gray-900/50">
                        <Autocomplete
                            disablePortal
                            options={usersList}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, value) => {
                                if (value) {
                                    dispatch(setUser(value))
                                    dispatch(getAllChats())
                                    dispatch(markAsReadChats(value._id))
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="Search..." />}
                        />
                    </div>
                    <List className='overflow-auto'>
                        {
                            recentChats.map((user, index) => (
                                <div className={`p-3 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-dark-tertiary transition-colors duration-200 flex flex-col mb-1 border border-transparent ${!user.isRead && user.sender != me._id ? "bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-900/50" : "bg-transparent"}`} key={index} onClick={() => {
                                    dispatch(setUser(user));
                                    dispatch(getAllChats());
                                    dispatch(getRecentChats())
                                    dispatch(markAsReadChats(user._id))
                                }}>
                                    <div className="flex items-start">
                                        <div className="flex flex-col w-full max-w-[320px]">
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                                                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">{new Date(user.time).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm font-normal py-1 text-gray-900 dark:text-white"> {user.chat}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </List>
                </Card>
                {chatUser ?
                    <div className="h-[calc(100vh-7rem)] border-x border-gray-100 dark:border-gray-900 w-full shadow-sm bg-gray-50 dark:bg-dark-bg rounded-lg flex flex-col overflow-hidden transition-all duration-300">
                        <div className='w-full flex items-center bg-white px-4 py-3 dark:bg-dark-secondary border-b border-gray-100 dark:border-gray-900 dark:text-white font-bold text-lg'>
                            {chatUser.name}
                        </div>
                        <div className='grow gap-2 m-2 overflow-auto'>
                            {allChats.map((chat, index) => (
                                <div
                                    key={index}
                                    ref={index === allChats.length - 1 ? lastChat : null}
                                    className={`flex ${user._id == chat.sender ? "justify-end" : ""}`}>
                                    <div className={`flex flex-col m-1 w-full max-w-[320px] py-2 px-3 shadow-sm ${user._id == chat.sender ? "bg-primary-600 text-white rounded-l-xl rounded-tr-xl" : "bg-white dark:bg-dark-secondary text-gray-900 dark:text-white border border-gray-100 dark:border-gray-900 rounded-r-xl rounded-tl-xl"}`}>
                                        <p className="text-sm font-normal">{chat.chat}</p>
                                        <span className={`text-[10px] flex justify-end mt-1 ${user._id == chat.sender ? "text-primary-100" : "text-gray-500 dark:text-gray-400"}`}>{new Date(chat.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>

                            ))}
                        </div>
                        <div className='w-full flex gap-2 items-center bg-white p-3 dark:bg-dark-secondary border-t border-gray-100 dark:border-gray-900'>
                            <form onSubmit={handleSubmit(onSubmit)} className='flex items-center w-full gap-2'>

                                <Input label="Message" name='chat' {...register("chat", { required: "content is required" })} size='lg' color="blue" className="dark:text-white" />
                                <Button type='submit' size='md' className='py-2.5' color="blue">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </form>
                        </div>
                    </div>
                    :
                    <div className="h-[calc(100vh-7rem)] border border-gray-100 dark:border-gray-900 w-full shadow-sm bg-gray-50 dark:bg-dark-secondary rounded-lg flex flex-col justify-center items-center text-gray-500 dark:text-gray-400">
                        <p className="text-lg font-medium">No chat selected</p>
                        <p className="text-sm">Choose a user to start a conversation</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default Chat