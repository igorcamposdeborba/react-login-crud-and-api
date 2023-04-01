import { createContext, useEffect, useState } from "react";

// salvar se usuário está logado criando um contexto da sessão
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(); // declarar state para o usuário para eu poder comparar e salvar os dados do user com o State da aplicação

    // Sempre que carregar a aplicação, verificar se o usuário está logado com o token e identifique o usuário pelo e-mail
    useEffect(() => {
        const userToken = localStorage.getItem("user_token");
        const usersStorage = localStorage.getItem("users_db");

        if (userToken && usersStorage) {
            const hasUser = JSON.parse(usersStorage)?.filter(
                (user) => user.email === JSON.parse(userToken).email
            );
            if (hasUser) {
                setUser(hasUser[0]);
                localStorage.setItem("user_token", JSON.stringify({ email: hasUser[0].email, token: JSON.parse(userToken).token }));
            }
        }

    }, []);
    
   
    // método para LOGAR usuário
    const signin = (email, password) => {
        const usersStorage = JSON.parse(localStorage.getItem("users_db"));
        const hasUser = usersStorage?.filter((user) => user.email == email); // verificar se tem um e-mail cadastrado

        if(hasUser?.length){ // validar se e-mail e senha são válidos
            if (hasUser[0].email === email && hasUser[0].password === password ){
                const token = Math.random().toString(36).substring(2); // gerar token aleatório
                localStorage.setItem("user_token", JSON.stringify({ email, token })); // salvar email e token no localStorage p/ o usuário logado

                setUser({ email, password }); 
                return;
            } else {
                return "E-mail ou senha incorretos";
            }
        } else {
            return "Usuário não cadastrado";
        }
    }


    // método para CADASTRAR usuário
    const signup = (email, password) => {
        const usersStorage = JSON.parse(localStorage.getItem("users_db")); // pegar usuários do localStorage 
        const hasUser = usersStorage?.filter((user) => user.email === email); // verificar se tem um e-mail cadastrado

        if (hasUser?.length) {
            return "Já existe um conta com esse e-mail";
        
        } else {
            let valPassword = validatePassword(password)
            if (valPassword?.length) { // função que valida mínimo de caracteres
                return valPassword;
            }

            let newUser;
            if (usersStorage){
                newUser = [...usersStorage, {email, password}]; // adicionar usuário se já tiver uma lista de usuários no localStorage
            } else {                                           // (para não sobrescrever).
                newUser = [{ email, password }]; // adicionar usuário se for o primeiro usuário da lista. 
            }
            localStorage.setItem("users_db", JSON.stringify(newUser)); // salvar novo usuário no localStorage

            return;
        }
    }

    // validar mínimo de caracteres da senha
    const validatePassword = (password) => {
        if (password.length < 6) {
            return "Digite uma senha com no mínimo 6 caracteres";  
        }
    }

    // método para LOGOUT
    const signout = () => {
        const userToken = localStorage.getItem("user_token");
        if (userToken) {
          localStorage.removeItem("user_token");
          setUser(null);
        }
      };

                                                      // !!user verifica se existe um usuário, para passar os métodos signin, signup, signout 
    return <AuthContext.Provider value = {{user, signed: !!user, signin, signup, signout }}>  
                                  {children} </AuthContext.Provider>; // Todos os filhos da tag AuthContext.Provider têm acesso ao contexto
                                                                      // sem precisar passar por parâmetro props a página  
                                                                      // para validar se  estou logado
}