export interface TimerData {
    targetDate: string;
    message: string;
  }
  
  export interface AnimationData {
    url: string;
    width: number;
    height: number;
  }

  export interface CarouselAnimation extends AnimationData {
    id: string;
  }