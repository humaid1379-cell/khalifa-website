import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Archive from "./pages/Archive";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/archive"} component={Archive} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
