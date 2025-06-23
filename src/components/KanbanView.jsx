import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/Kanban.css";

const statuses = ["À faire", "En cours", "Terminé"];

const initialTasks = [
  {
    id: 1,
    title: "Préparer le rapport",
    description: "Créer un rapport d'activité pour le mois de juin",
    status: "À faire",
    priority: "Haute",
    category: "Travail",
    date: new Date("June 20, 2025"),
    deadline: new Date("June 25, 2025")
  },
  {
    id: 2,
    title: "Répondre aux emails",
    description: "Répondre aux emails clients en attente",
    status: "En cours",
    priority: "Moyenne",
    category: "Travail",
    date: new Date("June 21, 2025"),
    deadline: new Date("June 23, 2025")
  },
  {
    id: 3,
    title: "Faire la présentation",
    description: "Préparer les slides de la réunion",
    status: "Terminé",
    priority: "Basse",
    category: "Personnel",
    date: new Date("June 22, 2025"),
    deadline: new Date("June 22, 2025")
  }
];

export default function KanbanBoard({ onLogout }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDate, setEditingDate] = useState({ 
    taskId: null, 
    field: null,
    tempDate: null,
    originalDate: null
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const taskId = parseInt(draggableId);
      const newStatus = destination.droppableId;
      
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus, animate: true } : task
      ));

      setTimeout(() => {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, animate: false } : task
          )
        );
      }, 500);
    }
  };

  const handlePriorityChange = (taskId, newPriority) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
  };

  const handleTempDateChange = (date) => {
    setEditingDate(prev => ({
      ...prev,
      tempDate: date
    }));
  };

  const handleStartEdit = (taskId, field, currentDate) => {
    setEditingDate({
      taskId,
      field,
      tempDate: currentDate,
      originalDate: currentDate
    });
  };

  const handleConfirmDate = () => {
    const { taskId, field, tempDate } = editingDate;
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, [field]: tempDate } : task
    ));
    setEditingDate({ taskId: null, field: null, tempDate: null, originalDate: null });
  };

  const handleCancelEdit = () => {
    setEditingDate({ taskId: null, field: null, tempDate: null, originalDate: null });
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditDialog(true);
  };

  const handleSaveTask = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setShowEditDialog(false);
    setEditingTask(null);
  };

  const handleCancelEditTask = () => {
    setShowEditDialog(false);
    setEditingTask(null);
  };

  const handleTaskFieldChange = (field, value) => {
    setEditingTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filteredTasks = tasks.filter(task => {
  const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase());
  const matchPriority = filterPriority ? task.priority === filterPriority : true;
  const matchStatus = filterStatus ? task.status === filterStatus : true;
  const matchCategory = filterCategory ? task.category === filterCategory : true;
  return matchSearch && matchPriority && matchStatus && matchCategory;
});

  return (
    <div className="kanban-container">
      <h2>Mes Tâches Assignées</h2>
      <h2>Mes Tâches Assignées</h2>
      <h2>Mes Tâches Assignées</h2>
      
      <header className="kanban-header">
        <h1>Espace Utilisateur</h1>
        <nav>
          <ul>
            <li>Mes Tâches</li>
            <li onClick={onLogout}>Se déconnecter</li>
          </ul>
        </nav>
      </header>
      <div className="divider"></div>

      <div className="kanban-controls">
        <h2>Mes Tâches Assignées</h2>
        <input 
          type="text" 
          placeholder="Rechercher une tâche..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="search-input"
        />
        
        <div className="filters">
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">Toutes les priorités</option>
            <option value="Haute">Haute</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="À faire">À faire</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
        </select>
          
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">Toutes les catégories</option>
            <option value="Travail">Travail</option>
            <option value="Personnel">Personnel</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div 
                  className="kanban-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="column-header">{status}</h3>
                  <div className="tasks-list">
                    {filteredTasks
                      .filter(task => task.status === status)
                      .map((task, index) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id.toString()} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`task-card ${task.priority.toLowerCase()} ${task.animate ? "status-changed" : ""}`}
                            >
                              <div className="task-header">
                                <h4>{task.title}</h4>
                                <span className="priority">{task.priority}</span>
                              </div>
                              <p className="task-description">{task.description}</p>
                              <div className="task-meta">
                                <span className="category">{task.category}</span>
                                <span className="date" onClick={() => handleStartEdit(task.id, 'date', task.date)}>
                                  {formatDate(task.date)}
                                </span>
                                <span className="deadline" onClick={() => handleStartEdit(task.id, 'deadline', task.deadline)}>
                                  Échéance: {formatDate(task.deadline)}
                                </span>
                              </div>
                              <div className="task-actions">
                                <button onClick={() => handleEditTask(task)}>Modifier</button>
                                <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <button 
        className="add-task-btn"
        onClick={() => {
          const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
          setEditingTask({
            id: newId,
            title: '',
            description: '',
            status: 'À faire',
            priority: 'Moyenne',
            category: 'Travail',
            date: new Date(),
            deadline: new Date()
          });
          setShowEditDialog(true);
        }}
      >
        + Ajouter une tâche
      </button>

      {/* Edit Task Dialog */}
      {showEditDialog && (
        <div className="edit-dialog-overlay">
          <div className="edit-dialog">
            <h3>{editingTask.id ? "Modifier la tâche" : "Ajouter une tâche"}</h3>
            <div className="form-group">
              <label>Titre:</label>
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => handleTaskFieldChange('title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={editingTask.description}
                onChange={(e) => handleTaskFieldChange('description', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Priorité:</label>
              <select
                value={editingTask.priority}
                onChange={(e) => handleTaskFieldChange('priority', e.target.value)}
              >
                <option value="Haute">Haute</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Basse">Basse</option>
              </select>
            </div>
            <div className="form-group">
              <label>Catégorie:</label>
              <input
                type="text"
                value={editingTask.category}
                onChange={(e) => handleTaskFieldChange('category', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Statut:</label>
              <select
                value={editingTask.status}
                onChange={(e) => handleTaskFieldChange('status', e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="dialog-actions">
              <button className="cancel-btn" onClick={handleCancelEditTask}>
                Annuler
              </button>
              <button className="confirm-btn" onClick={handleSaveTask}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Dialog */}
      {editingDate.taskId && (
        <div className="date-picker-overlay">
          <div className="date-picker-container">
            <DatePicker
              selected={editingDate.tempDate}
              onChange={handleTempDateChange}
              inline
            />
            <div className="date-picker-actions">
              <button onClick={handleConfirmDate}>Valider</button>
              <button onClick={handleCancelEdit}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}