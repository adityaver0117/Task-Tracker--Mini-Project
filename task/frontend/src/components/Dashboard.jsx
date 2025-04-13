import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import TaskCard from './tasks/TaskCard';
import TaskForm from './tasks/TaskForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [filter, setFilter] = useState({
    status: '',
    priority: '',
    sortBy: 'deadline:asc'
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(filter);
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      setLoading(true);
      await createTask(taskData);
      setShowTaskForm(false);
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Failed to create task. Please try again.');
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      setLoading(true);
      await updateTask(currentTask._id, taskData);
      setShowTaskForm(false);
      setCurrentTask(null);
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task. Please try again.');
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await deleteTask(taskId);
        fetchTasks();
      } catch (err) {
        console.error('Failed to delete task:', err);
        setError('Failed to delete task. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setShowTaskForm(true);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Task Manager
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-2">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-gray-700 hidden sm:inline">Welcome, {user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-pulse">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Your Tasks</h2>
            <p className="text-gray-500">{tasks.length} tasks in your collection</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex flex-wrap gap-2">
              <select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
              >
                <option value="">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                name="priority"
                value={filter.priority}
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <select
                name="sortBy"
                value={filter.sortBy}
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
              >
                <option value="deadline:asc">Deadline (Soonest)</option>
                <option value="deadline:desc">Deadline (Latest)</option>
                <option value="priority:desc">Priority (High to Low)</option>
                <option value="createdAt:desc">Recently Added</option>
              </select>
            </div>

            <button
              onClick={() => {
                setCurrentTask(null);
                setShowTaskForm(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-sm flex items-center justify-center transition-all duration-200 hover:shadow"
            >
              <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Task
            </button>
          </div>
        </div>

        {showTaskForm && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all duration-300">
            <div className="max-w-lg w-full animate-fade-in-up">
              <TaskForm
                task={currentTask}
                onSubmit={currentTask ? handleUpdateTask : handleCreateTask}
                onCancel={() => {
                  setShowTaskForm(false);
                  setCurrentTask(null);
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-6">
          {loading && !showTaskForm ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-300 border-t-indigo-600 mb-4"></div>
              <p className="text-gray-500">Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {filter.status || filter.priority
                  ? 'Try changing your filters or add a new task.'
                  : 'Get started by adding your first task!'}
              </p>
              <button
                onClick={() => {
                  setCurrentTask(null);
                  setShowTaskForm(true);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-1.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add New Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;