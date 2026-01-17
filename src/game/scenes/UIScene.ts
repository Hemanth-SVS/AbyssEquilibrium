import Phaser from 'phaser';
import { GAME_CONFIG, PLAYER, GAME, OVERSEER } from '../constants';

interface StoryBeat {
  distance: number;
  speaker: string;
  message: string;
}

export class UIScene extends Phaser.Scene {
  private healthBarBg!: Phaser.GameObjects.Graphics;
  private healthBar!: Phaser.GameObjects.Graphics;
  private healthText!: Phaser.GameObjects.Text;
  private healthPercentText!: Phaser.GameObjects.Text;
  private distBg!: Phaser.GameObjects.Graphics;
  private distLabel!: Phaser.GameObjects.Text;
  private apexBg!: Phaser.GameObjects.Graphics;
  private apexLabel!: Phaser.GameObjects.Text;
  private overseerBg!: Phaser.GameObjects.Graphics;
  private cooldownLabel!: Phaser.GameObjects.Text;
  private logBg!: Phaser.GameObjects.Graphics;
  private logLabel!: Phaser.GameObjects.Text;
  private controlsHint!: Phaser.GameObjects.Text;
  private distanceText!: Phaser.GameObjects.Text;
  private apexMoneyText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private messageLog!: Phaser.GameObjects.Text;
  private overseerText!: Phaser.GameObjects.Text;

  // Story display
  private storyContainer!: Phaser.GameObjects.Container;
  private storySpeaker!: Phaser.GameObjects.Text;
  private storyMessage!: Phaser.GameObjects.Text;
  private storyBg!: Phaser.GameObjects.Graphics;

  private healthBarX: number = 0;
  private healthBarY: number = 0;
  private healthBarW: number = 0;
  private healthBarH: number = 18;



  private storyBgY: number = 0;

  private lastHealth: number = PLAYER.maxHealth;

  private lastStoryBeat?: StoryBeat;
  private storyVisible: boolean = false;

  private layoutSafe: number = 10;
  private topHudBottomY: number = 0;
  private logTopY: number = 0;

  private messages: string[] = [];
  private maxMessages: number = 3;

  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    // --- Health Bar Section ---
    this.healthBarBg = this.add.graphics();
    this.healthBar = this.add.graphics();

    this.healthText = this.add.text(140, 28, 'ECHO VITALS', {
      fontFamily: '"Segoe UI", Tahoma, sans-serif',
      fontSize: '13px',
      color: '#6dd5ed',
      fontStyle: 'bold',
      letterSpacing: 1,
    });
    this.healthText.setOrigin(0.5, 0);

    // Health percentage with shadow - positioned to the right of bar
    this.healthPercentText = this.add.text(240, 28, '100%', {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      color: '#00ff88',
      fontStyle: 'bold',
    }).setName('healthPercent');
    this.healthPercentText.setShadow(2, 2, '#000000', 6, true, true);

    // --- Distance Indicator ---
    this.distBg = this.add.graphics();

    this.distLabel = this.add.text(GAME_CONFIG.width / 2, 28, 'SANCTUARY DISTANCE', {
      fontFamily: '"Segoe UI", Tahoma, sans-serif',
      fontSize: '12px',
      color: '#4db8ff',
      fontStyle: 'bold',
      letterSpacing: 2,
    }).setOrigin(0.5, 0);

    this.distanceText = this.add.text(GAME_CONFIG.width / 2, 50, '6000m', {
      fontFamily: '"Courier New", monospace',
      fontSize: '28px',
      color: '#00ffcc',
      fontStyle: 'bold',
    });
    this.distanceText.setOrigin(0.5, 0);
    this.distanceText.setShadow(0, 0, '#004d4d', 6, true, true);

    this.scoreText = this.add.text(GAME_CONFIG.width / 2 - 110, 82, 'SCORE: 0', {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      color: '#88ddff',
      fontStyle: 'bold',
    });
    this.scoreText.setOrigin(0, 0);

    this.comboText = this.add.text(GAME_CONFIG.width / 2 + 110, 82, 'COMBO: x0', {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      color: '#00ffcc',
      fontStyle: 'bold',
    });
    this.comboText.setOrigin(1, 0);

    // --- Apex Money (top right) ---
    this.apexBg = this.add.graphics();

    this.apexLabel = this.add.text(GAME_CONFIG.width - 110, 28, 'APEX INDUSTRIES', {
      fontFamily: '"Segoe UI", Tahoma, sans-serif',
      fontSize: '11px',
      color: '#ff6b6b',
      fontStyle: 'bold',
      letterSpacing: 1,
    }).setOrigin(0.5, 0);

    this.apexMoneyText = this.add.text(GAME_CONFIG.width - 110, 48, '$0', {
      fontFamily: '"Courier New", monospace',
      fontSize: '22px',
      color: '#ff4757',
      fontStyle: 'bold',
    });
    this.apexMoneyText.setOrigin(0.5, 0);
    this.apexMoneyText.setShadow(0, 0, '#660000', 4, true, true);

    // --- Overseer Status ---
    this.overseerBg = this.add.graphics();

    this.overseerText = this.add.text(28, 88, `⚡ OVERSEER: ${OVERSEER.maxUses} interventions`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#4ea8de',
      fontStyle: 'bold',
    });

    // --- Story Display (center-top) ---
    this.createStoryDisplay();

    // --- Message Log (bottom) ---
    this.logBg = this.add.graphics();

    this.logLabel = this.add.text(35, GAME_CONFIG.height - 92, '▸ SYSTEM LOG', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#5599bb',
      fontStyle: 'bold',
      letterSpacing: 1,
    });

    this.messageLog = this.add.text(35, GAME_CONFIG.height - 75, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      color: '#99bbcc',
      wordWrap: { width: GAME_CONFIG.width - 80 },
      lineSpacing: 5,
    });

    // --- Controls hint ---
    this.controlsHint = this.add.text(GAME_CONFIG.width - 25, GAME_CONFIG.height - 110, '↑←↓→ WASD: Move  •  SPACE: Echolocation', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#556677',
      fontStyle: 'bold',
    }).setOrigin(1, 1);

    this.layoutUI();
    this.updateHealthBar(PLAYER.maxHealth);

    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    });

    // Listen for updates from game scene
    const gameScene = this.scene.get('GameScene');
    gameScene.events.on('uiUpdate', this.handleUIUpdate, this);
    gameScene.events.on('storyBeat', this.showStoryBeat, this);

    // Initial messages
    this.addMessage('SYSTEM: Welcome to the Silent Zone. Year 2045.');
    this.addMessage('OVERSEER: Life form detected. Observation protocol initiated.');
  }

  private createStoryDisplay() {
    // Story text container (appears in center-top area)
    this.storyBg = this.add.graphics();
    this.storyBg.setAlpha(0);

    this.storySpeaker = this.add.text(GAME_CONFIG.width / 2, 145, '', {
      fontFamily: '"Segoe UI", Tahoma, sans-serif',
      fontSize: '14px',
      color: '#00ffff',
      fontStyle: 'bold',
      letterSpacing: 3,
    });
    this.storySpeaker.setOrigin(0.5, 0.5);
    this.storySpeaker.setAlpha(0);

    this.storyMessage = this.add.text(GAME_CONFIG.width / 2, 175, '', {
      fontFamily: '"Segoe UI", Tahoma, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'italic',
      align: 'center',
      wordWrap: { width: 640 },
      lineSpacing: 3,
    });
    this.storyMessage.setOrigin(0.5, 0.5);
    this.storyMessage.setAlpha(0);
    this.storyMessage.setShadow(0, 0, '#000000', 8, true, true);
  }

  private showStoryBeat(beat: StoryBeat) {
    // Speaker color based on who's talking
    let speakerColor = '#ffffff';
    switch (beat.speaker) {
      case 'ECHO': speakerColor = '#00ffcc'; break;
      case 'APEX': speakerColor = '#ff6666'; break;
      case 'OVERSEER': speakerColor = '#66aaff'; break;
      case 'SYSTEM': speakerColor = '#888888'; break;
    }

    this.storySpeaker.setText(`[ ${beat.speaker} ]`);
    this.storySpeaker.setColor(speakerColor);
    this.storyMessage.setText(`"${beat.message}"`);

    this.lastStoryBeat = beat;
    this.storyVisible = true;
    this.redrawStoryBackground();

    // Fade in
    this.tweens.add({
      targets: [this.storyBg, this.storySpeaker, this.storyMessage],
      alpha: 1,
      duration: 500,
      ease: 'Cubic.easeOut'
    });

    // Fade out after delay
    this.time.delayedCall(4000, () => {
      this.tweens.add({
        targets: [this.storyBg, this.storySpeaker, this.storyMessage],
        alpha: 0,
        duration: 800,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          this.storyVisible = false;
        }
      });
    });
  }

  private handleUIUpdate(data: {
    health: number;
    distance: number;
    overseerUsesLeft: number;
    apexMoney: number;
    score: number;
    combo: number;
    message?: string;
  }) {
    this.lastHealth = data.health;
    this.updateHealthBar(this.lastHealth);

    const remaining = Math.max(0, GAME.sanctuaryDistance - data.distance);
    this.distanceText.setText(`${remaining}m`);

    // Color based on proximity
    if (remaining < 1000) {
      this.distanceText.setColor('#00ff88');
    } else if (remaining < 3000) {
      this.distanceText.setColor('#00ffcc');
    }

    this.apexMoneyText.setText(`$${data.apexMoney}`);
    this.overseerText.setText(`⚡ OVERSEER: ${data.overseerUsesLeft} intervention${data.overseerUsesLeft !== 1 ? 's' : ''}`);

    this.scoreText.setText(`SCORE: ${data.score}`);
    this.comboText.setText(`COMBO: x${data.combo}`);
    this.comboText.setColor(data.combo >= 10 ? '#00ff88' : data.combo >= 5 ? '#00ffcc' : '#88cccc');

    if (data.message) {
      this.addMessage(data.message);
    }
  }

  private updateHealthBar(health: number) {
    this.healthBar.clear();

    const percentage = Math.max(0, health / PLAYER.maxHealth);
    const width = this.healthBarW * percentage;

    // Dynamic color based on health with smooth transitions
    let color = 0x00ff88;
    if (percentage < 0.20) color = 0xff3355;
    else if (percentage < 0.35) color = 0xff5544;
    else if (percentage < 0.50) color = 0xff9933;
    else if (percentage < 0.70) color = 0xddff00;

    // Background bar with subtle gradient
    this.healthBar.fillStyle(0x1a2f3f, 1);
    this.healthBar.fillRoundedRect(this.healthBarX, this.healthBarY, this.healthBarW, this.healthBarH, 5);

    // Main health bar
    this.healthBar.fillStyle(color, 1);
    this.healthBar.fillRoundedRect(this.healthBarX, this.healthBarY, width, this.healthBarH, 5);

    // Top gloss effect for depth
    this.healthBar.fillStyle(0xffffff, 0.15);
    this.healthBar.fillRoundedRect(this.healthBarX + 1, this.healthBarY + 1, width - 2, 7, 3);

    // Border outline for definition
    this.healthBar.lineStyle(1, color, 0.6);
    this.healthBar.strokeRoundedRect(this.healthBarX, this.healthBarY, width, this.healthBarH, 5);

    // Update percentage text with matching color
    this.healthPercentText.setText(`${Math.floor(percentage * 100)}%`);
    const textColor = percentage < 0.20 ? '#ff3355' : (percentage < 0.50 ? '#ff9933' : '#00ff88');
    this.healthPercentText.setColor(textColor);
  }

  private handleResize() {
    this.layoutUI();
    this.updateHealthBar(this.lastHealth);

    if (this.storyVisible && this.lastStoryBeat) {
      this.storySpeaker.setText(`[ ${this.lastStoryBeat.speaker} ]`);
      this.storyMessage.setText(`"${this.lastStoryBeat.message}"`);
      this.redrawStoryBackground();
    }
  }

  private layoutUI() {
    const w = this.scale.width;
    const h = this.scale.height;

    const safe = Math.max(10, Math.round(Math.min(w, h) * 0.02));
    this.layoutSafe = safe;

    const leftW = Math.min(260, Math.max(220, Math.round(w * 0.24)));
    const rightW = Math.min(200, Math.max(170, Math.round(w * 0.19)));
    const centerW = Math.min(300, Math.max(240, Math.round(w * 0.28)));

    const healthH = 50;
    const distH = 90;
    const apexH = 50;
    const overseerH = 30;

    const canSingleRow = w >= leftW + rightW + centerW + safe * 6;

    const healthX = safe;
    const healthY = safe;

    this.healthBarBg.clear();
    // Modern gradient background
    this.healthBarBg.fillStyle(0x0a1f2e, 0.95);
    this.healthBarBg.fillRoundedRect(healthX, healthY, leftW, healthH, 10);
    this.healthBarBg.lineStyle(3, 0x00d4ff, 0.4);
    this.healthBarBg.strokeRoundedRect(healthX, healthY, leftW, healthH, 10);
    // Inner glow effect
    this.healthBarBg.lineStyle(1, 0x00ffff, 0.2);
    this.healthBarBg.strokeRoundedRect(healthX + 2, healthY + 2, leftW - 4, healthH - 4, 8);

    this.healthText.setPosition(healthX + leftW / 2, healthY + 9);
    this.healthPercentText.setPosition(healthX + leftW - 28, healthY + 5);

    this.healthBarX = healthX + 12;
    this.healthBarY = healthY + 24;
    this.healthBarW = leftW - 35;

    const overseerX = healthX;
    const overseerY = healthY + healthH + safe;
    this.overseerBg.clear();
    this.overseerBg.fillStyle(0x0a1a2e, 0.92);
    this.overseerBg.fillRoundedRect(overseerX, overseerY, leftW, overseerH, 6);
    this.overseerBg.lineStyle(2, 0x4ea8de, 0.3);
    this.overseerBg.strokeRoundedRect(overseerX, overseerY, leftW, overseerH, 6);
    this.overseerText.setPosition(overseerX + 10, overseerY + 9);

    const centerX = Math.round((w - centerW) / 2);
    const centerY = canSingleRow ? safe : Math.round(Math.max(overseerY + overseerH, safe + apexH) + safe);

    this.distBg.clear();
    this.distBg.fillStyle(0x0a1f2e, 0.95);
    this.distBg.fillRoundedRect(centerX, centerY, centerW, distH, 10);
    this.distBg.lineStyle(3, 0x00d4ff, 0.4);
    this.distBg.strokeRoundedRect(centerX, centerY, centerW, distH, 10);
    // Inner highlight
    this.distBg.lineStyle(1, 0x00ffcc, 0.15);
    this.distBg.strokeRoundedRect(centerX + 2, centerY + 2, centerW - 4, distH - 4, 8);

    this.distLabel.setPosition(centerX + centerW / 2, centerY + 14);
    this.distanceText.setPosition(centerX + centerW / 2, centerY + 36);
    this.scoreText.setPosition(centerX + 18, centerY + 65);
    this.comboText.setPosition(centerX + centerW - 18, centerY + 65);

    const apexX = w - safe - rightW;
    const apexY = safe;

    this.apexBg.clear();
    this.apexBg.fillStyle(0x2e0a0a, 0.95);
    this.apexBg.fillRoundedRect(apexX, apexY, rightW, apexH, 10);
    this.apexBg.lineStyle(3, 0xff5555, 0.4);
    this.apexBg.strokeRoundedRect(apexX, apexY, rightW, apexH, 10);
    // Red inner glow
    this.apexBg.lineStyle(1, 0xff6666, 0.2);
    this.apexBg.strokeRoundedRect(apexX + 2, apexY + 2, rightW - 4, apexH - 4, 8);

    this.apexLabel.setPosition(apexX + rightW / 2, apexY + 9);
    this.apexMoneyText.setPosition(apexX + rightW / 2, apexY + 28);

    const logH = Math.min(96, Math.max(78, Math.round(h * 0.14)));
    const logX = safe;
    const logY = h - safe - logH;
    const logW = w - safe * 2;
    this.logTopY = logY;

    this.logBg.clear();
    this.logBg.fillStyle(0x0a1520, 0.92);
    this.logBg.fillRoundedRect(logX, logY, logW, logH, 10);
    this.logBg.lineStyle(2, 0x336688, 0.5);
    this.logBg.strokeRoundedRect(logX, logY, logW, logH, 10);
    // Subtle top highlight
    this.logBg.lineStyle(1, 0x4488aa, 0.2);
    this.logBg.strokeRoundedRect(logX + 2, logY + 2, logW - 4, logH - 4, 8);

    this.logLabel.setPosition(logX + 15, logY + 8);
    this.messageLog.setPosition(logX + 15, logY + 22);
    this.messageLog.setWordWrapWidth(logW - 30);

    this.controlsHint.setPosition(w - safe, logY - 8);

    const topBlockBottom = Math.max(overseerY + overseerH, apexY + apexH, centerY + distH);
    this.topHudBottomY = topBlockBottom;
    const storyTop = topBlockBottom + safe;
    const storyMaxTop = logY - 150;
    const storyBase = Phaser.Math.Clamp(storyTop, safe, Math.max(storyMaxTop, safe));

    this.storySpeaker.setPosition(w / 2, storyBase + 20);
    this.storyMessage.setPosition(w / 2, storyBase + 50);
    this.storyMessage.setWordWrapWidth(Math.min(700, w - safe * 6));
    this.storyBgY = storyBase;

    if (this.storyVisible) {
      this.redrawStoryBackground();
    }
  }

  private redrawStoryBackground() {
    const w = this.scale.width;
    const safe = this.layoutSafe;

    const msgWidth = Math.max(300, this.storyMessage.width + 60);
    const bgH = Math.max(80, this.storyMessage.height + 50);

    let y = this.storyBgY;
    y = Math.max(y, this.topHudBottomY + safe);
    if (this.logTopY > 0) {
      y = Math.min(y, this.logTopY - safe - bgH);
    }
    y = Math.max(safe, y);
    this.storyBgY = y;

    this.storySpeaker.setPosition(w / 2, y + 20);
    this.storyMessage.setPosition(w / 2, y + 50);

    this.storyBg.clear();
    this.storyBg.fillStyle(0x0a1520, 0.9);
    this.storyBg.fillRoundedRect(w / 2 - msgWidth / 2, y, msgWidth, bgH, 8);
  }

  private addMessage(message: string) {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    this.messages.push(`[${timestamp}] ${message}`);

    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }

    this.messageLog.setText(this.messages.join('\n'));
  }
}
