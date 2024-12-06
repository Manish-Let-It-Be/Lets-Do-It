import { Check, Loader2, Trash2, GripVertical, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from "@/types/todo";
import { Timer } from "./Timer";

interface TodoItemProps {
  todo: Todo;
  updateTodoStatus: (id: number, status: Todo["status"]) => void;
  removeTodo: (id: number) => void;
}

export function TodoItem({ todo, updateTodoStatus, removeTodo }: TodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatElapsedTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg transition-all duration-200 gap-2 sm:gap-4",
      "bg-background/90 border hover:shadow-md",
      todo.status === "working" && "border-blue-500 bg-blue-50/90 dark:bg-blue-950/90",
      todo.status === "completed" && "border-green-500 bg-green-50/90 dark:bg-green-950/90"
    )}>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex flex-col items-start">
          <span className={cn(
            "transition-all duration-200 break-words",
            todo.status === "completed" && "line-through text-muted-foreground"
          )}>
            {todo.text}
          </span>
          <span className="text-xs text-muted-foreground">
            Created: {format(todo.createdAt, 'MMM d, yyyy HH:mm')}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {todo.status === "working" && todo.startedAt && (
          <Timer 
            startTime={todo.startedAt} 
            isRunning={true} 
            previousTime={todo.totalTimeMs}
          />
        )}
        {todo.status === "completed" && todo.totalTimeMs > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900 rounded-md">
            <Clock className="w-3 h-3 text-green-600 dark:text-green-300" />
            <span className="text-sm font-mono text-green-700 dark:text-green-200">
              {formatElapsedTime(todo.totalTimeMs)}
            </span>
          </div>
        )}
        <Tooltip content="Mark as working">
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateTodoStatus(todo.id, "working")}
            className={cn(
              "transition-all duration-200 hover:scale-105",
              todo.status === "working" && "bg-blue-500 text-white hover:bg-blue-600"
            )}
          >
            <Loader2 className={cn(
              "w-4 h-4",
              todo.status === "working" && "animate-spin"
            )} />
          </Button>
        </Tooltip>
        <Tooltip content="Mark as completed">
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateTodoStatus(todo.id, "completed")}
            className={cn(
              "transition-all duration-200 hover:scale-105",
              todo.status === "completed" && "bg-green-500 text-white hover:bg-green-600"
            )}
          >
            <Check className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Remove task">
          <Button
            size="sm"
            variant="outline"
            onClick={() => removeTodo(todo.id)}
            className="transition-all duration-200 hover:scale-105 hover:bg-red-500 hover:text-white"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}