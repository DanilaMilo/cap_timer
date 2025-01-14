import React, { useEffect, useState } from 'react';
import { Timer } from './components/timer/timer';
import { Animation } from './components/animation/animation';
import { Menu } from './components/menu/menu';
import { ModalRef } from './components/modals/modal_ref';
import { getTimerData, getAnimationData, triggerExplore } from './services/api';

import { useTimer } from './hooks/useTimer';
import { TimerData, AnimationData } from './types';

import styles from './App.module.css';

function App() {
  const [timerData, setTimerData] = useState<TimerData | null>(null);
  const [animationData, setAnimationData] = useState<AnimationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dayLeft: string = '5';
  const timeLeft = useTimer(timerData?.targetDate || new Date().toISOString());

  useEffect(() => {
    setAnimationData({"url": "https://permitted-calculators-explore-stays.trycloudflare.com/sticker/CAACAgIAAxUAAWeE7oBJKdipUGGY3G7MyPwAAc08iwACTmEAAqFVsEvxq2gpllIfeTYE", "width": 512, "height": 512});
    const fetchData = async () => {
      try {
        const [timer, animation] = await Promise.all([
          getTimerData(),
          getAnimationData(),
        ]);
        setTimerData(timer);
        setAnimationData(animation);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        console.error('Error fetching data:', errorMessage);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    //@ts-ignore
    if (window.Telegram?.WebApp) {
      //@ts-ignore
      window.Telegram.WebApp.disableVerticalSwipes(true)
    }
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <Timer timeLeft={{ dayLeft, timeLeft }} />
      {animationData && <Animation data={animationData} />}
      <Menu onReferralsClick={handleOpenModal} />
      <ModalRef isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default App;