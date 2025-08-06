import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/Kanban.css";
import '../styles/dark-mode.css';

// Remplacez le composant par celui-ci pour accepter la prop 'token'
export default function KanbanBoard({ onLogout, token }) {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDate, setEditingDate] = useState({ taskId: null, field: null, tempDate: null, originalDate: null });
  const [editingTask, setEditingTask] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  
  // N'oubliez pas les statuses
  const statuses = ["À faire", "En cours", "Terminé", "Annulé"];

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  // Chargement initial des tâches
  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) {
        console.warn("Pas de token d'authentification.");
        setTasks([]);
        return;
      }
      try {
        const response = await fetch("http://localhost:8000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 401) {
          console.error("Session expirée, déconnexion...");
          onLogout();
          return;
        }
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des tâches");
        }
        const data = await response.json();
        const formattedTasks = data.map(task => ({
          ...task,
          date: task.date ? new Date(task.date) : null,
          deadline: task.deadline ? new Date(task.deadline) : null,
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchTasks();
  }, [token, onLogout]);

  // Gestion du drag-and-drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      const taskId = parseInt(draggableId);
      const newStatus = destination.droppableId;
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      // Mise à jour optimiste
      const originalTasks = tasks;
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));

      fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <-- CORRECTION: Utiliser la prop 'token'
        },
        body: JSON.stringify({ 
          ...taskToUpdate, 
          status: newStatus,
          date: taskToUpdate.date?.toISOString().split('T')[0] || null,
          deadline: taskToUpdate.deadline?.toISOString().split('T')[0] || null,
        }),
      })
      .then(res => {
        if (res.status === 401) throw new Error("Unauthorized");
        if (!res.ok) throw new Error("Erreur mise à jour tâche");
        return res.json();
      })
      .then(() => {}) // Rien à faire si la requête réussit
      .catch(err => {
        console.error(err);
        alert("Erreur lors de la mise à jour de la tâche");
        setTasks(originalTasks); // Annule la modification locale
        if (err.message === "Unauthorized") onLogout();
      });
    }
  };

  // Ajout de la fonction pour ouvrir la modale d'édition
  const handleEditTask = (taskToEdit) => {
    setIsEditing(true);
    setEditingTask({
      ...taskToEdit,
      date: taskToEdit.date ? new Date(taskToEdit.date) : null,
      deadline: taskToEdit.deadline ? new Date(taskToEdit.deadline) : null,
    });
    setShowEditDialog(true);
  };
  
  // Ajout de la fonction de suppression de tâche
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // <-- CORRECTION: Utiliser la prop 'token'
        },
      });
      if (res.status === 401) {
        alert("Session expirée, veuillez vous reconnecter.");
        onLogout();
        return;
      }
      if (!res.ok) throw new Error("Erreur lors de la suppression de la tâche");
      setTasks(tasks.filter(task => task.id !== taskId));
      alert("Tâche supprimée avec succès.");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression: " + error.message);
    }
  };
  
  // Ajout de la fonction d'annulation pour l'édition de date
  const handleCancelEdit = () => {
    setEditingDate({ taskId: null, field: null, tempDate: null, originalDate: null });
  };
  
  const handleSaveTask = async () => {

    if (!editingTask || !editingTask.title || !editingTask.status || !editingTask.priority) {

      alert("Veuillez remplir au moins le titre, le statut et la priorité.");

      return;

    }



    try {

      const taskData = {

        title: editingTask.title,

        description: editingTask.description,

        status: editingTask.status,

        priority: editingTask.priority,

        category: editingTask.category,

        // Conversion des dates au format ISO (YYYY-MM-DD)

        date: editingTask.date?.toISOString().split("T")[0] || null,

        deadline: editingTask.deadline?.toISOString().split("T")[0] || null,

      };



      const url = isEditing ? `http://localhost:8000/api/tasks/${editingTask.id}` : "http://localhost:8000/api/tasks";

      const method = isEditing ? "PUT" : "POST";



      const res = await fetch(url, {

        method,

        headers: {

          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`, // <-- N'oubliez pas le token

        },

        body: JSON.stringify(taskData),

      });



      if (res.status === 401) {

        alert("Session expirée, veuillez vous reconnecter.");

        onLogout();

        return;

      }



      if (!res.ok) {

        throw new Error("Erreur lors de la sauvegarde de la tâche");

      }



      const savedTask = await res.json();



      if (isEditing) {

        // Mise à jour de la tâche existante

        setTasks(tasks.map((task) => (task.id === savedTask.id ? savedTask : task)));

      } else {

        // Ajout de la nouvelle tâche

        setTasks([...tasks, {

          ...savedTask,

          date: savedTask.date ? new Date(savedTask.date) : null,

          deadline: savedTask.deadline ? new Date(savedTask.deadline) : null,

        }]);

      }

      setShowEditDialog(false);

      setEditingTask(null);

    } catch (error) {

      console.error("Erreur:", error);

      alert("Erreur lors de la sauvegarde: " + error.message);

    }

  };

  const handleCancelEditTask = () => {
    setShowEditDialog(false);
    setEditingTask(null);
  };

  const handleTaskFieldChange = (field, value) => {
    setEditingTask(prev => ({ ...prev, [field]: value }));
  };
  const handlePriorityChange = (taskId, newPriority) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
  };
  const handleTempDateChange = (date) => {
    setEditingDate(prev => ({ ...prev, tempDate: date }));
  };
  const handleStartEdit = (taskId, field, currentDate) => {
    setEditingDate({ taskId, field, tempDate: currentDate, originalDate: currentDate });
  };
const handleConfirmDate = async () => {
    const { taskId, field, tempDate, originalDate } = editingDate;

    // Mise à jour optimiste de l'état local (l'utilisateur voit le changement immédiatement)
    setTasks(prevTasks =>
        prevTasks.map(task =>
            task.id === taskId ? { ...task, [field]: tempDate } : task
        )
    );
    setEditingDate({ taskId: null, field: null, tempDate: null, originalDate: null });

    // Récupération de la tâche pour envoyer au serveur
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) {
        console.error("Tâche non trouvée.");
        return;
    }

    try {
        const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...taskToUpdate,
                // Le format de la date doit être YYYY-MM-DD pour le backend
                date: field === 'date' ? tempDate?.toISOString().split('T')[0] || null : taskToUpdate.date?.toISOString().split('T')[0] || null,
                deadline: field === 'deadline' ? tempDate?.toISOString().split('T')[0] || null : taskToUpdate.deadline?.toISOString().split('T')[0] || null,
            }),
        });

        if (res.status === 401) {
            alert("Session expirée, veuillez vous reconnecter.");
            onLogout();
            return;
        }

        if (!res.ok) {
            throw new Error("Erreur lors de la mise à jour de la date sur le serveur.");
        }
        
        // Si la requête réussit, rien d'autre à faire car l'état local est déjà à jour.
        alert("Date mise à jour avec succès.");
        
    } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la mise à jour de la date: " + error.message);
        
        // En cas d'erreur, on annule la modification locale pour resynchroniser l'interface avec la BDD
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, [field]: originalDate } : task
            )
        );
    }
};
  const formatDate = (date) => {
    if (!date) return "Non définie";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.status?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = filterPriority ? task.priority === filterPriority : true;
    const matchStatus = filterStatus ? task.status === filterStatus : true;
    const matchCategory = filterCategory ? task.category === filterCategory : true;
    return matchSearch && matchPriority && matchStatus && matchCategory;
  });

  return (
    <div className="kanban-container">
      <h3>Espace Utilisateur</h3>
      <h3>Espace Utilisateur</h3>
      <h3>Espace Utilisateur</h3>
      <h3>Espace Utilisateur</h3>
      <h3>Espace Utilisateur</h3>
      <h3>Espace Utilisateur</h3>
      <h3>Espace Utilisateur</h3>
      <h3>Espace Utilisateur</h3>
      <h3>Espace Utilisateur</h3>
      <h3>Espace Utilisateur</h3>
      <h3>Espace Utilisateur</h3>
      <h3>Espace Utilisateur</h3>
      <h3>Espace Utilisateur</h3>
      {/* ----------- BOUTON BASCULE MODE CLAIR/SOMBRE ----------- */}
      <button
        onClick={() => setIsDarkMode(prev => !prev)}
        style={{
          marginBottom: "15px",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          backgroundColor: isDarkMode ? "#8f81ae" : "#6a1b9a",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {isDarkMode ? "Mode Clair" : "Mode Sombre"}
      </button>

      <header className="kanban-header">
        <h1>Espace Utilisateur</h1>
        <nav>
          <ul>
            <li>Mes Tâches</li>
            <li onClick={onLogout} style={{ cursor: "pointer" }}>Se déconnecter</li>
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
            <option value="Annulé">Annulé</option>
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
                <div className="kanban-column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h3 className="column-header">{status}</h3>
                  <div className="tasks-list">
                    {filteredTasks
                      .filter(task => task.status === status)
                      .map((task, index) => {
                        const now = new Date();
                        const isOverdue = task.deadline && task.deadline < now && task.status !== "Terminé";
                        const isUpcoming = task.deadline && task.deadline > now && task.status !== "Terminé";
                        const daysUntilDeadline = task.deadline ? Math.ceil((task.deadline - now) / (1000 * 60 * 60 * 24)) : null;
                        const deadlineClass = 
                          isOverdue ? 'overdue-bg' : 
                          daysUntilDeadline <= 3 ? 'urgent-bg' : 
                          daysUntilDeadline <= 6 ? 'warning-bg' : 
                          '';

                        return (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`task-card ${task.priority?.toLowerCase() || ''} ${task.animate ? "status-changed" : ""} ${deadlineClass}`}
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
                                {isOverdue && (
                                  <p className="reminder overdue-text">
                                    ⚠️ En retard depuis {Math.abs(daysUntilDeadline)} jour{Math.abs(daysUntilDeadline) > 1 ? 's' : ''}
                                  </p>
                                )}
                                {daysUntilDeadline <= 6 && daysUntilDeadline > 0 && !isOverdue && (
                                  <p className={`reminder ${daysUntilDeadline <= 3 ? 'urgent-text' : 'warning-text'}`}>
                                    ⏳ J-{daysUntilDeadline} {daysUntilDeadline <= 3 ? 'Échéance imminente' : 'Échéance approche'}
                                  </p>
                                )}
                                <div className="task-actions">
                                  <button onClick={() => handleEditTask(task)}>Modifier</button>
                                  <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
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
          setIsEditing(false); // ← on indique qu'on ajoute une nouvelle tâche
          setEditingTask({
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

      {showEditDialog && (
        <div className="edit-dialog-overlay">
          <div className="edit-dialog">
            <h3>{isEditing ? "Modifier la tâche" : "Ajouter une tâche"}</h3>
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

            <div className="form-groupN">
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
              <select
                value={editingTask.category}
                onChange={(e) => handleTaskFieldChange('category', e.target.value)}
              >
                <option value="Travail">Travail</option>
                <option value="Personnel">Personnel</option>
                <option value="Autre">Autre</option>
              </select>
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
              <button className="cancel-btn" onClick={handleCancelEditTask}>Annuler</button>
              <button className="confirm-btn" onClick={handleSaveTask}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

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