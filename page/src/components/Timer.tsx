import React, { useState, useEffect } from 'react';

type CountdownTimerProps = {
  targetDate: string;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  const calculateTimeLeft = () => {
    const now = new Date();
    const target = new Date(targetDate);
    const difference = target.getTime() - now.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft({ days, hours, minutes });
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0 });
    }
  };

  useEffect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); 

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div>
      <p>
        Days: {timeLeft.days}, Hours: {timeLeft.hours}, Minutes: {timeLeft.minutes}
      </p>
    </div>
  );
};

export default CountdownTimer;
