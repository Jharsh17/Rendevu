import React, {useEffect, useState} from "react";
import { auth } from "./firebase";
import Login from "./Login";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? <h2>Welcome {user.email}</h2> : <Login/>}
    </div>
  );
};

export default App;