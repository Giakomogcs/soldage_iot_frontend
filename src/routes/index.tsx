import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';
import SignIn from '../pages/SignIn';
import Users from '../pages/AdminConfig/Users';
import Dashboard from '../pages/Dashboard';
import ManageUsers from '../pages/AdminConfig/Users/ManageUsers';
import Machines from '../pages/AdminConfig/Machines';
import ManageMachines from '../pages/AdminConfig/Machines/ManageMachines';
import ForgotPassword from '../pages/Password/ForgotPassword';
import ResetPassword from '../pages/Password/ResetPassword';
import Reports from '../pages/Reports';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/app" exact component={SignIn} />
      <Route path="/app/dashboard" exact component={Dashboard} isPrivate />
      <Route path="/app/users" exact component={Users} isPrivate />
      <Route path="/app/machines" exact component={Machines} isPrivate />
      <Route path="/app/users/manage/" exact component={ManageUsers} isPrivate />
      <Route path="/app/machines/manage/" exact component={ManageMachines} isPrivate />
      <Route path="/app/users/manage/:user_id" exact component={ManageUsers} isPrivate />
      <Route path="/app/machines/manage/:machine_id" exact component={ManageMachines} isPrivate />
      <Route path="/app/passwords/forgot" exact component={ForgotPassword} />
      <Route path="/app/passwords/reset" exact component={ResetPassword} />
      <Route path="/app/reports" exact component={Reports} isPrivate />
    </Switch>
  );
};

export default Routes;
