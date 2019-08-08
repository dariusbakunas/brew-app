import React from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { UserStatus } from "../types";
import Footer from "./components/Footer";
import ErrorBoundary from "./errors/ErrorBoundary";
import withServerContext from "./HOC/withServerContext";
import Activate from "./pages/Activate";
import Login from "./pages/Login";
import Main from "./pages/MainPage";
import Privacy from "./pages/PrivacyPage";
import SignUp from "./pages/SignUp";
import Terms from "./pages/Terms";

type AppProps = RouteComponentProps<any> & {
  location: {
    pathname: string;
  };
  user: {
    email: string;
    firstName: string;
    lastName: string;
    status: UserStatus;
  };
};

const App: React.FunctionComponent<AppProps> = () => {
  return (
    <ErrorBoundary>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={SignUp} />
        <Route path="/activate" component={Activate} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/" component={Main} />
      </Switch>
      <Footer />
    </ErrorBoundary>
  );
};

export default withServerContext(withRouter(App));
