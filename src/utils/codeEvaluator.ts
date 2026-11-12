import * as Blockly from 'blockly';

export interface EvaluationResult {
  score: number;
  stars: number;
  passed: boolean;
  message: string;
  feedback: string;
  criteria: Array<{
    id: string;
    label: string;
    passed: boolean;
    points: number;
  }>;
}

export function evaluateSnakeLevel(
  levelId: number,
  workspace: Blockly.WorkspaceSvg | null,
  pythonCode: string
): EvaluationResult {
  if (!workspace) {
    return {
      score: 0,
      stars: 0,
      passed: false,
      message: 'Area kerja belum siap',
      feedback: 'Susun balok terlebih dahulu di area kerja ya!',
      criteria: [],
    };
  }

  const allBlocks = workspace.getAllBlocks(false);
  const blockTypes = allBlocks.map((b) => b.type);

  if (levelId === 1) {
    const hasInit = blockTypes.includes('snake_init');
    const posBlock = allBlocks.find((b) => b.type === 'snake_set_position');
    const hasPosition = Boolean(posBlock);

    // Extract X and Y values from block inputs or Python code
    let valX: number | null = null;
    let valY: number | null = null;

    if (posBlock) {
      const targetX = posBlock.getInputTargetBlock('POS_X');
      const targetY = posBlock.getInputTargetBlock('POS_Y');
      if (targetX) {
        const num = targetX.getFieldValue('NUM');
        if (num !== null && num !== undefined && num !== '') {
          valX = parseInt(num, 10);
        }
      }
      if (targetY) {
        const num = targetY.getFieldValue('NUM');
        if (num !== null && num !== undefined && num !== '') {
          valY = parseInt(num, 10);
        }
      }
    }

    // Fallback extraction from generated Python code:
    const xMatch = pythonCode.match(/ular_x\s*=\s*(\d+)/);
    const yMatch = pythonCode.match(/ular_y\s*=\s*(\d+)/);
    if ((valX === null || isNaN(valX)) && xMatch) valX = parseInt(xMatch[1], 10);
    if ((valY === null || isNaN(valY)) && yMatch) valY = parseInt(yMatch[1], 10);

    const isConnected = hasPosition && valX !== null && valY !== null;
    const isPosCorrect = valX === 10 && valY === 10;
    const hasPythonCode = pythonCode.includes('ular_x') && pythonCode.includes('lebar_papan');

    const criteria = [
      { id: 'c1', label: 'Memasang balok Mulai Game Snake (Ukuran 20x20)', passed: hasInit, points: 25 },
      { id: 'c2', label: 'Memasang balok posisi kepala ular', passed: isConnected, points: 25 },
      {
        id: 'c3',
        label: `Koordinat kepala ular tepat di tengah: X=10, Y=10 (Saat ini: X=${valX ?? '?'}, Y=${valY ?? '?'})`,
        passed: isPosCorrect,
        points: 35,
      },
      { id: 'c4', label: 'Sintaks kode Python terbentuk sempurna', passed: hasPythonCode, points: 15 },
    ];

    const score = criteria.reduce((acc, c) => (c.passed ? acc + c.points : acc), 0);
    const passed = isPosCorrect && hasInit && isConnected;
    const stars = score >= 95 ? 3 : score >= 75 ? 2 : 1;

    let feedback = 'Luar biasa! Kamu berhasil menaruh kepala ular Kiki tepat di tengah papan 20x20 (X=10, Y=10)!';
    if (!passed) {
      if (!hasInit) {
        feedback = 'Yuk pasang balok hijau "Mulai Game Snake" terlebih dahulu!';
      } else if (!hasPosition) {
        feedback = 'Jangan lupa sambungkan balok "Taruh Kepala Ular di: X, Y" di bawah balok Mulai Game!';
      } else if (!isPosCorrect) {
        feedback = `Kepala ular Kiki saat ini berada di petak (X=${valX ?? '?'}, Y=${valY ?? '?'}). Ubah angka kotak menjadi X = 10 dan Y = 10 agar tepat di tengah arena!`;
      }
    }

    return {
      score,
      stars,
      passed,
      message: passed ? 'Misi Berhasil Diselesaikan!' : 'Koordinat Belum Tepat di Tengah!',
      feedback,
      criteria,
    };
  }

  if (levelId === 2) {
    const hasInit = blockTypes.includes('snake_init');
    const hasLoop = blockTypes.includes('snake_loop');
    const hasStep = blockTypes.includes('snake_step_forward');
    const stepInsideLoop = pythonCode.includes('while game_aktif:') && pythonCode.includes('ular_x += 1');

    const criteria = [
      { id: 'c1', label: 'Menyiapkan papan game awal', passed: hasInit, points: 25 },
      { id: 'c2', label: 'Memasang balok perulangan Game Loop (while)', passed: hasLoop, points: 25 },
      { id: 'c3', label: 'Memasang balok "Gerakkan Ular Maju (1 Petak)"', passed: hasStep, points: 25 },
      { id: 'c4', label: 'Balok gerak berada di dalam Game Loop', passed: stepInsideLoop, points: 25 },
    ];

    const score = criteria.reduce((acc, c) => (c.passed ? acc + c.points : acc), 0);
    const passed = score >= 70;
    const stars = score >= 95 ? 3 : score >= 70 ? 2 : 1;

    let feedback = 'Hebat! Kiki si Ular sekarang bisa meluncur maju otomatis di dalam perulangan Game Loop!';
    if (score < 70) {
      if (!hasLoop) feedback = 'Gunakan balok biru "Setiap Detik Game (Loop)" dari kategori Gerakan Ular!';
      else if (!hasStep) feedback = 'Tarik balok "Gerakkan Ular Maju" dan masukkan ke dalam balok loop!';
    }

    return {
      score,
      stars,
      passed,
      message: passed ? 'Keren! Ular Berhasil Meluncur!' : 'Periksa Susunan Balok Loop!',
      feedback,
      criteria,
    };
  }

  if (levelId === 3) {
    const keyBlocks = allBlocks.filter((b) => b.type === 'snake_key_handler');
    const directions = keyBlocks.map((b) => b.getFieldValue('DIRECTION'));
    const hasUp = directions.includes('UP');
    const hasDown = directions.includes('DOWN');
    const hasLeft = directions.includes('LEFT');
    const hasRight = directions.includes('RIGHT');
    const allDirs = hasUp && hasDown && hasLeft && hasRight;

    const criteria = [
      { id: 'c1', label: 'Memasang tombol Panah Atas (UP)', passed: hasUp, points: 25 },
      { id: 'c2', label: 'Memasang tombol Panah Bawah (DOWN)', passed: hasDown, points: 25 },
      { id: 'c3', label: 'Memasang tombol Panah Kiri (LEFT)', passed: hasLeft, points: 25 },
      { id: 'c4', label: 'Memasang tombol Panah Kanan (RIGHT)', passed: hasRight, points: 25 },
    ];

    const score = criteria.reduce((acc, c) => (c.passed ? acc + c.points : acc), 0);
    const passed = score >= 75;
    const stars = score >= 95 ? 3 : score >= 70 ? 2 : 1;

    let feedback = 'Sempurna! Semua 4 tombol arah kemudi telah terpasang rapi!';
    if (score < 75) {
      feedback = 'Pastikan kamu sudah memasang 4 balok tombol arah: Panah Atas, Bawah, Kiri, dan Kanan!';
    }

    return {
      score,
      stars,
      passed,
      message: passed ? 'Ular Siap Dikemudikan!' : 'Lengkapi Tombol Kemudi!',
      feedback,
      criteria,
    };
  }

  if (levelId === 4) {
    const hasFood = blockTypes.includes('snake_spawn_food');
    const foodType = allBlocks.find((b) => b.type === 'snake_spawn_food')?.getFieldValue('FOOD_TYPE');
    const hasRandomImport = pythonCode.includes('import random') && pythonCode.includes('random.randint');

    const criteria = [
      { id: 'c1', label: 'Memasang balok "Munculkan Makanan di Koordinat Acak"', passed: hasFood, points: 35 },
      { id: 'c2', label: 'Memilih jenis makanan (Apel / Stroberi / Bintang)', passed: Boolean(foodType), points: 30 },
      { id: 'c3', label: 'Fungsi Python random.randint() aktif', passed: hasRandomImport, points: 35 },
    ];

    const score = criteria.reduce((acc, c) => (c.passed ? acc + c.points : acc), 0);
    const passed = score >= 70;
    const stars = score >= 95 ? 3 : score >= 70 ? 2 : 1;

    let feedback = 'Bagus sekali! Apel lezat berhasil dimunculkan secara acak dengan modul random di Python!';
    if (score < 70) {
      feedback = 'Tarik balok "Munculkan Makanan di Koordinat Acak" dari kategori Apel & Makanan ya!';
    }

    return {
      score,
      stars,
      passed,
      message: passed ? 'Apel Muncul di Lapangan!' : 'Pasang Balok Apel Acak!',
      feedback,
      criteria,
    };
  }

  if (levelId === 5) {
    const hasCheckFood = blockTypes.includes('snake_check_food');
    const hasScore = blockTypes.includes('snake_add_score');
    const hasGrow = blockTypes.includes('snake_grow');
    const hasRespawn = blockTypes.includes('snake_respawn_food');

    const criteria = [
      { id: 'c1', label: 'Memasang balok "Jika Kepala Ular Menyentuh Makanan"', passed: hasCheckFood, points: 25 },
      { id: 'c2', label: 'Menambahkan poin skor (skor += 10)', passed: hasScore, points: 25 },
      { id: 'c3', label: 'Menambah ruas panjang tubuh ular (+1)', passed: hasGrow, points: 25 },
      { id: 'c4', label: 'Memindahkan makanan ke titik acak baru', passed: hasRespawn, points: 25 },
    ];

    const score = criteria.reduce((acc, c) => (c.passed ? acc + c.points : acc), 0);
    const passed = score >= 75;
    const stars = score >= 95 ? 3 : score >= 70 ? 2 : 1;

    let feedback = 'Nyam! Kiki makan apel, skor bertambah, dan tubuh ular memanjang secara sempurna!';
    if (score < 75) {
      feedback = 'Di dalam balok "Jika Ular Menyentuh Makanan", jangan lupa tambahkan balok Tambah Skor dan Perpanjang Tubuh!';
    }

    return {
      score,
      stars,
      passed,
      message: passed ? 'Makan Apel & Tumbuh Berhasil!' : 'Lengkapi Aksi Makan Apel!',
      feedback,
      criteria,
    };
  }

  if (levelId === 6) {
    const hasCollision = blockTypes.includes('snake_check_collision');
    const hasGameOver = blockTypes.includes('snake_game_over');
    const hasBoundaryLogic = pythonCode.includes('nabrak_dinding') || pythonCode.includes('lebar_papan');

    const criteria = [
      { id: 'c1', label: 'Memasang balok "Jika Menabrak Dinding atau Tubuh Sendiri"', passed: hasCollision, points: 35 },
      { id: 'c2', label: 'Memasang balok "Hentikan Permainan (Game Over)"', passed: hasGameOver, points: 35 },
      { id: 'c3', label: 'Pengecekan batas arena aktif di Python', passed: hasBoundaryLogic, points: 30 },
    ];

    const score = criteria.reduce((acc, c) => (c.passed ? acc + c.points : acc), 0);
    const passed = score >= 70;
    const stars = score >= 95 ? 3 : score >= 70 ? 2 : 1;

    let feedback = 'Juara! Game Snake kamu sudah lengkap 100% dengan aturan game over yang adil!';
    if (score < 70) {
      feedback = 'Tambahkan balok "Jika Menabrak Dinding atau Tubuh" dan masukkan balok "Game Over" di dalamnya!';
    }

    return {
      score,
      stars,
      passed,
      message: passed ? 'Selamat! Game Snake Kamu Tuntas!' : 'Lengkapi Aturan Game Over!',
      feedback,
      criteria,
    };
  }

  // Level 7 or general sandbox
  const count = allBlocks.length;
  const score = Math.min(100, Math.max(70, count * 10));
  return {
    score,
    stars: 3,
    passed: true,
    message: 'Eksperimen Koding Berhasil!',
    feedback: `Kreasi yang keren! Kamu merakit ${count} balok logika yang menghasilkan program Python kreatif!`,
    criteria: [
      { id: 'c1', label: 'Menyusun balok kreasi mandiri', passed: true, points: 50 },
      { id: 'c2', label: 'Mengekspor logika ke kode Python murni', passed: true, points: 50 },
    ],
  };
}

export function evaluateGameStage(
  gameId: string,
  stageId: number,
  workspace: Blockly.WorkspaceSvg | null,
  pythonCode: string
): EvaluationResult {
  if (!workspace) {
    return {
      score: 0,
      stars: 0,
      passed: false,
      message: 'Area kerja belum siap',
      feedback: 'Susun balok terlebih dahulu di area kerja ya!',
      criteria: [],
    };
  }

  const allBlocks = workspace.getAllBlocks(false);
  const blockTypes = allBlocks.map((b) => b.type);

  if (gameId === 'pong') {
    const hasInit = blockTypes.includes('pong_init');
    const hasMove = blockTypes.includes('pong_move_paddle');
    const hasBounce = blockTypes.includes('pong_ball_bounce') || blockTypes.includes('pong_wall_bounce');
    const hasGoal = blockTypes.includes('pong_check_goal');

    const criteria = [
      { id: 'p1', label: 'Inisialisasi Game Pong (Ukuran Meja & Kecepatan)', passed: hasInit, points: 25 },
      { id: 'p2', label: 'Mengatur kemudi raket pemain', passed: hasMove || stageId === 1, points: 25 },
      { id: 'p3', label: 'Logika fisika pantulan bola', passed: hasBounce || stageId <= 2, points: 25 },
      { id: 'p4', label: 'Pengecekan gol dan penambahan skor', passed: hasGoal || stageId <= 4, points: 25 },
    ];

    const score = criteria.reduce((acc, c) => (c.passed ? acc + c.points : acc), 0);
    const passed = score >= 70;
    return {
      score,
      stars: score >= 90 ? 3 : 2,
      passed,
      message: passed ? 'Tahap Game Pong Berhasil!' : 'Periksa Balok Pong Kamu!',
      feedback: passed
        ? 'Bagus sekali! Logika fisika meja tenis meja dan raket berhasil kamu terapkan!'
        : 'Periksa kembali balok yang diperlukan untuk tahap ini di laci Blockly sebelah kiri.',
      criteria,
    };
  }

  if (gameId === 'rps') {
    const hasInit = blockTypes.includes('rps_init');
    const hasBot = blockTypes.includes('rps_bot_choice');
    const hasLogic = blockTypes.includes('rps_check_logic');

    const criteria = [
      { id: 'r1', label: 'Menyiapkan daftar pilihan [Batu, Gunting, Kertas]', passed: hasInit, points: 35 },
      { id: 'r2', label: 'Komputer memilih acak (random.choice)', passed: hasBot || stageId === 1, points: 35 },
      { id: 'r3', label: 'Logika percabangan penentuan pemenang (if-elif-else)', passed: hasLogic || stageId <= 2, points: 30 },
    ];

    const score = criteria.reduce((acc, c) => (c.passed ? acc + c.points : acc), 0);
    const passed = score >= 70;
    return {
      score,
      stars: score >= 90 ? 3 : 2,
      passed,
      message: passed ? 'Logika Batu Gunting Kertas Sempurna!' : 'Lengkapi Balok Aturan!',
      feedback: passed
        ? 'Mantap! Percabangan cerdas if-elif-else berhasil memandu duel melawan komputer!'
        : 'Pastikan balok inisialisasi dan logika pemenang sudah tersambung dengan benar.',
      criteria,
    };
  }

  if (gameId === 'flappy') {
    const hasInit = blockTypes.includes('flappy_init');
    const hasGravity = blockTypes.includes('flappy_gravity_loop');
    const hasJump = blockTypes.includes('flappy_jump');
    const hasCollision = blockTypes.includes('flappy_collision');

    const criteria = [
      { id: 'f1', label: 'Inisialisasi Burung & Gravitasi', passed: hasInit, points: 25 },
      { id: 'f2', label: 'Menerapkan gaya gravitasi bumi', passed: hasGravity || stageId === 1, points: 25 },
      { id: 'f3', label: 'Kontrol kepakan sayap melompat (kecepatan negatif)', passed: hasJump || stageId <= 2, points: 25 },
      { id: 'f4', label: 'Deteksi tabrakan pipa & skor', passed: hasCollision || stageId <= 4, points: 25 },
    ];

    const score = criteria.reduce((acc, c) => (c.passed ? acc + c.points : acc), 0);
    const passed = score >= 70;
    return {
      score,
      stars: score >= 90 ? 3 : 2,
      passed,
      message: passed ? 'Fisika Flappy Bird Berhasil!' : 'Periksa Balok Fisika Burung!',
      feedback: passed
        ? 'Keren! Bibo si burung kuning sekarang bisa terbang menembus gravitasi dan rintangan!'
        : 'Pastikan balok gravitasi dan kepakan sayap sudah terpasang dengan tepat.',
      criteria,
    };
  }

  if (gameId === 'space') {
    const hasInit = blockTypes.includes('space_init');
    const hasLaser = blockTypes.includes('space_shoot_laser');
    const hasHit = blockTypes.includes('space_alien_hit');

    const criteria = [
      { id: 's1', label: 'Menyiapkan pesawat tempur & 3 nyawa', passed: hasInit, points: 35 },
      { id: 's2', label: 'Mekanisme tembakan laser biru', passed: hasLaser || stageId <= 2, points: 35 },
      { id: 's3', label: 'Deteksi tabrakan laser mengenai alien (+20 poin)', passed: hasHit || stageId <= 4, points: 30 },
    ];

    const score = criteria.reduce((acc, c) => (c.passed ? acc + c.points : acc), 0);
    const passed = score >= 70;
    return {
      score,
      stars: score >= 90 ? 3 : 2,
      passed,
      message: passed ? 'Misi Tempur Antariksa Sukses!' : 'Lengkapi Balok Pesawat!',
      feedback: passed
        ? 'Luar biasa! Senjata laser dan sensor ledakan alien siap mengamankan galaksi!'
        : 'Pastikan balok pesawat tempur dan tembakan laser sudah tersusun dengan rapi.',
      criteria,
    };
  }

  return {
    score: 100,
    stars: 3,
    passed: true,
    message: 'Tahap Berhasil!',
    feedback: 'Balok tersusun dengan baik dan siap dijalankan!',
    criteria: [{ id: 'g1', label: 'Menyusun balok sesuai petunjuk', passed: true, points: 100 }],
  };
}
