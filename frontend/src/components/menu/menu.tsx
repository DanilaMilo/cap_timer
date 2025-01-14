import React from 'react';
import main from '../../assets/main.png'
import refferals from '../../assets/refferals.png'
import tasks from '../../assets/tasks.png'
import styles from './Menu.module.css';

interface MenuProps {
  onReferralsClick: () => void;
}

export const Menu: React.FC<MenuProps> = ({ onReferralsClick }) => {

  return (
    <div className={styles.menuContainer}>
      <button className={styles.menuItem} onClick={onReferralsClick}>
        {/* <Users2 size={24} className={styles.icon} /> */}
        <img src={refferals} className={styles.icon}  /> 
        <span>Referrals</span>
      </button>
      <button className={`${styles.menuItem} ${styles.active}`}>
        <img src={main} className={styles.icon} /> 
      </button>
      <button className={styles.menuItem}>
        <img src={tasks} className={styles.icon} /> 
        <span>Tasks</span>
      </button>
    </div>
  );
}