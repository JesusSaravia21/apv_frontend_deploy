import {useState, useEffect, createContext} from 'react'
import clienteAxios from '../config/axios';


const AuthContext = createContext();

const AuthProvider = ({children}) =>{

    //Aqui definimos los distintos states que formaran parte de nuestra aplicacion de forma global

    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);

    useEffect( () =>{
        const autenticarUsuario = async () =>{

            const token = localStorage.getItem('token');

            //En caso de que no haya algun token dentro de nuestro localstorage evitamos la ejecucion del resta del codigo de esta funcion
            if(!token){
                setCargando(false);
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            try {

                const {data} = await clienteAxios('/veterinarios/perfil', config); 
                console.log('data: ',data)
                //En caso de que el usuario se haya autenticado correctamente
                setAuth(data);
            } catch (error) {
                console.log(error.response.data.msg);
                setAuth({});
            }

            setCargando(false);



        }

        autenticarUsuario();
    }, []);

    const cerrarSesion = () =>{
        localStorage.removeItem('token');
        setAuth({});
    }

    const actualizarPerfil = async datos =>{
        const token = localStorage.getItem('token');

         //En caso de que no haya algun token dentro de nuestro localstorage evitamos la ejecucion del resta del codigo de esta funcion
         if(!token){
            setCargando(false);
            return;
        }
        
        const config = {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }
        }

        try {
            const url = `/veterinarios/perfil/${datos._id}`;

            const {data} = await clienteAxios.put(url, datos, config);

            return{
                msg: 'Almacenado Correctamente'
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }
    }


    const guardarPassword = async (datos) =>{

        const token = localStorage.getItem('token');

        if(!token){
            setCargando(false);
            return;
        }
        
        const config = {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }
        }

        try {
            const url = '/veterinarios/actualizar-password';

            const {data} = await clienteAxios.put(url, datos, config);

            return{
                msg: data.msg
            }
            
        } catch (error) {
           return{
            msg: error.response.data.msg,
            error: true
           }
        }
    }


    return (
        <AuthContext.Provider
        
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion,
                actualizarPerfil,
                guardarPassword
            }}

        >
            {children}
        </AuthContext.Provider>
    )


}

export {
    AuthProvider
}

export default AuthContext