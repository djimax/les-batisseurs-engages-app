import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, User, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: Date;
  progress: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  startDate: Date;
  endDate?: Date;
  status: "active" | "completed" | "on-hold";
}

interface ProjectKanbanProps {
  projects: Project[];
  onAddTask?: (projectId: string, task: Task) => void;
  onUpdateTask?: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (projectId: string, taskId: string) => void;
}

const statusConfig = {
  todo: { label: "À faire", color: "bg-gray-100 dark:bg-gray-900", textColor: "text-gray-700 dark:text-gray-300" },
  "in-progress": { label: "En cours", color: "bg-blue-100 dark:bg-blue-900/30", textColor: "text-blue-700 dark:text-blue-300" },
  review: { label: "En révision", color: "bg-amber-100 dark:bg-amber-900/30", textColor: "text-amber-700 dark:text-amber-300" },
  done: { label: "Terminé", color: "bg-emerald-100 dark:bg-emerald-900/30", textColor: "text-emerald-700 dark:text-emerald-300" },
};

const priorityConfig = {
  low: { label: "Basse", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  medium: { label: "Moyenne", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  high: { label: "Haute", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};

export function ProjectKanban({
  projects,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: ProjectKanbanProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );

  const currentProject = projects.find((p) => p.id === selectedProject);

  if (!currentProject) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucun projet disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tasksByStatus = {
    todo: currentProject.tasks.filter((t) => t.status === "todo"),
    "in-progress": currentProject.tasks.filter((t) => t.status === "in-progress"),
    review: currentProject.tasks.filter((t) => t.status === "review"),
    done: currentProject.tasks.filter((t) => t.status === "done"),
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-emerald-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de Projet */}
      <Card>
        <CardHeader>
          <CardTitle>Projets de l'Association</CardTitle>
          <CardDescription>Sélectionnez un projet pour voir les tâches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {projects.map((project) => (
              <Button
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                variant={selectedProject === project.id ? "default" : "outline"}
                className="gap-2"
              >
                {project.name}
                <Badge 
                  className={`${
                    project.status === "active" 
                      ? "bg-emerald-100 text-emerald-800" 
                      : project.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {project.status === "active" ? "Actif" : project.status === "completed" ? "Terminé" : "En attente"}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informations du Projet */}
      <Card>
        <CardHeader>
          <CardTitle>{currentProject.name}</CardTitle>
          <CardDescription>{currentProject.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date de début</p>
              <p className="font-semibold">
                {new Date(currentProject.startDate).toLocaleDateString("fr-FR")}
              </p>
            </div>
            {currentProject.endDate && (
              <div>
                <p className="text-sm text-muted-foreground">Date de fin prévue</p>
                <p className="font-semibold">
                  {new Date(currentProject.endDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <Badge className={`${
                currentProject.status === "active" 
                  ? "bg-emerald-100 text-emerald-800" 
                  : currentProject.status === "completed"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
                {currentProject.status === "active" ? "Actif" : currentProject.status === "completed" ? "Terminé" : "En attente"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => (
          <Card key={status} className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {statusConfig[status].label}
                <Badge variant="outline">{tasksByStatus[status].length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              {tasksByStatus[status].map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${statusConfig[status].color} space-y-2`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => onDeleteTask?.(currentProject.id, task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Priorité */}
                  <Badge className={priorityConfig[task.priority].color}>
                    {priorityConfig[task.priority].label}
                  </Badge>

                  {/* Assigné */}
                  {task.assignee && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {task.assignee}
                    </div>
                  )}

                  {/* Date d'échéance */}
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                    </div>
                  )}

                  {/* Barre de progression */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Progression</span>
                      <span className="font-semibold">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(task.progress)}`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Bouton Ajouter une tâche */}
              <Button
                onClick={() => {
                  const newTask: Task = {
                    id: `task-${Date.now()}`,
                    title: "Nouvelle tâche",
                    description: "",
                    status,
                    priority: "medium",
                    progress: 0,
                  };
                  onAddTask?.(currentProject.id, newTask);
                }}
                variant="outline"
                size="sm"
                className="w-full gap-2 mt-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistiques du Projet */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques du Projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{currentProject.tasks.length}</p>
              <p className="text-xs text-muted-foreground">Tâches totales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{tasksByStatus.done.length}</p>
              <p className="text-xs text-muted-foreground">Terminées</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{tasksByStatus["in-progress"].length}</p>
              <p className="text-xs text-muted-foreground">En cours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{tasksByStatus.todo.length}</p>
              <p className="text-xs text-muted-foreground">À faire</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
