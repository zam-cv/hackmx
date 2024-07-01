import React, { useState, useEffect } from 'react';

type CountdownTimerProps = {
  targetDate: string;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = () => {
    const now = new Date();
    const target = new Date(targetDate);
    const difference = target.getTime() - now.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0});
    }
  };

  useEffect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000); 

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className='flex justify-center items-center font-poppins'>
  <div className="flex flex-col justify-center items-center text-center mx-5 rounded-lg shadow-blue-xl w-40 h-40">
    <p className="mb-2 text-5xl font-bold">{timeLeft.days}</p>
    <p className="text-s">Días</p>
  </div>
  <div>
    <p className="text-5xl font-semibold">:</p>
  </div>
  <div className="flex flex-col justify-center items-center text-center mx-5 rounded-lg shadow-blue-xl w-40 h-40">
    <p className="mb-2 text-5xl font-bold">{timeLeft.hours}</p>
    <p className="text-s">Horas</p>
  </div>
  <div>
    <p className="text-5xl font-semibold">:</p>
  </div>
  <div className="flex flex-col justify-center items-center text-center mx-5 rounded-lg shadow-blue-xl w-40 h-40">
    <p className="mb-2 text-5xl font-bold">{timeLeft.minutes}</p>
    <p className="text-s">Minutos</p>
  </div>
  <div>
    <p className="text-5xl font-semibold">:</p>
  </div>
  <div className="flex flex-col justify-center items-center text-center mx-5 rounded-lg shadow-blue-xl w-40 h-40">
    <p className="mb-2 text-5xl font-bold">{timeLeft.seconds}</p>
    <p className="text-s">Segundos</p>
  </div>
</div>

  );
};

export default CountdownTimer;
