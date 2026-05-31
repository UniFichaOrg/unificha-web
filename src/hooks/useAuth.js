import { useEffect, useState } from 'react';
import { useAuth as useAuthContext } from '../context/AuthContext';

function useAuth() {
    const auth = useAuthContext();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        setInitialized(true);
    }, []);

    return { ...auth, initialized };
}

export default useAuth;
