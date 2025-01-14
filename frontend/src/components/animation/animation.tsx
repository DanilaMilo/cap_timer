import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import pako from 'pako'; // Для работы с Gzip
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './animation.module.css';
import { AnimationData, CarouselAnimation } from '../../types';

interface AnimationProps {
  data: AnimationData;
}

export const Animation: React.FC<AnimationProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationData, setAnimationData] = useState<any | null>(null);
  const [preloadedAnimations, setPreloadedAnimations] = useState<{ [key: string]: any }>({});

   //@ts-ignore
   const tg = window.Telegram.WebApp;

    // Тут эндпоинты должны формироваться на основе данных с бэка
    const animations: CarouselAnimation[] = [
        { id: '1', url: 'https://of-assigned-lip-neighbors.trycloudflare.com/sticker/CAACAgIAAxUAAWeE7oDKAAEGy0GTBbhq2jeXjNLMZAACalwAAv-TsEtOoJmopuy2WjYE', width: 512, height: 512 },
        { id: '2',  url: 'https://of-assigned-lip-neighbors.trycloudflare.com/sticker/CAACAgIAAxUAAWeE7oAZ-hGZlTm4SjvpqnDIJugUAAITaQACiq-5S7gQfwPQbEC4NgQ', width: 512, height: 512 },
        { id: '3',  url: 'https://of-assigned-lip-neighbors.trycloudflare.com/sticker/CAACAgIAAxUAAWeE7oCa-2Vn2Lmaa20i2gdzaXqxAALyXgACG4W5SzTRtnUy-iqrNgQ', width: 512, height: 512 },
        { id: '4',  url: 'https://of-assigned-lip-neighbors.trycloudflare.com/sticker/CAACAgIAAxUAAWeE7oC2c94t6xPv4TUfSDlHTL02AAI7XwACyCCxS06-PSBQyT_HNgQ', width: 512, height: 512},
        { id: '5',  url: 'https://of-assigned-lip-neighbors.trycloudflare.com/sticker/CAACAgIAAxUAAWeE7oBPhyrXXg3lS43n0NABixeDAAJsYAACEMGwS2LHcz4W1KqONgQ', width: 512, height: 512 },
        {id: '6', url: 'https://of-assigned-lip-neighbors.trycloudflare.com/sticker/CAACAgIAAxUAAWeE7oDVylUYYQ-_VEjZGNsDPxA1AALMXQACqImxSxw1Mw_L09q4NgQ', width: 512, height: 512},
        {id: '7',  url: 'https://of-assigned-lip-neighbors.trycloudflare.com/sticker/CAACAgIAAxUAAWeE7oBJKdipUGGY3G7MyPwAAc08iwACTmEAAqFVsEvxq2gpllIfeTYE', width: 512, height: 512},
        {id: '8',  url: 'https://of-assigned-lip-neighbors.trycloudflare.com/sticker/CAACAgIAAxUAAWeE7oDj-B4xHOen3OdLYq3pOlX3AAKlYQACGxm5S2VDAvvpis6NNgQ', width: 512, height: 512}
        ];

    const [currentIndex, setCurrentIndex] = useState(1);
    const [startTouchX, setStartTouchX] = useState(0); // Сохраняем координаты начала свайпа
    const animationRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [isClickable, setIsClickable] = useState(true);

    const handleClickWithDelay = (action: () => void) => {
        if (!isClickable) return;
  
        action();
        //@ts-ignore
        if (window.Telegram?.WebApp?.HapticFeedback) {
            //@ts-ignore - вибрация
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        setIsClickable(false);
  
        // Снимаем блокировку через 0.5 секунды
        setTimeout(() => {
          setIsClickable(true);
        }, 500);
    };
  
    const handlePrev = () => {
        handleClickWithDelay(() => {
          setCurrentIndex((prev) => (prev - 1 + animations.length) % animations.length);
        });
    };
  
    const handleNext = () => {
        handleClickWithDelay(() => {
          setCurrentIndex((prev) => (prev + 1) % animations.length);
        });
    };

    useEffect(() => {
        // Clean up previous animations
        return () => {
          Object.values(animationRefs.current).forEach(container => {
            if (container) {
              container.innerHTML = '';
            }
          });
        };
      }, [currentIndex]);

    const fetchAnimationData = async (url: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch animation: ${response.statusText}`);
            }

            const contentType = response.headers.get('Content-Type');
            let animationJson;

            if (contentType === 'application/json') {
                animationJson = await response.json();
            } else if (contentType === 'application/octet-stream') {
                const arrayBuffer = await response.arrayBuffer();
                const decompressed = pako.inflate(new Uint8Array(arrayBuffer), { to: 'string' });
                animationJson = JSON.parse(decompressed);
            } else {
                throw new Error(`Unexpected content type: ${contentType}`);
            }

            return animationJson;
        } catch (error) {
            console.error('Error loading animation:', error);
            return null;
        }
    };

    useEffect(() => {
        // Предзагрузка всех данных анимаций
        const preloadAnimations = async () => {
          const animationPromises = animations.map(async (animation) => {
            const animationJson = await fetchAnimationData(animation.url);
            return { id: animation.id, animationData: animationJson };
          });
    
          const loadedAnimations = await Promise.all(animationPromises);
          const preloadedData: { [key: string]: any } = {};
          loadedAnimations.forEach((item) => {
            if (item.animationData) {
              preloadedData[item.id] = item.animationData;
            }
          });
    
          setPreloadedAnimations(preloadedData);
        };
    
        preloadAnimations();
      }, [data]);



    useEffect(() => {
        const visibleIndices = getVisibleIndices();
    
        visibleIndices.forEach(async (index) => {
            const currentAnimation = animations[index];
            const container = animationRefs.current[currentAnimation.id];
    
            if (container && currentAnimation.url && container.innerHTML === '') {
                // const animationJson = await fetchAnimationData(animation.url);
                if (currentAnimation.url && preloadedAnimations[currentAnimation.id]) {
                    lottie.loadAnimation({
                        container,
                        renderer: 'svg',
                        loop: false,
                        autoplay: index === currentIndex,
                        animationData: preloadedAnimations[currentAnimation.id],
                    });
                }
            }
        });
    }, [currentIndex, preloadedAnimations]);
    

     // Обработчик свайпа
    const handleTouchStart = (e: React.TouchEvent) => {
        const touchStartX = e.touches[0].clientX;
        setStartTouchX(touchStartX); // Сохраняем начальную координату
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;

        // Если свайп влево
        if (startTouchX - touchEndX > 50) {
            handleNext(); // Сдвиг на следующее анимационное изображение
        }

        // Если свайп вправо
        if (touchEndX - startTouchX > 50 ) {
            handlePrev(); // Сдвиг на предыдущее анимационное изображение
        }
    };

    useEffect(() => {
        // Get visible indices
        const visibleIndices = getVisibleIndices();
        
        // Load only visible animations
        visibleIndices.forEach(index => {
            const animation = animations[index];
            const container = animationRefs.current[animation.id];
            
            if (container && animation.url && container.innerHTML === '') {
                const isAutoplay = index === currentIndex;
                lottie.loadAnimation({
                container,
                renderer: 'svg',
                loop: false,
                autoplay: isAutoplay,
                animationData,
                });
            }
        });
    }, [currentIndex, animations]);

    const getVisibleIndices = () => {
        const length = animations.length;
        return [
          (currentIndex - 1 + length) % length,
          currentIndex,
          (currentIndex + 1) % length,
        ];
    };

    const getVisibleAnimations = () => {
        const visibleIndices = getVisibleIndices();
        return visibleIndices.map(index => ({
          animation: animations[index],
          position: index === currentIndex ? 'center' :
                    index === visibleIndices[0] ? 'left' : 'right'
        }));
    };


    return (
        <div 
          className={styles.container}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.carousel}>
            {animations.length > 0 ? (
              <>
                {/* console.log(getVisibleAnimations()) */}
                {getVisibleAnimations().map(({ animation, position }) => (
                  <div
                    key={animation.id}
                    ref={(el) => (animationRefs.current[animation.id] = el)}
                    className={`${styles.animationWrapper} ${styles[`${position}Animation`]}`}
                    onClick={position === 'left' ? handlePrev : handleNext}
                    style={{ backgroundColor: 'transparent' }}
                  />
                ))}
              </>
            ) : (
              <div className={styles.placeholder}>
                <span>No animations available</span>
              </div>
            )}
          </div>
        </div>
      );
    };