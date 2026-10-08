import { Navigate } from "react-router-dom";
function ProtectedRoute({ children}){
    const token=localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!token || isLoggedIn !=='true'){
        //no token=kick out to login
        return<Navigate to="/login" replace/>
    }
    return children;
}
export default ProtectedRoute;
