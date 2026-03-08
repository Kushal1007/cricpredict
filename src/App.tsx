import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import LandingPage from "@/pages/LandingPage";
import { LoginPage, SignupPage } from "@/pages/AuthPages";
import Dashboard from "@/pages/Dashboard";
import LiveMatchPage from "@/pages/LiveMatchPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import ProfilePage from "@/pages/ProfilePage";
import GuidePage from "@/pages/GuidePage";


const queryClient = new QueryClient();

const AppRouter = () => {
  const { currentPage, showCoinAnimation, coinAnimationAmount, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl animate-bounce">🏏</div>
          <div className="font-rajdhani text-xl font-bold neon-text-green">Loading CricPredict…</div>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <LandingPage />;
      case 'login': return <LoginPage />;
      case 'signup': return <SignupPage />;
      case 'dashboard': return <Dashboard />;
      case 'matches': return <Dashboard />;
      case 'live-match': return <LiveMatchPage />;
      case 'leaderboard': return <LeaderboardPage />;
      case 'profile': return <ProfilePage />;
      case 'guide': return <GuidePage />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {renderPage()}
      {showCoinAnimation && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-fade-in-up">
          <div className="flex flex-col items-center gap-2">
            <div className="text-6xl coin-bounce">🪙</div>
            <div className="font-rajdhani text-4xl font-bold text-yellow-400 shadow-neon-green">
              +{coinAnimationAmount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <AppRouter />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
