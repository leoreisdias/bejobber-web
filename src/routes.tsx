import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Landing from './pages/Landing'
import JobberMaps from './pages/JobberMaps';
import Jobber from './pages/Jobber';
import CreateJobber from './pages/CreateJobber';

function Routers() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/app" component={JobberMaps} />

                <Route path="/jobber/create" component={CreateJobber} />
                <Route path="/jobber/:id" component={Jobber} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routers;