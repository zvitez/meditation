import styles from '../styles/TodoComponent.module.scss'
import React, { useEffect, useRef } from 'react'
import ParticleManager from './particles/particleManager'

const TodoComponent = ({ todoID, todoTitle, deleteTodo }) => {
  let todoCanvas = useRef(); 

  useEffect(() => {
    /* 
      8:18  Warning: Assignments to the 'todoCanvas' variable from inside React Hook useEffect will be lost after each render. To preserve the value over time, store it in a useRef Hook and keep the mutable value in the '.current' property. Otherwise, you can move this variable directly inside useEffect.  react-hooks/exhaustive-deps
    */
    todoCanvas.current = new ParticleManager("#todo" + todoID, todoTitle);
  }, []);

  return (    
    <div id={"todo" + todoID} className={styles.canvas_button + " canvas_button"}>
      <button onClick={ () => deleteTodo(todoID) } className={styles.checkTaskButton + " checkTaskButton"}></button>
      <canvas className="canvas"></canvas>  
    </div>      
  );
}

export default TodoComponent;