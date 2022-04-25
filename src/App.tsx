import React, { useEffect, useState } from 'react';
import './App.css';
import AppRouter from './router/AppRouter';
import { defaultEnv, LocalEnv, User } from './types/StorageTypes';
import { checkUser } from './utils/user';

function App() {

    const [localEnv, setLocalEnv] = useState<LocalEnv>(defaultEnv);

    useEffect(()=>{ 
       checkUser(setLocalEnv);
    },[]);
    return <AppRouter localEnv={localEnv}/>;
}

export default App;
