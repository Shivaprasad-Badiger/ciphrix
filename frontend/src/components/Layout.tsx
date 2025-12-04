import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <ListTodo className="h-5 w-5" />
            <span>Task Manager</span>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.name}
                </span>
                {isAdmin && (
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    Admin
                  </Badge>
                )}
              </div>
            )}
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">{children}</main>
    </div>
  );
}
