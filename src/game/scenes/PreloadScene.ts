import Phaser from 'phaser';
import { getSelectedAssetPackId } from '@/game/assetPacks';

// Import assets - new high quality versions
import echoTurtleImg from '@/assets/game/echo_turtle.png';
import echoClassicImg from '@/assets/game/echo.png';
import oceanBgFarImg from '@/assets/game/ocean_bg_far.png';
import oceanBgMidImg from '@/assets/game/ocean_bg_mid.png';
import plasticBagImg from '@/assets/game/plastic_bag.png';
import plasticClassicImg from '@/assets/game/plastic.png';
import ghostNetImg from '@/assets/game/ghost_net_new.png';
import ghostNetClassicImg from '@/assets/game/ghost_net.png';
import apexTrawlerImg from '@/assets/game/apex_trawler.png';
import apexShipClassicImg from '@/assets/game/apex_ship.png';
import jellyfishImg from '@/assets/game/jellyfish_real.png';
import jellyfishClassicImg from '@/assets/game/jellyfish.png';
import sanctuaryImg from '@/assets/game/sanctuary_reef.png';
import sanctuaryClassicImg from '@/assets/game/sanctuary.png';
import overseerImg from '@/assets/game/overseer_drone.png';
import overseerClassicImg from '@/assets/game/overseer.png';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const pack = getSelectedAssetPackId();
    const isClassic = pack === 'classic';

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x0a1520, 1);
    bg.fillRect(0, 0, width, height);

    // Progress bar container with modern styling
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x0a2535, 0.92);
    progressBox.fillRoundedRect(width / 2 - 220, height / 2 - 35, 440, 70, 12);
    progressBox.lineStyle(3, 0x00d4ff, 0.45);
    progressBox.strokeRoundedRect(width / 2 - 220, height / 2 - 35, 440, 70, 12);
    // Inner glow
    progressBox.lineStyle(1, 0x00ffff, 0.2);
    progressBox.strokeRoundedRect(width / 2 - 218, height / 2 - 33, 436, 66, 10);

    const progressBar = this.add.graphics();

    // Title with enhanced styling
    const titleText = this.add.text(width / 2, height / 2 - 120, 'ABYSS EQUILIBRIUM', {
      fontFamily: '"Segoe UI", Tahoma, sans-serif',
      fontSize: '56px',
      color: '#00ffff',
      fontStyle: 'bold',
      letterSpacing: 4,
    });
    titleText.setOrigin(0.5, 0.5);
    titleText.setShadow(0, 0, '#00ffff', 12, true, true);

    // Subtitle with better typography
    const loadingText = this.add.text(width / 2, height / 2 - 70, 'Descending into the Silent Zone...', {
      fontFamily: '"Segoe UI", Tahoma, sans-serif',
      fontSize: '18px',
      color: '#4db8ff',
      fontStyle: 'italic',
      letterSpacing: 1,
    });
    loadingText.setOrigin(0.5, 0.5);

    // Percentage text with monospace font
    const percentText = this.add.text(width / 2, height / 2, '0%', {
      fontFamily: '"Courier New", monospace',
      fontSize: '28px',
      color: '#00ffff',
      fontStyle: 'bold',
    });
    percentText.setOrigin(0.5, 0.5);

    // Asset being loaded
    const assetText = this.add.text(width / 2, height / 2 + 55, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      color: '#5599bb',
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      percentText.setText(Math.floor(value * 100) + '%');
      progressBar.clear();
      // Gradient-like effect with layered bars
      progressBar.fillStyle(0x004455, 0.8);
      progressBar.fillRoundedRect(width / 2 - 210, height / 2 - 25, 420 * value, 50, 8);
      progressBar.fillStyle(0x00d4ff, 1);
      progressBar.fillRoundedRect(width / 2 - 210, height / 2 - 25, 420 * value, 50, 8);
      // Top shine
      progressBar.fillStyle(0xffffff, 0.2);
      progressBar.fillRoundedRect(width / 2 - 208, height / 2 - 23, (420 * value) - 4, 18, 6);
    });

    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      assetText.setText('Loading: ' + file.key);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      percentText.destroy();
      loadingText.destroy();
      assetText.destroy();

      // Fade out title with smooth transition
      this.tweens.add({
        targets: titleText,
        alpha: 0,
        duration: 600,
        ease: 'Cubic.easeOut',
        onComplete: () => titleText.destroy()
      });
    });

    // Load all game images
    this.load.image('echo', isClassic ? echoClassicImg : echoTurtleImg);
    this.load.image('ocean_bg_far', oceanBgFarImg);
    this.load.image('ocean_bg_mid', oceanBgMidImg);
    this.load.image('plastic', isClassic ? plasticClassicImg : plasticBagImg);
    this.load.image('ghost_net', isClassic ? ghostNetClassicImg : ghostNetImg);
    this.load.image('apex_ship', isClassic ? apexShipClassicImg : apexTrawlerImg);
    this.load.image('jellyfish', isClassic ? jellyfishClassicImg : jellyfishImg);
    this.load.image('sanctuary', isClassic ? sanctuaryClassicImg : sanctuaryImg);
    this.load.image('overseer', isClassic ? overseerClassicImg : overseerImg);
  }

  create() {
    // Small delay for visual polish
    this.time.delayedCall(600, () => {
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    });
  }
}
