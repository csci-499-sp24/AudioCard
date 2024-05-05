// AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../utils/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            setUser(authUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

const DefaultComponent = () => {
    return <div>This is the default component for AuthContext</div>;
};

export default DefaultComponent;