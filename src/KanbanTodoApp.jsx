import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, FolderPlus, Eye, EyeOff } from 'lucide-react';

const KanbanTodoApp = () => {
  const [projects, setProjects] = useState({
    'default': {
      name: 'Main Project',
      columns: {
        todo: { title: 'To Do', tasks: [] },
        inProgress: { title: 'In Progress', tasks: [] },
        done: { title: 'Done', tasks: [] }
      }
    }
  });
  const [currentProject, setCurrentProject] = useState('default');
  const [newTask, setNewTask] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('todo');
  const [newProjectName, setNewProjectName] = useState('');
  const [showCardView, setShowCardView] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('kanban-todos-projects');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setProjects(parsedData);
      }
    } catch (error) {
      console.error('Error loading localStorage data:', error);
    }
  }, []);

  // Save data to localStorage whenever projects change
  useEffect(() => {
    try {
      localStorage.setItem('kanban-todos-projects', JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [projects]);

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const d = new Date(date);
    const dayName = days[d.getDay()];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    
    return `${dayName}. ${day} ${month} ${year}`;
  };

  const calculateDaysSince = (date) => {
    const today = new Date();
    const taskDate = new Date(date);
    const diffTime = Math.abs(today - taskDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'today' : `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  const addProject = () => {
    if (newProjectName.trim() === '') return;
    
    const projectId = Date.now().toString();
    setProjects(prev => ({
      ...prev,
      [projectId]: {
        name: newProjectName,
        columns: {
          todo: { title: 'To Do', tasks: [] },
          inProgress: { title: 'In Progress', tasks: [] },
          done: { title: 'Done', tasks: [] }
        }
      }
    }));
    
    setNewProjectName('');
    setCurrentProject(projectId);
  };

  const deleteProject = (projectId) => {
    if (projectId === 'default') return;
    
    setProjects(prev => {
      const newProjects = { ...prev };
      delete newProjects[projectId];
      return newProjects;
    });
    
    if (currentProject === projectId) {
      setCurrentProject('default');
    }
  };

  const getCurrentColumns = () => {
    return projects[currentProject]?.columns || {
      todo: { title: 'To Do', tasks: [] },
      inProgress: { title: 'In Progress', tasks: [] },
      done: { title: 'Done', tasks: [] }
    };
  };

  const addTask = () => {
    if (newTask.trim() === '') return;

    const task = {
      id: Date.now(),
      text: newTask,
      createdAt: new Date().toISOString(),
      completed: false
    };

    setProjects(prev => ({
      ...prev,
      [currentProject]: {
        ...prev[currentProject],
        columns: {
          ...prev[currentProject].columns,
          [selectedColumn]: {
            ...prev[currentProject].columns[selectedColumn],
            tasks: [...prev[currentProject].columns[selectedColumn].tasks, task]
          }
        }
      }
    }));

    setNewTask('');
  };

  const moveTask = (taskId, fromColumn, toColumn) => {
    const columns = getCurrentColumns();
    const task = columns[fromColumn].tasks.find(t => t.id === taskId);
    
    setProjects(prev => ({
      ...prev,
      [currentProject]: {
        ...prev[currentProject],
        columns: {
          ...prev[currentProject].columns,
          [fromColumn]: {
            ...prev[currentProject].columns[fromColumn],
            tasks: prev[currentProject].columns[fromColumn].tasks.filter(t => t.id !== taskId)
          },
          [toColumn]: {
            ...prev[currentProject].columns[toColumn],
            tasks: [...prev[currentProject].columns[toColumn].tasks, { ...task, completed: toColumn === 'done' }]
          }
        }
      }
    }));
  };

  const deleteTask = (taskId, columnKey) => {
    setProjects(prev => ({
      ...prev,
      [currentProject]: {
        ...prev[currentProject],
        columns: {
          ...prev[currentProject].columns,
          [columnKey]: {
            ...prev[currentProject].columns[columnKey],
            tasks: prev[currentProject].columns[columnKey].tasks.filter(t => t.id !== taskId)
          }
        }
      }
    }));
  };

  const generateMarkdown = () => {
    let markdown = '# Kanban Todo List\n\n';
    
    if (showCardView) {
      Object.entries(projects).forEach(([projectId, project]) => {
        markdown += `## ${project.name}\n\n`;
        
        Object.entries(project.columns).forEach(([key, column]) => {
          markdown += `### ${column.title}\n\n`;
          
          column.tasks.forEach(task => {
            const checkbox = task.completed ? '[x]' : '[ ]';
            const dateStr = formatDate(task.createdAt);
            const daysSince = calculateDaysSince(task.createdAt);
            markdown += `* ${checkbox} ${task.text} {${dateStr}} ${daysSince}\n`;
          });
          
          markdown += '\n';
        });
      });
    } else {
      const currentProjectData = projects[currentProject];
      markdown += `## ${currentProjectData.name}\n\n`;
      
      Object.entries(currentProjectData.columns).forEach(([key, column]) => {
        markdown += `### ${column.title}\n\n`;
        
        column.tasks.forEach(task => {
          const checkbox = task.completed ? '[x]' : '[ ]';
          const dateStr = formatDate(task.createdAt);
          const daysSince = calculateDaysSince(task.createdAt);
          markdown += `* ${checkbox} ${task.text} {${dateStr}} ${daysSince}\n`;
        });
        
        markdown += '\n';
      });
    }
    
    return markdown;
  };

  const downloadMarkdown = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanban-todo-${showCardView ? 'all-projects' : projects[currentProject].name}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ProjectCard = ({ project, projectId, position }) => {
    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4', 
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };

    const totalTasks = Object.values(project.columns).reduce((sum, col) => sum + col.tasks.length, 0);

    return (
      <div className={`fixed ${positionClasses[position]} w-80 bg-white rounded-lg shadow-lg border z-10 max-h-96 overflow-hidden`}>
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold truncate">{project.name}</h3>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">{totalTasks} tasks</span>
          </div>
        </div>
        
        <div className="p-3 space-y-3 overflow-y-auto max-h-80">
          {Object.entries(project.columns).map(([columnKey, column]) => (
            <div key={columnKey} className="border-l-4 border-gray-300 pl-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">{column.title}</h4>
                <span className="text-xs text-gray-500">({column.tasks.length})</span>
              </div>
              
              <div className="space-y-1">
                {column.tasks.slice(0, 3).map(task => (
                  <div key={task.id} className="text-xs bg-gray-50 p-2 rounded">
                    <div className={`font-medium mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.text.length > 30 ? `${task.text.substring(0, 30)}...` : task.text}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {calculateDaysSince(task.createdAt)}
                    </div>
                  </div>
                ))}
                {column.tasks.length > 3 && (
                  <div className="text-xs text-gray-400 text-center py-1">
                    +{column.tasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-2 bg-gray-50 rounded-b-lg border-t">
          <button
            onClick={() => {
              setCurrentProject(projectId);
              setShowCardView(false);
            }}
            className="w-full text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Open Project
          </button>
        </div>
      </div>
    );
  };

  const columns = getCurrentColumns();
  const projectsArray = Object.entries(projects);
  const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Project Card View Overlay */}
      {showCardView && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-5"></div>
          {projectsArray.map(([projectId, project], index) => (
            <ProjectCard
              key={projectId}
              project={project}
              projectId={projectId}
              position={positions[index % positions.length]}
            />
          ))}
          
          <button
            onClick={() => setShowCardView(false)}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
          >
            <EyeOff size={20} />
            Close Card View
          </button>
        </>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Kanban Todo List</h1>
          
          {/* Project Management */}
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
            <div className="flex flex-wrap gap-3 items-center mb-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Current Project:</label>
                <select
                  value={currentProject}
                  onChange={(e) => setCurrentProject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(projects).map(([id, project]) => (
                    <option key={id} value={id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="New project name..."
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addProject()}
                />
                <button
                  onClick={addProject}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
                >
                  <FolderPlus size={20} />
                  Add Project
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCardView(true)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2"
                >
                  <Eye size={20} />
                  Card View
                </button>
                
                {currentProject !== 'default' && (
                  <button
                    onClick={() => deleteProject(currentProject)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete Project
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Add Task Form */}
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a new task..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button
                onClick={addTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Task
              </button>
            </div>
          </div>

          {/* Export Markdown Button */}
          <button
            onClick={downloadMarkdown}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
          >
            <Calendar size={20} />
            Export as Markdown
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([columnKey, column]) => (
            <div key={columnKey} className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <h2 className="text-xl font-semibold text-gray-700">{column.title}</h2>
                <span className="text-sm text-gray-500">({column.tasks.length} tasks)</span>
              </div>
              
              <div className="p-4 space-y-3 min-h-[200px]">
                {column.tasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.text}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id, columnKey)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar size={14} />
                      <span>{formatDate(task.createdAt)}</span>
                      <Clock size={14} />
                      <span>{calculateDaysSince(task.createdAt)}</span>
                    </div>

                    {/* Markdown Preview */}
                    <div className="text-xs bg-white p-2 rounded border font-mono text-gray-600">
                      * [{task.completed ? 'x' : ' '}] {task.text} {'{' + formatDate(task.createdAt) + '}'} {calculateDaysSince(task.createdAt)}
                    </div>

                    {/* Move Task Buttons */}
                    <div className="flex gap-2 mt-3">
                      {columnKey !== 'todo' && (
                        <button
                          onClick={() => moveTask(task.id, columnKey, 'todo')}
                          className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          To Do
                        </button>
                      )}
                      {columnKey !== 'inProgress' && (
                        <button
                          onClick={() => moveTask(task.id, columnKey, 'inProgress')}
                          className="text-xs px-2 py-1 bg-blue-200 text-blue-700 rounded hover:bg-blue-300"
                        >
                          In Progress
                        </button>
                      )}
                      {columnKey !== 'done' && (
                        <button
                          onClick={() => moveTask(task.id, columnKey, 'done')}
                          className="text-xs px-2 py-1 bg-green-200 text-green-700 rounded hover:bg-green-300"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Markdown Preview */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Markdown Export Preview - {projects[currentProject]?.name || 'Current Project'}
          </h3>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap">
            {generateMarkdown()}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default KanbanTodoApp;