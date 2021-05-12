import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Asset from './admin/pages/asset/Asset';
import Report from './admin/pages/report/Report';
import RequestForReturning from './admin/pages/request/RequestForReturning';
import Home from './admin/pages/Home';
import User from './admin/pages/user/User';
import AssetManagement from './admin/pages/asset/AssetManagement';
import Login from './login/Login';

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path='/admin' exact component={AssetManagement} />
          <Route path='/admin/home' component={Home} />
          <Route path='/admin/users' component={User} />
          <Route path='/admin/assets' component={Asset} />
          <Route path='/admin/assignments' component={AssetManagement} />
          <Route
            path='/admin/requests-for-returning'
            component={RequestForReturning}
          />
          <Route path='/admin/reports' component={Report} />
          <Route path='/admin/login' component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
