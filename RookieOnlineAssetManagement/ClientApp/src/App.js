import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './admin/pages/Home';
import User from './admin/pages/user/User';
import CreateUser from './admin/pages/user/CreateUser';
import Asset from './admin/pages/asset/Asset';
import CreateAsset from './admin/pages/asset/CreateAsset';
import EditAsset from './admin/pages/asset/EditAsset';
import Assignment from './admin/pages/assignment/Assignment';
import RequestForReturning from './admin/pages/request/RequestForReturning';
import Report from './admin/pages/report/Report';
import Login from './login/Login';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path='/admin' exact component={Home} />
          <Route path='/admin/users' exact component={User} />
          <Route path='/admin/users/create' component={CreateUser} />
          <Route path='/admin/assets' exact component={Asset} />
          <Route path='/admin/assets/:id/edit' component={EditAsset} />
          <Route path='/admin/assets/create' component={CreateAsset} />
          <Route path='/admin/assignments' exact component={Assignment} />
          <Route
            path='/admin/requests-for-returning'
            exact
            component={RequestForReturning}
          />
          <Route path='/admin/reports' exact component={Report} />
          <Route path='/admin/login' exact component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
