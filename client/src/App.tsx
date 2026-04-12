import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { lazy, Suspense } from "react";

const Admin = lazy(() => import("./pages/Admin"));
const Archive = lazy(() => import("./pages/Archive"));
const Podcast = lazy(() => import("./pages/Podcast"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1efd6]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#87b0b6] border-t-transparent animate-spin" />
        <span className="font-[Amiri] text-sm text-[#5a7275]">جاري التحميل...</span>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin">
        <Suspense fallback={<PageLoader />}><Admin /></Suspense>
      </Route>
      <Route path="/archive">
        <Suspense fallback={<PageLoader />}><Archive /></Suspense>
      </Route>
      <Route path="/podcast">
        <Suspense fallback={<PageLoader />}><Podcast /></Suspense>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
