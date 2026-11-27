import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

/** Progressive enhancement: content stays visible without observers or animation support. */
export function Motion(){
 const {pathname}=useLocation();
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches||!('IntersectionObserver' in window))return;
  const nodes=document.querySelectorAll<HTMLElement>('.section, .discovery-panel, .page-heading, .split-promos, .operations-grid, .assistant-layout, .passport-layout');
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){
    entry.target.classList.add('motion-enter');
    observer.unobserve(entry.target);
   }
  },{threshold:0.08});
  nodes.forEach(node=>observer.observe(node));
  const stop=()=>{if(preference.matches){observer.disconnect();nodes.forEach(node=>node.classList.remove('motion-enter'));}};
  preference.addEventListener('change',stop);
  return ()=>{observer.disconnect();preference.removeEventListener('change',stop);nodes.forEach(node=>node.classList.remove('motion-enter'));};
 },[pathname]);
 return null;
}
