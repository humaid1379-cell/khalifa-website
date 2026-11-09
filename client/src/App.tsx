import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { lazy, Suspense, useEffect } from "react";
import "./article.css";

const Admin = lazy(() => import("./pages/Admin"));
const Archive = lazy(() => import("./pages/Archive"));
const Podcast = lazy(() => import("./pages/Podcast"));
const Article = lazy(() => import("./pages/Article"));

function RouteMetadata() {
  const [location] = useLocation();
  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "خليفة جمعة الرميثي | خارج النص",
      "/archive": "أرشيف المقالات | خارج النص",
      "/podcast": "البودكاست | خارج النص",
      "/admin": "إدارة الموقع | خارج النص",
    };
    document.title =
      titles[location] ||
      (location.startsWith("/articles/")
        ? "المقال | خارج النص"
        : "الصفحة غير موجودة | خارج النص");
    const url = `https://khaleefa-alromaithi11.ae${location === "/" ? "/" : location}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", url);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:type"]')
      ?.setAttribute(
        "content",
        location.startsWith("/articles/") ? "article" : "website"
      );
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute(
        "content",
        location === "/admin" ||
          (!titles[location] && !location.startsWith("/articles/"))
          ? "noindex,nofollow"
          : "index,follow"
      );
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "قراءات في السياسة والاقتصاد والمجتمع بقلم خليفة جمعة الرميثي."
      );
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute(
        "content",
        "قراءات في السياسة والاقتصاد والمجتمع بقلم خليفة جمعة الرميثي."
      );
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1efd6]">
      <div className="flex flex-col items-center gap-3" role="status">
        <div className="w-8 h-8 rounded-full border-2 border-[#87b0b6] border-t-transparent animate-spin" />
        <span className="font-[Amiri] text-sm text-[#455a5d]">
          جاري التحميل...
        </span>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin">
        <Suspense fallback={<PageLoader />}>
          <Admin />
        </Suspense>
      </Route>
      <Route path="/archive">
        <Suspense fallback={<PageLoader />}>
          <Archive />
        </Suspense>
      </Route>
      <Route path="/articles/:id">
        {params => (
          <Suspense fallback={<PageLoader />}>
            <Article params={params} />
          </Suspense>
        )}
      </Route>
      <Route path="/podcast">
        <Suspense fallback={<PageLoader />}>
          <Podcast />
        </Suspense>
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
          <RouteMetadata />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
