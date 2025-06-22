import React, { useState } from "react";
import TaskCard from "./TaskCard";
import "../styles/board.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default function TaskBoard({ onLogout }) {
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

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
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

  return (
    <div className="board-container">
      <header className="dashboard-header">
        <h1>Espace Utilisateur</h1>
        <nav>
          <ul>
            <li>Mes Tâches</li>
            <li onClick={onLogout}>Se déconnecter</li>
          </ul>
        </nav>
      </header>

      <div className="divider"></div>

      <section className="assigned-tasks">
        <h2>Mes Tâches Assignées</h2>

        <input 
          type="text" 
          placeholder="Rechercher une tâche (par son Titre, Catégorie ou Statut)..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="search-input"
        />

        <table className="tasks-table">
          <thead>
            <tr>
              <th>Tâche</th>
              <th>Description</th>
              <th>Priorité</th>
              <th>Catégorie</th>
              <th>Date</th>
              <th>Date limite</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks
              .filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.status.toLowerCase().includes(searchTerm.toLowerCase()) 
              )
              .map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    <select
                      value={task.priority}
                      onChange={(e) => handlePriorityChange(task.id, e.target.value)}
                      className={`priority-select ${task.priority.toLowerCase()}`}
                    >
                      <option value="Haute">Haute</option>
                      <option value="Moyenne">Moyenne</option>
                      <option value="Basse">Basse</option>
                    </select>
                  </td>
                  <td>{task.category}</td>
                  <td>
                    {editingDate.taskId === task.id && editingDate.field === 'date' ? (
                      <div className="date-picker-wrapper">
                        <div className="date-picker-overlay" onClick={handleCancelEdit} />
                        <div className="date-picker-container">
                          <DatePicker
                            selected={editingDate.tempDate}
                            onChange={handleTempDateChange}
                            inline
                          />
                          <div className="date-picker-actions">
                            <button 
                              className="date-picker-btn confirm-btn"
                              onClick={handleConfirmDate}
                            >
                              Valider
                            </button>
                            <button 
                              className="date-picker-btn cancel-btn"
                              onClick={handleCancelEdit}
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span 
                        className="date-field"
                        onClick={() => handleStartEdit(task.id, 'date', task.date)}
                      >
                        {formatDate(task.date)}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingDate.taskId === task.id && editingDate.field === 'deadline' ? (
                      <div className="date-picker-wrapper">
                        <div className="date-picker-overlay" onClick={handleCancelEdit} />
                        <div className="date-picker-container">
                          <DatePicker
                            selected={editingDate.tempDate}
                            onChange={handleTempDateChange}
                            inline
                          />
                          <div className="date-picker-actions">
                            <button 
                              className="date-picker-btn confirm-btn"
                              onClick={handleConfirmDate}
                            >
                              Valider
                            </button>
                            <button 
                              className="date-picker-btn cancel-btn"
                              onClick={handleCancelEdit}
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span 
                        className="date-field"
                        onClick={() => handleStartEdit(task.id, 'deadline', task.deadline)}
                      >
                        {formatDate(task.deadline)}
                      </span>
                    )}
                  </td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className={`status-select ${task.status.toLowerCase().replace(' ', '-')}`}
                    >
                      <option value="À faire">À faire</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                    </select>
                  </td>
                  <td>
                    <div className="task-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditTask(task)}
                      >
                        Modifier
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      {showEditDialog && (
        <div className="edit-dialog-overlay">
          <div className="edit-dialog">
            <h3>Modifier la tâche</h3>
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
                <option value="À faire">À faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
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
    </div>
  );
}