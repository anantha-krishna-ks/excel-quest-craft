import { useState } from "react";
import { Header } from "@/components/Header";
import { AuthForm } from "@/components/AuthForm";
import { QuizCreator } from "@/components/QuizCreator";
import { QuizPreview } from "@/components/QuizPreview";

interface User {
  name: string;
  email: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [view, setView] = useState<'create' | 'preview'>('create');

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentQuiz(null);
    setView('create');
  };

  const handleCreateQuiz = (quizData: any) => {
    setCurrentQuiz(quizData);
    setView('preview');
  };

  const handleEditQuiz = () => {
    setView('create');
  };

  const handleSaveQuiz = () => {
    // Simulate saving quiz
    console.log('Quiz saved successfully!');
  };

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-6 py-8">
        {view === 'create' ? (
          <QuizCreator onCreateQuiz={handleCreateQuiz} />
        ) : (
          <QuizPreview 
            quiz={currentQuiz} 
            onEdit={handleEditQuiz}
            onSave={handleSaveQuiz}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
