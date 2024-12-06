import { useState } from "react";
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { toPng } from 'html-to-image';
import { TodoItem } from "./TodoItem";
import { Todo } from "@/types/todo";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        { 
          id: Date.now(), 
          text: input.trim(), 
          status: "pending",
          createdAt: new Date(),
          totalTimeMs: 0
        },
      ]);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const updateTodoStatus = (id: number, status: Todo["status"]) => {
    setTodos(todos.map((todo) => {
      if (todo.id === id) {
        if (status === "working") {
          const now = new Date();
          if (todo.status === "working") {
            return todo; // No change if already working
          }
          return { 
            ...todo, 
            status, 
            startedAt: now,
          };
        }
        if (status === "completed" && todo.status === "working" && todo.startedAt) {
          const now = new Date();
          const currentSession = now.getTime() - todo.startedAt.getTime();
          return { 
            ...todo, 
            status, 
            completedAt: now,
            totalTimeMs: todo.totalTimeMs + currentSession
          };
        }
        return { ...todo, status };
      }
      return todo;
    }));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const exportTodoList = async () => {
    const root = document.getElementById('root');
    if (root) {
      try {
        const dataUrl = await toPng(root, {
          quality: 0.95,
          style: {
            transform: 'scale(1)',
          },
        });
        const link = document.createElement('a');
        link.download = `todo-list-${format(new Date(), 'yyyy-MM-dd')}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export todo list:', err);
      }
    }
  };

  const completedTasks = todos.filter(todo => todo.status === "completed").length;
  const totalTasks = todos.length;

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-['Dancing_Script'] font-bold mb-2 animate-pulse bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          {format(new Date(), 'EEEE')}
        </h2>
        <h3 className="text-xl font-['Dancing_Script'] animate-pulse bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          {format(new Date(), 'MMMM d, yyyy')}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="transition-all duration-200 focus:ring-2 focus:ring-primary flex-1 bg-background/50 backdrop-blur-sm border-2"
        />
        <Tooltip content="Add new task">
          <Button
            onClick={addTodo}
            className="transition-all duration-200 hover:scale-105 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </Tooltip>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={todos} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                updateTodoStatus={updateTodoStatus}
                removeTodo={removeTodo}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {todos.length > 0 && (
        <div className="flex justify-center mt-6">
          <Tooltip content="Export as image">
            <Button
              variant="outline"
              onClick={exportTodoList}
              className="transition-all duration-200 hover:scale-105"
            >
              <Download className="w-4 h-4 mr-2" />
              Export My Day
            </Button>
          </Tooltip>
        </div>
      )}
    </div>
  );
}