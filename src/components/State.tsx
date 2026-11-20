import {createContext,useContext,useEffect,useState,ReactNode} from 'react';
import {Action,State,transition} from '../services/reservations';
import {loadState,saveState} from '../services/storage';
const C=createContext<{state:State;act:(a:Action)=>void;message:string}>({} as never);
export function StateProvider({children}:{children:ReactNode}){const [state,set]=useState(loadState),[message,msg]=useState('');useEffect(()=>{if(!saveState(state))msg('Browser storage is unavailable. Your demo will last only for this session.');},[state]);const act=(a:Action)=>{const r=transition(state,a);set(r.state);msg(r.message);};return <C.Provider value={{state,act,message}}>{children}</C.Provider>}
export const useDemo=()=>useContext(C);
