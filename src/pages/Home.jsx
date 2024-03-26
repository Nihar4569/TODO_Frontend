import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Context, server } from '../main';
import { toast } from 'react-hot-toast';
import TodoItem from '../components/TodoItem';
import { Navigate } from 'react-router-dom';

const Home = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const { isAuthenticated } = useContext(Context);

  const updateHandler = async (id) => {
    try {
      const { data } = await axios.put(`${server}/tasks/${id}`, {}, {
        withCredentials: true,
      });
      toast.success(data.message);
      setRefresh(prev => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/tasks/${id}`, {
        withCredentials: true,
      });
      
      toast.success(data.message);
      setRefresh(prev => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    axios.get(`${server}/tasks/my`, {
      withCredentials: true,
    }).then(res => {
      setTasks(res.data.task);
    }).catch(e => {
      toast.error(e.response.data.message);
    });
  }, [refresh]);

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${server}/tasks/new`, {
        title,
        description,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        }
      });
      setTitle("");
      setDescription("");
      toast.success(data.message);
      setLoading(false);
      setRefresh(prev => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  return (
    <div className='container'>
      <div className="login">
        <section className="todosContainer_">
          <form onSubmit={submitHandler}>
            <input type="text" placeholder='Title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <input type="text" placeholder='Description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
            <button disabled={loading} type='submit'>Add Task</button>
          </form>
        </section>
      </div>
      <section className='todosContainer'>
        {
          tasks.map(i => (
            <TodoItem
              key={i._id}
              title={i.title}
              description={i.description}
              isCompleted={i.isCompleted}
              updateHandler={updateHandler}
              deleteHandler={deleteHandler}
              id={i._id}
            />
          ))
        }
      </section>
    </div>
  )
}

export default Home