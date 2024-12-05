import { useState } from "react";
import { Check, Loader2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Todo = {
  id: number;
  text: string;
  status: "pending" | "working" | "completed";
};

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: input.trim(), status: "pending" },
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
    setTodos(todos.map((todo) => 
      todo.id === id ? { ...todo, status } : todo
    ));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="transition-all duration-200 focus:ring-2 focus:ring-primary flex-1"
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

      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={cn(
              "flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg transition-all duration-200 gap-2 sm:gap-4",
              "bg-background/90 border hover:shadow-md",
              todo.status === "working" && "border-blue-500 bg-blue-50/90 dark:bg-blue-950/90",
              todo.status === "completed" && "border-green-500 bg-green-50/90 dark:bg-green-950/90"
            )}
          >
            <span className={cn(
              "transition-all duration-200 break-words w-full sm:w-auto",
              todo.status === "completed" && "line-through text-muted-foreground"
            )}>
              {todo.text}
            </span>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
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
        ))}
      </div>
    </div>
  );
}