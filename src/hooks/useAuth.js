import { useContext } from "react";
import { AuthContext } from "../contexts/auth";

// hook para aplicação acessar o contexto de login
const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
}

export default useAuth;