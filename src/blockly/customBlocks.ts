import * as Blockly from 'blockly';
import { pythonGenerator, Order } from 'blockly/python';

let customBlocksRegistered = false;

export function registerCustomBlocks() {
  if (customBlocksRegistered) return;
  customBlocksRegistered = true;

  // 1. Inisialisasi Game
  Blockly.Blocks['snake_init'] = {
    init: function () {
      this.appendValueInput('WIDTH')
        .setCheck('Number')
        .appendField('🎮 Mulai Game Snake: Lebar');
      this.appendValueInput('HEIGHT')
        .setCheck('Number')
        .appendField('Tinggi');
      this.setNextStatement(true, null);
      this.setColour('#10b981'); // Emerald green
      this.setTooltip('Menyiapkan ukuran arena papan permainan Snake');
    },
  };

  pythonGenerator.forBlock['snake_init'] = function (block) {
    const width = pythonGenerator.valueToCode(block, 'WIDTH', Order.ATOMIC) || '20';
    const height = pythonGenerator.valueToCode(block, 'HEIGHT', Order.ATOMIC) || '20';
    return `# 1. Inisialisasi Game Snake\nlebar_papan = ${width}\ntinggi_papan = ${height}\nskor = 0\ngame_aktif = True\n\n`;
  };

  // 2. Set Posisi Awal Ular
  Blockly.Blocks['snake_set_position'] = {
    init: function () {
      this.appendValueInput('POS_X')
        .setCheck('Number')
        .appendField('📍 Taruh Kepala Ular di: X');
      this.appendValueInput('POS_Y')
        .setCheck('Number')
        .appendField('Y');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669'); // Darker green
      this.setTooltip('Menentukan koordinat awal kepala ular');
    },
  };

  pythonGenerator.forBlock['snake_set_position'] = function (block) {
    const x = pythonGenerator.valueToCode(block, 'POS_X', Order.ATOMIC) || '10';
    const y = pythonGenerator.valueToCode(block, 'POS_Y', Order.ATOMIC) || '10';
    return `# 2. Posisi awal Kiki si Ular\nular_x = ${x}\nular_y = ${y}\nbadan_ular = [[ular_x, ular_y]]\narah = "KANAN"\nprint(f"Ular siap meluncur di kotak ({ular_x}, {ular_y})")\n\n`;
  };

  // 3. Game Loop
  Blockly.Blocks['snake_loop'] = {
    init: function () {
      this.appendDummyInput().appendField('🔄 Setiap Detik Game (Loop):');
      this.appendStatementInput('DO').appendField('lakukan');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#2563eb'); // Blue
      this.setTooltip('Perulangan game loop yang berjalan terus menerus');
    },
  };

  pythonGenerator.forBlock['snake_loop'] = function (block) {
    const branch = pythonGenerator.statementToCode(block, 'DO') || '    pass\n';
    return `# 3. Perulangan Game Loop\nwhile game_aktif:\n${branch}\n    perbarui_layar()\n    tunggu_detik(kecepatan)\n\n`;
  };

  // 4. Gerakkan Ular Maju
  Blockly.Blocks['snake_step_forward'] = {
    init: function () {
      this.appendDummyInput().appendField('🏃 Gerakkan Ular Maju (1 Petak)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#3b82f6'); // Sky blue
      this.setTooltip('Ular maju 1 petak ke arah yang sedang dituju');
    },
  };

  pythonGenerator.forBlock['snake_step_forward'] = function () {
    return `    # Ular bergerak ke arah yang dipilih\n    if arah == "ATAS":\n        ular_y -= 1\n    elif arah == "BAWAH":\n        ular_y += 1\n    elif arah == "KIRI":\n        ular_x -= 1\n    elif arah == "KANAN":\n        ular_x += 1\n    # Geser badan ular\n    badan_ular.insert(0, [ular_x, ular_y])\n    badan_ular.pop()\n`;
  };

  // 5. Input Tombol Arah
  Blockly.Blocks['snake_key_handler'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🕹️ Ketika Tombol Keyboard')
        .appendField(
          new Blockly.FieldDropdown([
            ['Panah Atas (⬆️)', 'UP'],
            ['Panah Bawah (⬇️)', 'DOWN'],
            ['Panah Kiri (⬅️)', 'LEFT'],
            ['Panah Kanan (➡️)', 'RIGHT'],
          ]),
          'DIRECTION'
        )
        .appendField('Ditekan: Ubah Arah Ular');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d97706'); // Amber
      this.setTooltip('Mengubah arah jalan ular saat tombol ditekan');
    },
  };

  pythonGenerator.forBlock['snake_key_handler'] = function (block) {
    const dir = block.getFieldValue('DIRECTION');
    const keyMap: Record<string, string> = {
      UP: 'ArrowUp',
      DOWN: 'ArrowDown',
      LEFT: 'ArrowLeft',
      RIGHT: 'ArrowRight',
    };
    return `# Event tombol panah\ndef ketika_tombol_ditekan(tombol):\n    global arah\n    if tombol == "${keyMap[dir]}":\n        arah = "${dir}"\n`;
  };

  // 6. Munculkan Apel Acak
  Blockly.Blocks['snake_spawn_food'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🍎 Munculkan Makanan')
        .appendField(
          new Blockly.FieldDropdown([
            ['Apel Merah', 'apple'],
            ['Stroberi Manis', 'strawberry'],
            ['Bintang Emas', 'star'],
            ['Donat Cokelat', 'donut'],
          ]),
          'FOOD_TYPE'
        )
        .appendField('di Koordinat Acak');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#dc2626'); // Red
      this.setTooltip('Menaruh makanan di posisi acak di dalam papan');
    },
  };

  pythonGenerator.forBlock['snake_spawn_food'] = function (block) {
    const food = block.getFieldValue('FOOD_TYPE');
    return `import random\n# Munculkan ${food} di petak acak\napel_x = random.randint(1, lebar_papan - 2)\napel_y = random.randint(1, tinggi_papan - 2)\njenis_makanan = "${food}"\n\n`;
  };

  // 7. Cek Makan Apel
  Blockly.Blocks['snake_check_food'] = {
    init: function () {
      this.appendDummyInput().appendField('😋 Jika Kepala Ular Menyentuh Makanan:');
      this.appendStatementInput('DO').appendField('maka');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ea580c'); // Orange
      this.setTooltip('Pengecekan apakah koordinat kepala ular sama dengan apel');
    },
  };

  pythonGenerator.forBlock['snake_check_food'] = function (block) {
    const branch = pythonGenerator.statementToCode(block, 'DO') || '        pass\n';
    return `    # Deteksi tabrakan kepala ular dengan makanan\n    if ular_x == apel_x and ular_y == apel_y:\n${branch}`;
  };

  // 8. Tambah Skor
  Blockly.Blocks['snake_add_score'] = {
    init: function () {
      this.appendValueInput('POINTS')
        .setCheck('Number')
        .appendField('⭐ Tambah Nilai Skor Sebesar');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ca8a04'); // Yellow
      this.setTooltip('Menambahkan poin ke skor pemain');
    },
  };

  pythonGenerator.forBlock['snake_add_score'] = function (block) {
    const pts = pythonGenerator.valueToCode(block, 'POINTS', Order.ATOMIC) || '10';
    return `        skor += ${pts}\n        print(f"Nyam! Skor bertambah! Total skor: {skor}")\n`;
  };

  // 9. Perpanjang Badan Ular
  Blockly.Blocks['snake_grow'] = {
    init: function () {
      this.appendDummyInput().appendField('📏 Perpanjang Tubuh Ular (+1 Ruas)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#16a34a'); // Green
      this.setTooltip('Menambah 1 ruas di ekor ular sehingga semakin panjang');
    },
  };

  pythonGenerator.forBlock['snake_grow'] = function () {
    return `        # Tambah ruas ekor agar ular memanjang\n        badan_ular.append(badan_ular[-1].copy())\n`;
  };

  // 10. Pindahkan Apel Baru
  Blockly.Blocks['snake_respawn_food'] = {
    init: function () {
      this.appendDummyInput().appendField('🎲 Pindahkan Makanan ke Tempat Acak Baru');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#e11d48'); // Rose
      this.setTooltip('Mengacak ulang letak apel di petak lain');
    },
  };

  pythonGenerator.forBlock['snake_respawn_food'] = function () {
    return `        # Cari koordinat baru untuk makanan\n        apel_x = random.randint(1, lebar_papan - 2)\n        apel_y = random.randint(1, tinggi_papan - 2)\n`;
  };

  // 11. Cek Tabrakan Dinding & Ekor
  Blockly.Blocks['snake_check_collision'] = {
    init: function () {
      this.appendDummyInput().appendField('💥 Jika Menabrak Dinding atau Tubuh Sendiri:');
      this.appendStatementInput('DO').appendField('maka');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#9333ea'); // Purple
      this.setTooltip('Pengecekan jika kepala ular keluar dari papan atau menggigit ekor');
    },
  };

  pythonGenerator.forBlock['snake_check_collision'] = function (block) {
    const branch = pythonGenerator.statementToCode(block, 'DO') || '        pass\n';
    return `    # Pengecekan batas arena dan tabrakan badan\n    nabrak_dinding = ular_x < 0 or ular_x >= lebar_papan or ular_y < 0 or ular_y >= tinggi_papan\n    nabrak_badan = [ular_x, ular_y] in badan_ular[1:]\n    if nabrak_dinding or nabrak_badan:\n${branch}`;
  };

  // 12. Game Over
  Blockly.Blocks['snake_game_over'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🛑 Hentikan Permainan (Game Over) dengan Pesan')
        .appendField(new Blockly.FieldTextInput('Aduh, nabrak! Coba lagi ya!'), 'MESSAGE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#be123c'); // Dark red
      this.setTooltip('Menghentikan game loop dan menampilkan pesan game over');
    },
  };

  pythonGenerator.forBlock['snake_game_over'] = function (block) {
    const msg = block.getFieldValue('MESSAGE');
    return `        game_aktif = False\n        print("${msg}")\n        tampilkan_game_over(skor)\n`;
  };

  // 13. Atur Kecepatan Ular
  Blockly.Blocks['snake_set_speed'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('⚡ Atur Kecepatan Jalannya Ular:')
        .appendField(
          new Blockly.FieldDropdown([
            ['Santai (Pelan)', '1'],
            ['Standar (Sedang)', '2'],
            ['Kilat (Cepat)', '3'],
            ['Super Gesit (Sangat Cepat)', '4'],
          ]),
          'SPEED'
        );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0284c7'); // Cyan
      this.setTooltip('Mengatur seberapa cepat ular meluncur di layar');
    },
  };

  pythonGenerator.forBlock['snake_set_speed'] = function (block) {
    const spd = block.getFieldValue('SPEED');
    return `kecepatan = ${spd}  # Tingkat kecepatan ular\n`;
  };

  // 14. Efek Suara
  Blockly.Blocks['snake_play_sound'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🔊 Putar Suara Efek:')
        .appendField(
          new Blockly.FieldDropdown([
            ['Nyam! (Makan Apel)', 'eat'],
            ['Belok (Tik-Tik)', 'turn'],
            ['Toreh Juara (Fanfare)', 'win'],
            ['Jedug! (Tabrakan)', 'hit'],
          ]),
          'SOUND'
        );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7c3aed'); // Violet
      this.setTooltip('Memutar suara efek menyenangkan saat bermain');
    },
  };

  pythonGenerator.forBlock['snake_play_sound'] = function (block) {
    const snd = block.getFieldValue('SOUND');
    return `        mainkan_suara("${snd}")\n`;
  };

  // ==========================================
  // GAME 2: PONG RETRO BLOCKS
  // ==========================================
  Blockly.Blocks['pong_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🏓 Mulai Game Pong: Kecepatan Bola')
        .appendField(new Blockly.FieldNumber(4, 2, 8), 'BALL_SPEED')
        .appendField('Target Skor')
        .appendField(new Blockly.FieldNumber(5, 3, 10), 'MAX_SCORE');
      this.setNextStatement(true, null);
      this.setColour('#0284c7');
      this.setTooltip('Inisialisasi Game Pong Tenis Meja Retro');
    },
  };

  pythonGenerator.forBlock['pong_init'] = function (block) {
    const spd = block.getFieldValue('BALL_SPEED');
    const maxScore = block.getFieldValue('MAX_SCORE');
    return `# Inisialisasi Game Pong\nbola_x, bola_y = 200, 150\nkecepatan_bola_x, kecepatan_bola_y = ${spd}, ${spd}\nraket_pemain_y, raket_bot_y = 120, 120\nskor_pemain, skor_bot = 0, 0\ntarget_skor = ${maxScore}\n`;
  };

  Blockly.Blocks['pong_move_paddle'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🕹️ Gerakkan Raket Pemain ke')
        .appendField(
          new Blockly.FieldDropdown([
            ['Atas (⬆️)', 'UP'],
            ['Bawah (⬇️)', 'DOWN'],
          ]),
          'DIR'
        );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#2563eb');
    },
  };

  pythonGenerator.forBlock['pong_move_paddle'] = function (block) {
    const dir = block.getFieldValue('DIR');
    return `    if tombol == "${dir === 'UP' ? 'ArrowUp' : 'ArrowDown'}":\n        raket_pemain_y += ${dir === 'UP' ? -15 : 15}\n`;
  };

  Blockly.Blocks['pong_wall_bounce'] = {
    init: function () {
      this.appendDummyInput().appendField('⚡ Pantulan Dinding: Balikkan Arah Y jika Tabrak Atas/Bawah');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0284c7');
      this.setTooltip('Bola memantul saat menyentuh batas atas atau bawah meja');
    },
  };

  pythonGenerator.forBlock['pong_wall_bounce'] = function () {
    return `    # Pantulan batas dinding atas & bawah\n    if bola_y <= 10 or bola_y >= 290:\n        kecepatan_bola_y = -kecepatan_bola_y\n        bunyikan_suara("pantul")\n`;
  };

  Blockly.Blocks['pong_ball_bounce'] = {
    init: function () {
      this.appendDummyInput().appendField('🔄 Jika Bola Mengenai Raket: Pantulkan Bola');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669');
    },
  };

  pythonGenerator.forBlock['pong_ball_bounce'] = function () {
    return `    # Deteksi pantulan raket\n    if bola_mengenai_raket():\n        kecepatan_bola_x = -kecepatan_bola_x\n        bunyikan_pantulan()\n`;
  };

  Blockly.Blocks['pong_check_goal'] = {
    init: function () {
      this.appendDummyInput().appendField('🥅 Jika Bola Lewat Garis: Tambah Skor');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d97706');
    },
  };

  pythonGenerator.forBlock['pong_check_goal'] = function () {
    return `    # Pengecekan gol\n    if bola_x > 400:\n        skor_pemain += 1\n        reset_bola_ke_tengah()\n    elif bola_x < 0:\n        skor_bot += 1\n        reset_bola_ke_tengah()\n`;
  };

  // ==========================================
  // GAME 3: ROCK PAPER SCISSORS BLOCKS
  // ==========================================
  Blockly.Blocks['rps_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🪨📄✂️ Mulai Game Batu Gunting Kertas: Skor Menang')
        .appendField(new Blockly.FieldNumber(3, 1, 5), 'WIN_SCORE');
      this.setNextStatement(true, null);
      this.setColour('#e11d48');
    },
  };

  pythonGenerator.forBlock['rps_init'] = function (block) {
    const winScore = block.getFieldValue('WIN_SCORE');
    return `import random\n# Inisialisasi Game Batu Gunting Kertas\npilihan_list = ["Batu", "Gunting", "Kertas"]\nskor_pemain = 0\nskor_komputer = 0\ntarget_menang = ${winScore}\n`;
  };

  Blockly.Blocks['rps_bot_choice'] = {
    init: function () {
      this.appendDummyInput().appendField('🤖 Komputer Memilih Acak (Batu / Gunting / Kertas)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7c3aed');
    },
  };

  pythonGenerator.forBlock['rps_bot_choice'] = function () {
    return `pilihan_bot = random.choice(pilihan_list)\nprint("Komputer memilih:", pilihan_bot)\n`;
  };

  Blockly.Blocks['rps_check_logic'] = {
    init: function () {
      this.appendDummyInput().appendField('⚖️ Tentukan Pemenang Sesuai Aturan:');
      this.appendStatementInput('DO').appendField('aturan');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ca8a04');
    },
  };

  pythonGenerator.forBlock['rps_check_logic'] = function () {
    return `# Logika Pemenang\nif pilihan_pemain == pilihan_bot:\n    hasil = "SERI"\nelif (pilihan_pemain == "Batu" and pilihan_bot == "Gunting") or \\\n     (pilihan_pemain == "Gunting" and pilihan_bot == "Kertas") or \\\n     (pilihan_pemain == "Kertas" and pilihan_bot == "Batu"):\n    hasil = "MENANG"\n    skor_pemain += 1\nelse:\n    hasil = "KALAH"\n    skor_komputer += 1\n`;
  };

  // ==========================================
  // GAME 4: FLAPPY BIRD BLOCKS
  // ==========================================
  Blockly.Blocks['flappy_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🐦 Siapkan Flappy Bird: Gravitasi')
        .appendField(new Blockly.FieldNumber(0.5, 0.1, 1), 'GRAVITY')
        .appendField('Daya Lompat')
        .appendField(new Blockly.FieldNumber(7, 4, 12), 'JUMP');
      this.setNextStatement(true, null);
      this.setColour('#ca8a04');
    },
  };

  pythonGenerator.forBlock['flappy_init'] = function (block) {
    const grav = block.getFieldValue('GRAVITY');
    const jump = block.getFieldValue('JUMP');
    return `# Inisialisasi Flappy Bird\nburung_y = 150\nkecepatan_y = 0\ngravitasi = ${grav}\ndaya_lompat = -${jump}\nskor = 0\ngame_aktif = True\n`;
  };

  Blockly.Blocks['flappy_jump'] = {
    init: function () {
      this.appendDummyInput().appendField('🪽 Ketika Tombol Spasi Ditekan: Burung Kepakkan Sayap & Lompat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d97706');
    },
  };

  pythonGenerator.forBlock['flappy_jump'] = function () {
    return `def ketika_spasi_ditekan():\n    global kecepatan_y\n    kecepatan_y = daya_lompat\n    suara_kepak_sayap()\n`;
  };

  Blockly.Blocks['flappy_gravity_loop'] = {
    init: function () {
      this.appendDummyInput().appendField('⏱️ Setiap Detik: Tarik Burung ke Bawah (Gravitasi)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#16a34a');
    },
  };

  pythonGenerator.forBlock['flappy_gravity_loop'] = function () {
    return `    # Fisika gravitasi\n    kecepatan_y += gravitasi\n    burung_y += kecepatan_y\n    # Gerakkan pipa ke kiri\n    pipa_x -= 3\n`;
  };

  Blockly.Blocks['flappy_collision'] = {
    init: function () {
      this.appendDummyInput().appendField('💥 Jika Menabrak Pipa Hijau atau Jatuh ke Tanah: Game Over');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#dc2626');
    },
  };

  pythonGenerator.forBlock['flappy_collision'] = function () {
    return `    if burung_y > 380 or tabrak_pipa():\n        game_aktif = False\n        print("Aduh jatuh! Game Over!")\n`;
  };

  // ==========================================
  // GAME 5: SPACE SHOOTER BLOCKS
  // ==========================================
  Blockly.Blocks['space_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('👾 Siapkan Pesawat Luar Angkasa: Nyawa')
        .appendField(new Blockly.FieldNumber(3, 1, 5), 'LIVES')
        .appendField('Kecepatan Laser')
        .appendField(new Blockly.FieldNumber(8, 4, 15), 'LASER_SPEED');
      this.setNextStatement(true, null);
      this.setColour('#9333ea');
    },
  };

  pythonGenerator.forBlock['space_init'] = function (block) {
    const lives = block.getFieldValue('LIVES');
    const laserSpeed = block.getFieldValue('LASER_SPEED');
    return `# Inisialisasi Space Shooter\npesawat_x = 180\npesawat_y = 350\nnyawa = ${lives}\nkecepatan_laser = ${laserSpeed}\nlaser_list = []\nalien_list = []\nskor = 0\n`;
  };

  Blockly.Blocks['space_shoot_laser'] = {
    init: function () {
      this.appendDummyInput().appendField('⚡ Tembakkan Laser Biru dari Moncong Pesawat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#3b82f6');
    },
  };

  pythonGenerator.forBlock['space_shoot_laser'] = function () {
    return `def tembak_laser():\n    laser_list.append([pesawat_x + 16, pesawat_y])\n    suara_laser()\n`;
  };

  Blockly.Blocks['space_alien_hit'] = {
    init: function () {
      this.appendDummyInput().appendField('💥 Jika Laser Mengenai Alien: Hancurkan Alien & Tambah Skor +20');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#10b981');
    },
  };

  pythonGenerator.forBlock['space_alien_hit'] = function () {
    return `    # Cek tabrakan laser & alien\n    for laser in laser_list:\n        for alien in alien_list:\n            if tabrakan(laser, alien):\n                alien_list.remove(alien)\n                laser_list.remove(laser)\n                skor += 20\n`;
  };
}

export function getToolboxForGame(gameId: string) {
  if (gameId === 'pong') {
    return {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Meja & Raket',
          colour: '#0284c7',
          contents: [
            { kind: 'block', type: 'pong_init' },
            { kind: 'block', type: 'pong_move_paddle', fields: { DIR: 'UP' } },
            { kind: 'block', type: 'pong_move_paddle', fields: { DIR: 'DOWN' } },
          ],
        },
        {
          kind: 'category',
          name: 'Pantulan Fisika',
          colour: '#059669',
          contents: [
            { kind: 'block', type: 'pong_wall_bounce' },
            { kind: 'block', type: 'pong_ball_bounce' },
          ],
        },
        {
          kind: 'category',
          name: 'Skor & Gol',
          colour: '#d97706',
          contents: [
            { kind: 'block', type: 'pong_check_goal' },
          ],
        },
        {
          kind: 'category',
          name: 'Angka & Matematika',
          colour: '#475569',
          contents: [
            { kind: 'block', type: 'math_number' },
            { kind: 'block', type: 'math_arithmetic' },
          ],
        },
      ],
    };
  }

  if (gameId === 'rps') {
    return {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Pilihan Tangan',
          colour: '#e11d48',
          contents: [
            { kind: 'block', type: 'rps_init' },
          ],
        },
        {
          kind: 'category',
          name: 'Komputer Acak',
          colour: '#7c3aed',
          contents: [
            { kind: 'block', type: 'rps_bot_choice' },
          ],
        },
        {
          kind: 'category',
          name: 'Logika Pemenang',
          colour: '#ca8a04',
          contents: [
            { kind: 'block', type: 'rps_check_logic' },
          ],
        },
        {
          kind: 'category',
          name: 'Skor & Angka',
          colour: '#475569',
          contents: [
            { kind: 'block', type: 'math_number' },
          ],
        },
      ],
    };
  }

  if (gameId === 'flappy') {
    return {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Burung & Gravitasi',
          colour: '#ca8a04',
          contents: [
            { kind: 'block', type: 'flappy_init' },
            { kind: 'block', type: 'flappy_gravity_loop' },
          ],
        },
        {
          kind: 'category',
          name: 'Lompatan Sayap',
          colour: '#d97706',
          contents: [
            { kind: 'block', type: 'flappy_jump' },
          ],
        },
        {
          kind: 'category',
          name: 'Tabrakan & Rintangan',
          colour: '#dc2626',
          contents: [
            { kind: 'block', type: 'flappy_collision' },
          ],
        },
        {
          kind: 'category',
          name: 'Angka & Fisika',
          colour: '#475569',
          contents: [
            { kind: 'block', type: 'math_number' },
          ],
        },
      ],
    };
  }

  if (gameId === 'space') {
    return {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Pesawat & Laser',
          colour: '#9333ea',
          contents: [
            { kind: 'block', type: 'space_init' },
            { kind: 'block', type: 'space_shoot_laser' },
          ],
        },
        {
          kind: 'category',
          name: 'Monster Alien & Ledakan',
          colour: '#10b981',
          contents: [
            { kind: 'block', type: 'space_alien_hit' },
          ],
        },
        {
          kind: 'category',
          name: 'Angka & Nyawa',
          colour: '#475569',
          contents: [
            { kind: 'block', type: 'math_number' },
          ],
        },
      ],
    };
  }

  // Default: Snake Toolbox
  return TOOLBOX_CONFIGURATION;
}

export const TOOLBOX_CONFIGURATION = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Papan & Ular',
      colour: '#10b981',
      contents: [
        {
          kind: 'block',
          type: 'snake_init',
          inputs: {
            WIDTH: { shadow: { type: 'math_number', fields: { NUM: 20 } } },
            HEIGHT: { shadow: { type: 'math_number', fields: { NUM: 20 } } },
          },
        },
        {
          kind: 'block',
          type: 'snake_set_position',
          inputs: {
            POS_X: { shadow: { type: 'math_number', fields: { NUM: 10 } } },
            POS_Y: { shadow: { type: 'math_number', fields: { NUM: 10 } } },
          },
        },
        { kind: 'block', type: 'snake_set_speed' },
      ],
    },
    {
      kind: 'category',
      name: 'Gerakan Ular',
      colour: '#2563eb',
      contents: [
        { kind: 'block', type: 'snake_loop' },
        { kind: 'block', type: 'snake_step_forward' },
      ],
    },
    {
      kind: 'category',
      name: 'Kontrol Tombol',
      colour: '#d97706',
      contents: [
        { kind: 'block', type: 'snake_key_handler', fields: { DIRECTION: 'UP' } },
        { kind: 'block', type: 'snake_key_handler', fields: { DIRECTION: 'DOWN' } },
        { kind: 'block', type: 'snake_key_handler', fields: { DIRECTION: 'LEFT' } },
        { kind: 'block', type: 'snake_key_handler', fields: { DIRECTION: 'RIGHT' } },
      ],
    },
    {
      kind: 'category',
      name: 'Apel & Makanan',
      colour: '#dc2626',
      contents: [
        { kind: 'block', type: 'snake_spawn_food' },
        { kind: 'block', type: 'snake_check_food' },
        { kind: 'block', type: 'snake_respawn_food' },
      ],
    },
    {
      kind: 'category',
      name: 'Skor & Aturan',
      colour: '#ca8a04',
      contents: [
        {
          kind: 'block',
          type: 'snake_add_score',
          inputs: {
            POINTS: { shadow: { type: 'math_number', fields: { NUM: 10 } } },
          },
        },
        { kind: 'block', type: 'snake_grow' },
        { kind: 'block', type: 'snake_check_collision' },
        { kind: 'block', type: 'snake_game_over' },
        { kind: 'block', type: 'snake_play_sound' },
      ],
    },
    {
      kind: 'category',
      name: 'Angka & Matematika',
      colour: '#475569',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
      ],
    },
  ],
};
