import { useDispatch, useSelector } from 'react-redux';
import { loginUserThunk } from './Store/Slice/user/user.thunk';
import './App.css'
import {useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { getUserProfileThunk } from './Store/Slice/user/user.thunk';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(getUserProfileThunk());
    })();
  }, []);


  return (
    <>
     <Toaster position="top-center"reverseOrder={false}/>
    </>
  )
}



export default App
