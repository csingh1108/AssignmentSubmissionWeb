import './App.css';
import {useLocalState} from "./util/userLocalStorage";
import {Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard";
import Homepage from "./HomePage";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import AssignmentView from "./AssignmentView";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from "react";
import jwtDecode from "jwt-decode";
import CodeReviewerDashboard from "./CodeReviewerDashboard";
import CodeReviewerAssignmentView from "./CodeReviewerAssignmentView";
import {JwtProvider, useJwt} from "./GlobalState";


function App() {
    //Calls use custom useLocalState method to set and retrieve JWT
    const { jwt }= useJwt();
    const [roles , setRoles] = useState(getRolesFromJWT());

    useEffect(() => {
        setRoles(getRolesFromJWT());
    }, [jwt]);

    function getRolesFromJWT() {
        if(jwt){
            const decoded = jwtDecode(jwt);
            return decoded.authorities;
        } else {
            return [];
        }

    }
  return (
      <Routes>
          <Route path="/dashboard"
                 element={
                    roles.find((role) => role === "ROLE_CODE_REVIEWER") ? (
                          <PrivateRoute>
                              <CodeReviewerDashboard/>
                          </PrivateRoute>

              ) : (
                      <PrivateRoute>
                          <Dashboard/>
                      </PrivateRoute>
              )
                }
          />
          <Route path="/assignments/:assignmentId"
                 element={
                     roles.find((role) => role === "ROLE_CODE_REVIEWER") ? (
                         <PrivateRoute>
                             <CodeReviewerAssignmentView/>
                         </PrivateRoute>
                     ) : (
                      <PrivateRoute>
                          <AssignmentView/>
                      </PrivateRoute>
                     )
            }>
          </Route>
          <Route path="/login" element={ <Login/> } />
          <Route path="/" element={ <Homepage/> } />
      </Routes>

  );
}

export default App;
