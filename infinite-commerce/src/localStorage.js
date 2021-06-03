import { useState, useEffect } from 'react';
//import {LocalStorage} from 'use-local-storage';

//source: https://typeofnan.dev/using-local-storage-in-react-with-your-own-custom-uselocalstorage-hook/

const useLocalStorage = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  const initial = stored ? JSON.parse(stored) : defaultValue;
  const [value, setValue] = useState(initial);

  useEffect(() => {
      try{
        localStorage.setItem(key, JSON.stringify(value));
      }catch(err){
          //for now I will be console logging the error
          console.log(err.message);
      }
    
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;