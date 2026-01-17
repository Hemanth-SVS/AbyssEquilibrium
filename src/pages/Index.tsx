import { useState } from 'react';
import { GameIntro } from '@/components/GameIntro';
import { PhaserGame } from '@/game/PhaserGame';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return <GameIntro onStart={() => setGameStarted(true)} />;
  }

  return (
    <div className="w-screen h-screen bg-abyss overflow-hidden">
      <PhaserGame />
    </div>
  );
};

export default Index;
