import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation, useSearch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  applyPageMetadata,
  getPageMetadata,
  type ReaderMetadataState,
} from "@/lib/routeMetadata";
import "./article.css";

const Admin = lazy(() => import("./pages/Admin"));
const Archive = lazy(() => import("./pages/Archive"));
const Podcast = lazy(() => import("./pages/Podcast"));
const Article = lazy(() => import("./pages/Article"));

function RouteMetadata({ reader }: { reader?: ReaderMetadataState }) {
  const [location] = useLocation();
  const search = useSearch();
  useLayoutEffect(() => {
    applyPageMetadata(getPageMetadata(location, search, reader));
  }, [location, search, reader]);
  return null;
}

function RouteScroll() {
  const [location] = useLocation();
  const restoredUrl = useRef("");
  useEffect(() => {
    const rememberHistoryNavigation = () => {
      restoredUrl.current = window.location.href;
    };
    window.addEventListener("popstate", rememberHistoryNavigation, true);
    return () =>
      window.removeEventListener("popstate", rememberHistoryNavigation, true);
  }, []);
  useEffect(() => {
    let observer: MutationObserver | undefined;
    const scrollToHash = () => {
      observer?.disconnect();
      if (!window.location.hash) return false;
      let id: string;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return false;
      }
      const revealTarget = () => {
        const target = document.getElementById(id);
        if (!target) return false;
        target.scrollIntoView({ behavior: "instant", block: "start" });
        observer?.disconnect();
        return true;
      };
      if (!revealTarget()) {
        observer = new MutationObserver(revealTarget);
        observer.observe(document.getElementById("root") || document.body, {
          childList: true,
          subtree: true,
        });
      }
      return true;
    };
    if (!scrollToHash() && restoredUrl.current !== window.location.href)
      window.scrollTo({ top: 0, behavior: "instant" });
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      observer?.disconnect();
      window.removeEventListener("hashchange", scrollToHash);
    };
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

function Router({
  onReaderState,
}: {
  onReaderState: (state: ReaderMetadataState) => void;
}) {
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
            <Article
              key={params.id}
              params={params}
              onMetadata={onReaderState}
            />
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
  const [reader, setReader] = useState<ReaderMetadataState>();
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <RouteMetadata reader={reader} />
        <RouteScroll />
        <Router onReaderState={setReader} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
