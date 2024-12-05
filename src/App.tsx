import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TodoList } from "@/components/TodoList";
import { CheckSquare, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen w-screen bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-950 text-foreground">
        <div className="min-h-screen w-screen backdrop-blur-[2px] bg-background/40">
          <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen max-w-3xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-bounce" />
                <h1 className="text-3xl sm:text-4xl font-bold font-['Satisfy'] tracking-wide animate-pulse bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  *Let's Do It
                </h1>
              </div>
              <ThemeToggle />
            </div>
            
            <div className="flex-grow flex items-center justify-center w-full px-4 sm:px-6 lg:px-8">
              <TodoList />
            </div>

            <div className="flex justify-center mt-8">
              <Tooltip content="Visit my GitHub">
                <Button
                  variant="ghost"
                  className="group transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <a
                    href="https://github.com/Manish-Let-It-Be"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Github className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-12" />
                    <span>by Manish</span>
                  </a>
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
