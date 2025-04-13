import { useState } from 'react';
import { format } from 'date-fns';
import { updateTaskProgress } from '../../services/api';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [progress, setProgress] = useState(task.progress);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formattedDeadline = format(new Date(task.deadline), 'MMM dd, yyyy');

  const daysRemaining = Math.ceil(
    (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const priorityColors = {
    Low: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z"></path></svg>
    },
    Medium: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path></svg>
    },
    High: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
    }
  };

  const statusColors = {
    'Not Started': {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200'
    },
    'In Progress': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    'Completed': {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200'
    }
  };

  const handleProgressChange = (e) => {
    setProgress(Number(e.target.value));
  };

  const handleProgressBlur = async () => {
    if (progress !== task.progress) {
      setIsUpdating(true);
      try {
        await updateTaskProgress(task._id, progress);
        setIsUpdating(false);
      } catch (error) {
        console.error('Failed to update progress', error);
        setProgress(task.progress);
        setIsUpdating(false);
      }
    }
  };

  const handleStatusChange = (e) => {
    onStatusChange(task._id, e.target.value);
  };

  const getBorderColor = () => {
    if (task.status === 'Completed') return 'border-green-200 hover:border-green-300';
    if (daysRemaining <= 1) return 'border-red-200 hover:border-red-300';
    return 'border-indigo-100 hover:border-indigo-300';
  };

  const getDeadlineIcon = () => {
    if (daysRemaining <= 0) {
      return <svg className="w-3 h-3 mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>;
    }
    if (daysRemaining <= 2) {
      return <svg className="w-3 h-3 mr-1 text-amber-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>;
    }
    return <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>;
  };

  return (
    <div
      className={`bg-white rounded-xl border-2 p-5 shadow-sm hover:shadow-md transition-all duration-300 ${getBorderColor()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{task.title}</h3>

        <div className={`flex space-x-1 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
            title="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
            title="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">{task.description}</p>
      )}

      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-500">Progress</span>
          <span className={`text-xs font-medium ${progress === 100 ? 'text-green-600' : 'text-indigo-600'}`}>
            {progress}%
          </span>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-300 ${progress === 100
                ? 'bg-gradient-to-r from-green-400 to-green-500'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
            style={{ width: `${progress}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            onBlur={handleProgressBlur}
            className={`absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer ${isUpdating || task.status === 'Completed' ? 'cursor-not-allowed' : ''}`}
            disabled={isUpdating || task.status === 'Completed'}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="col-span-1">
          <select
            value={task.status}
            onChange={handleStatusChange}
            className={`w-full text-xs font-medium rounded-full px-3 py-1.5 border cursor-pointer appearance-none focus:outline-none focus:ring-0 ${statusColors[task.status].bg} ${statusColors[task.status].text} ${statusColors[task.status].border}`}
            style={{ backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="col-span-1">
          <div className={`flex items-center justify-center text-xs font-medium rounded-full px-3 py-1.5 ${priorityColors[task.priority].bg} ${priorityColors[task.priority].text} ${priorityColors[task.priority].border}`}>
            {priorityColors[task.priority].icon}
            {task.priority} Priority
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
        <div className={`flex items-center text-xs font-medium rounded-full px-3 py-1.5 ${daysRemaining <= 0
            ? 'bg-red-50 text-red-700 border border-red-200'
            : daysRemaining <= 2
              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              : 'bg-gray-50 text-gray-700 border border-gray-200'
          }`}>
          {getDeadlineIcon()}
          {daysRemaining <= 0
            ? 'Overdue!'
            : daysRemaining === 1
              ? '1 day left'
              : `${daysRemaining} days left`
          }
        </div>

        <div className="text-xs text-gray-500 ml-auto">
          Due: {formattedDeadline}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;