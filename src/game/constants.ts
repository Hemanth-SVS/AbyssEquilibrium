// Game constants for Abyss Equilibrium

export const GAME_CONFIG = {
  width: 1024,
  height: 768,
};

export const PLAYER = {
  speed: 200,                   // Slightly slower (was 220)
  maxHealth: 100,
  echolocationCooldown: 4500,   // Longer cooldown (was 3500)
  echolocationDuration: 2500,
  echolocationRadius: 250,
};

export const HAZARDS = {
  plasticDamage: 18,      // Increased from 12
  netDamage: 5,           // Increased from 3
  netSlowFactor: 0.25,    // Slower in nets
  jellyfishHeal: 14,      // Reduced healing from 18
};

export const APEX = {
  netSpawnInterval: 3000,
  wasteSpawnInterval: 4000,
  plasticSpawnInterval: 2000,
};

export const OVERSEER = {
  maxUses: 2,
  shieldDuration: 4000,
  jamDuration: 6000,
  activationHealthThreshold: 25,
};

export const GAME = {
  sanctuaryDistance: 10000,  // Increased from 6000m to 10000m
  gameSpeed: 1,
};

// Story narrative beats - triggered at specific distances
export const STORY_BEATS = [
  { distance: 0, speaker: 'SYSTEM', message: 'Year 2045. The Silent Zone.' },
  { distance: 100, speaker: 'ECHO', message: '...The water tastes wrong. Everything is murky.' },
  { distance: 300, speaker: 'OVERSEER', message: 'Detecting life form. Initiating observation protocol.' },
  { distance: 600, speaker: 'ECHO', message: 'I remember when I could hear my family. Now there is only... noise.' },
  { distance: 1000, speaker: 'APEX', message: 'Net deployed. Quota progress: 12%.' },
  { distance: 1500, speaker: 'OVERSEER', message: 'Warning: Subject entering high-density pollution zone.' },
  { distance: 2000, speaker: 'ECHO', message: 'Is that food? It looks like a jellyfish... but something feels wrong.' },
  { distance: 2500, speaker: 'APEX', message: 'Waste disposal complete. Cost savings: $500.' },
  { distance: 3000, speaker: 'OVERSEER', message: 'Analysis: If subject perishes, ecosystem collapse accelerates by 3.2 years.' },
  { distance: 3500, speaker: 'ECHO', message: 'My body aches. The plastic... it burns inside me.' },
  { distance: 4000, speaker: 'APEX', message: 'Quarterly report: Profits up 23%. Environmental concerns: Dismissed.' },
  { distance: 4500, speaker: 'OVERSEER', message: 'Decision threshold reached. Preparing intervention protocols.' },
  { distance: 5000, speaker: 'ECHO', message: 'I cannot give up. The Sanctuary... my family might be there.' },
  { distance: 5500, speaker: 'APEX', message: 'Warning: Sensor interference detected. Investigating...' },
  { distance: 6000, speaker: 'SYSTEM', message: 'DANGER ZONE - Pollution density critical.' },
  { distance: 6500, speaker: 'ECHO', message: 'The water is getting clearer... or is that just hope?' },
  { distance: 7000, speaker: 'OVERSEER', message: 'Remarkable. Subject has survived beyond projected limits.' },
  { distance: 7500, speaker: 'APEX', message: 'Unknown biological activity detected. Dispatch investigation team.' },
  { distance: 8000, speaker: 'ECHO', message: 'I can hear something... singing? Is that... others like me?' },
  { distance: 8500, speaker: 'OVERSEER', message: 'Sanctuary boundaries detected. Protection protocols active.' },
  { distance: 9000, speaker: 'ECHO', message: 'The light! I can see the reef. It is real!' },
  { distance: 9500, speaker: 'OVERSEER', message: 'Subject at final approach. Probability of survival: 94%.' },
];
