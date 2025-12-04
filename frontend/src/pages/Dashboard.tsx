import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { TaskForm } from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task, TaskFormData, TasksResponse, Pagination } from '@/types';

export function Dashboard() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [error, setError] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await api.get<TasksResponse>(`/tasks?${params}`);
      setTasks(response.data.data.tasks);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Fetch tasks error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handleFormSubmit = async (data: TaskFormData) => {
    setIsFormLoading(true);
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, data);
      } else {
        await api.post('/tasks', data);
      }
      setIsFormOpen(false);
      setEditingTask(null);
      await fetchTasks();
    } catch (err) {
      console.error('Form submit error:', err);
      throw err;
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleStatusToggle = async (task: Task) => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      await api.patch(`/tasks/${task._id}/status`, { status: newStatus });
      await fetchTasks();
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchTasks();
    } catch (err) {
      console.error('Delete task error:', err);
    }
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your tasks and track your progress
            </p>
          </div>
          <Button onClick={openAddForm} className="sm:w-auto w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          {pagination && (
            <span className="text-sm text-muted-foreground ml-auto">
              {pagination.totalTasks} task{pagination.totalTasks !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {error && (
          <div className="p-4 text-destructive bg-destructive/10 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No tasks found</p>
              <Button onClick={openAddForm} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create your first task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.status === 'Completed'}
                        onCheckedChange={() => handleStatusToggle(task)}
                        className="mt-1"
                        aria-label={`Mark "${task.title}" as ${task.status === 'Completed' ? 'pending' : 'completed'}`}
                      />
                      <div className="space-y-1">
                        <CardTitle
                          className={`text-lg ${
                            task.status === 'Completed'
                              ? 'line-through text-muted-foreground'
                              : ''
                          }`}
                        >
                          {task.title}
                        </CardTitle>
                        {task.description && (
                          <CardDescription className="line-clamp-2">
                            {task.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>

                    <Badge
                      variant={task.status === 'Completed' ? 'success' : 'warning'}
                    >
                      {task.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Created {formatDate(task.createdAt)}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditForm(task)}
                        aria-label={`Edit "${task.title}"`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(task._id)}
                          className="text-destructive hover:text-destructive"
                          aria-label={`Delete "${task.title}"`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={!pagination.hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      <TaskForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={handleFormSubmit}
        isLoading={isFormLoading}
      />
    </Layout>
  );
}
