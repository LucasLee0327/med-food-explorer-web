import React, { Component } from "react";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import DOMPurify from "dompurify";
import services from "../services";

// webpage template from https://tailblocks.cc/
function Chatboard() {
    const authContext = useContext(AuthContext);
    const isLoggedIn = authContext? authContext.isLoggedIn : false
    
    const [textInput, setTextInput] = useState({ content: '' });
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                if(isLoggedIn) {
                    const response = await services.user.getName();
                    if (response) {
                        const name = response.Username;
                        setUsername(name);
                    } else {
                        console.error('Error fetching user data: Invalid response format');
                    }
                }              
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        }

        fetchData();
    }, []);

    /** @type {React.ChangeEventHandler<HTMLInputElement>} */
    const handleTextInputChange = ({ target: { name, value } }) => {
        // const { name, value } = event.target
        // obj = { ...prev }; obj[name] = value
        setTextInput(prev => ({
        ...prev,
        [name]: value,
        }))
    }

    /** @type {React.FormEventHandler<HTMLFormElement>} */
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        
        const sanitizedContent = DOMPurify.sanitize(textInput.content);

        try {
           await services.user.poMessage({ content: sanitizedContent });
           // 刷新留言列表
           fetchComments();
           setTextInput({ content: '' });
        } catch (error) {
           console.error('Error posting message:', error);
        }
    }

    const handleDelete = async (messageId) => {
        try {
           await services.user.delMessage(messageId);
           setComments(prev => prev.filter(comment => comment.id !== messageId));
        } catch (error) {
           console.error('Error deleting message:', error);
        }
    }

    useEffect(() => {
        // 在页面加载时获取留言列表
        if(isLoggedIn) {
            fetchComments();
        }       
    }, []);
  
    const fetchComments = async () => {
        try {
           const response = await services.user.getAllMess();
           setComments(response);
        } catch (error) {
           console.error('Error fetching comments:', error);
        }
    }

    // next page content
    return (
        <>
            {isLoggedIn ? (
                <section className="text-black body-font overflow-hidden">               
                    <div className="container px-5 py-10 mx-auto">
                        <h1 className="flex justify-start py-5 text-2xl font-bold">Chatboard</h1>
                        <div className="-my-8 divide-y-2 divide-gray-200">
                            <div className="py-8 flex flex-wrap md:flex-nowrap">
                                <div className="md:flex-grow">
                                    <form onSubmit={handleFormSubmit} className="flex flex-row space-x-4">
                                        <label htmlFor="content">留言内容:</label>
                                        <input className="bg-blue-100 mb-4" name="content" value={textInput.content} onChange={handleTextInputChange} />
                                        <input className="bg-blue-300 mb-4 rounded-md border-2 border-blue-500 font-bold" type="submit" value="留言" />
                                    </form>
                                </div>
                            </div>

                            <div className="py-8 justify-start">
                                {comments.map(comment => (
                                    <div key={comment.id} className="text-left mb-4 bg-blue-100 p-4 rounded-lg">
                                        <img src={comment.author.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                                        <p className="text-xl font-semibold text-gray-900 title-font mb-2">{comment.author.username}</p>                                                                                                                
                                        <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: comment.content }} />
                                        { username === comment.author.username && (
                                            <button className="text-sm text-red-500 mt-2" onClick={() => handleDelete(comment.id)}>删除留言</button>
                                        )}                                   
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </section>
            ) : (
                <div className="flex items-center justify-center h-screen">
                <p className="text-3xl font-bold">請登入後使用。</p>
                </div>
            )}           
        </>
    );

}

export default Chatboard