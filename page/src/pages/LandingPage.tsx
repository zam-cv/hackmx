import React from 'react';
import Timer from '../components/Timer';

export default function LandingPage() {
  return (
    <div>
      <h1>Landing Page</h1>
      <Timer targetDate="2024-10-15T00:00:00" />
    </div>
  );
}