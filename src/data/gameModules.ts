import { QuizQuestion } from '../types/lms';
import { GameType } from '../components/MultiGameStudio';

export interface GameStageModule {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  conceptName: string;
  icon: string;
  story: string;
  mission: string;
  requirements: string[];
  hint: string;
  quiz: QuizQuestion;
  defaultXml: string;
  expectedBehavior: string;
  badgeName: string;
}

export interface GameCurriculum {
  gameId: GameType;
  gameTitle: string;
  gameTagline: string;
  totalStages: number;
  stages: GameStageModule[];
}

export const GAME_CURRICULA: Record<GameType, GameCurriculum> = {
  snake: {
    gameId: 'snake',
    gameTitle: 'Game Snake (Gaming with KIKI)',
    gameTagline: 'Merakit game Snake langkah demi langkah dari koordinat hingga game over!',
    totalStages: 6,
    stages: [], // Handled by main curriculum
  },

  pong: {
    gameId: 'pong',
    gameTitle: 'Game PONG (Tenis Meja Retro)',
    gameTagline: 'Pelajari fisika pantulan bola, kontrol raket pemain, dan sistem kecerdasan komputer!',
    totalStages: 5,
    stages: [
      {
        id: 1,
        slug: 'pong-1-meja-raket',
        title: 'Tahap 1: Menyiapkan Meja & Raket Pemain',
        subtitle: 'Konsep: Dimensi Layar (400x300) dan Koordinat Raket',
        conceptName: 'Inisialisasi & Posisi',
        icon: '🏓',
        story: 'Selamat datang di Game PONG! Ini adalah game video tertua di dunia yang sangat seru. Langkah pertama adalah menyiapkan meja lapangan dan menaruh raket tenis meja kita di sisi kiri!',
        mission: 'Atur kecepatan bola = 4, target skor = 5, dan siapkan raket pemain dengan tinggi 70 piksel.',
        requirements: [
          'Pasang balok "Mulai Game Pong"',
          'Tentukan raket pemain di sisi kiri layar',
          'Lihat lapangan tenis meja neon muncul di simulator!',
        ],
        hint: 'Tarik balok "Mulai Game Pong: Kecepatan Bola 4, Target Skor 5" ke area kerja Blockly!',
        quiz: {
          id: 'pong-q1',
          question: 'Pada game Pong dengan ukuran layar lebar 400 dan tinggi 300, di sisi manakah raket pemain biru diletakkan?',
          explanation: 'Tepat sekali! Raket pemain diletakkan di sisi kiri (X dekat 0) dan bergerak naik-turun pada sumbu Y!',
          options: [
            { id: 'a', text: 'Di sisi kiri layar', isCorrect: true },
            { id: 'b', text: 'Di luar layar permainan', isCorrect: false },
            { id: 'c', text: 'Di tengah-tengah jaring', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="pong_init" x="30" y="30">
    <field name="BALL_SPEED">4</field>
    <field name="MAX_SCORE">5</field>
  </block>
</xml>`,
        expectedBehavior: 'Meja Pong muncul dengan raket biru di kiri dan raket pink di kanan.',
        badgeName: 'Pembuat Lapangan Pong',
      },
      {
        id: 2,
        slug: 'pong-2-gerak-raket',
        title: 'Tahap 2: Gerakan Raket Naik & Turun',
        subtitle: 'Konsep: Input Tombol Panah & Mengubah Posisi Y',
        conceptName: 'Event Listener Tombol',
        icon: '🕹️',
        story: 'Raket kita butuh kemudi! Saat tombol Panah Atas ditekan, raket bergerak ke atas (Y berkurang). Saat Panah Bawah ditekan, raket bergerak ke bawah (Y bertambah)!',
        mission: 'Hubungkan tombol Panah Atas dan Panah Bawah agar raket pemain bisa digerakkan menyambut bola!',
        requirements: [
          'Pasang balok "Gerakkan Raket Pemain ke Atas"',
          'Pasang balok "Gerakkan Raket Pemain ke Bawah"',
          'Uji coba gerakkan raket dengan tombol keyboard atau tombol layar!',
        ],
        hint: 'Pasang balok gerak raket ke Atas dan ke Bawah di bawah balok inisialisasi game!',
        quiz: {
          id: 'pong-q2',
          question: 'Jika raket pemain berada di posisi Y = 100, berapakah posisi Y jika raket naik sebesar 15 piksel?',
          explanation: 'Keren! Di layar komputer, arah ke atas berarti nilai Y berkurang: 100 - 15 = 85!',
          options: [
            { id: 'a', text: '85', isCorrect: true },
            { id: 'b', text: '115', isCorrect: false },
            { id: 'c', text: '200', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="pong_init" x="30" y="30">
    <field name="BALL_SPEED">4</field>
    <field name="MAX_SCORE">5</field>
    <next>
      <block type="pong_move_paddle">
        <field name="DIR">UP</field>
        <next>
          <block type="pong_move_paddle">
            <field name="DIR">DOWN</field>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Raket pemain merespon tombol Atas dan Bawah dengan mulus.',
        badgeName: 'Pengemudi Raket Handal',
      },
      {
        id: 3,
        slug: 'pong-3-pantulan-dinding',
        title: 'Tahap 3: Bola Meluncur & Pantulan Fisika Dinding',
        subtitle: 'Konsep: Membalikkan Kecepatan (Vy = -Vy)',
        conceptName: 'Fisika Pantulan Sumbu Y',
        icon: '⚡',
        story: 'Bola Pong meluncur diagonal di meja. Saat bola membentur dinding atas atau dinding bawah, bola harus memantul balik ke arah sebaliknya seperti karet!',
        mission: 'Pasang balok "Pantulan Dinding": Ketika bola mengenai batas atas atau bawah, balikkan kecepatan Y.',
        requirements: [
          'Gunakan balok pergerakan bola',
          'Pastikan pantulan batas atas dan bawah aktif',
          'Lihat bola memantul elastis saat menabrak pinggir meja!',
        ],
        hint: 'Fisika komputer bekerja dengan mengalikan kecepatan dengan -1 untuk membalikkan arah!',
        quiz: {
          id: 'pong-q3',
          question: 'Jika kecepatan tegak bola mula-mula adalah +4 (bergerak ke bawah), berapakah kecepatannya setelah memantul dari dinding bawah?',
          explanation: 'Pintar sekali! Pantulan membalikkan arah menjadi -4 (bergerak ke atas)!',
          options: [
            { id: 'a', text: '-4 (berbalik ke atas)', isCorrect: true },
            { id: 'b', text: '0 (berhenti mendadak)', isCorrect: false },
            { id: 'c', text: '+100', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="pong_init" x="30" y="30">
    <field name="BALL_SPEED">4</field>
    <field name="MAX_SCORE">5</field>
    <next>
      <block type="pong_move_paddle">
        <field name="DIR">UP</field>
        <next>
          <block type="pong_move_paddle">
            <field name="DIR">DOWN</field>
            <next>
              <block type="pong_wall_bounce"></block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Bola memantul otomatis di dinding atas dan bawah meja.',
        badgeName: 'Ahli Pantulan Fisika',
      },
      {
        id: 4,
        slug: 'pong-4-pantulan-raket',
        title: 'Tahap 4: Menangkis Bola dengan Raket!',
        subtitle: 'Konsep: Deteksi Tabrakan Bola & Raket (Vx = -Vx)',
        conceptName: 'Tabrakan Raket (Collision)',
        icon: '🔄',
        story: 'Sekarang bagian paling seru! Saat bola menyentuh raket birumu, tangkis bolanya kembali ke arah komputer! Nilai kecepatan mendatar Vx dibalik dari negatif menjadi positif!',
        mission: 'Pasang balok "Jika Bola Mengenai Raket: Pantulkan Bola Balik" dan bunyikan suara pantulan tik-tik!',
        requirements: [
          'Pasang balok pantulan raket pemain',
          'Aktifkan suara efek pantulan bola',
          'Berhasil menangkis bola minimal 3 kali berturut-turut!',
        ],
        hint: 'Tarik balok "Jika Bola Mengenai Raket: Pantulkan Bola" dari kategori Pantulan Fisika!',
        quiz: {
          id: 'pong-q4',
          question: 'Apa yang terjadi jika kita tidak memasang balok pantulan raket pada program?',
          explanation: 'Tepat! Komputer tidak akan tahu bahwa bola menyentuh raket, sehingga bola akan menembus raket seperti hantu!',
          options: [
            { id: 'a', text: 'Bola akan menembus raket dan lewat begitu saja', isCorrect: true },
            { id: 'b', text: 'Komputer akan meledak', isCorrect: false },
            { id: 'c', text: 'Raket akan berubah warna jadi pelangi', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="pong_init" x="30" y="30">
    <field name="BALL_SPEED">4</field>
    <field name="MAX_SCORE">5</field>
    <next>
      <block type="pong_move_paddle">
        <field name="DIR">UP</field>
        <next>
          <block type="pong_move_paddle">
            <field name="DIR">DOWN</field>
            <next>
              <block type="pong_wall_bounce">
                <next>
                  <block type="pong_ball_bounce"></block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Bola memantul saat disentuh oleh raket pemain maupun raket komputer.',
        badgeName: 'Penangkis Bola Sejati',
      },
      {
        id: 5,
        slug: 'pong-5-skor-dan-juara',
        title: 'Tahap 5: Cetak Gol & Jadi Juara Turnamen!',
        subtitle: 'Konsep: Pengecekan Batas Layar & Variabel Skor',
        conceptName: 'Aturan Gol & Kemenangan',
        icon: '🏆',
        story: 'GOOOOL! Jika bola berhasil melewati raket komputer di sisi kanan (X > 400), skor kita bertambah +1! Siapa yang pertama kali mencapai target 5 poin akan memenangkan piala!',
        mission: 'Tambahkan balok "Cek Gol & Tambah Skor" serta reset bola ke tengah meja setiap kali ada gol.',
        requirements: [
          'Pasang balok "Jika Bola Lewat Garis: Tambah Skor"',
          'Tentukan target kemenangan 5 poin',
          'Kalahkan komputer dan jadilah Juara Pong!',
        ],
        hint: 'Lengkapi game Pong kamu dengan balok cek gol dan mainkan sampai menang!',
        quiz: {
          id: 'pong-q5',
          question: 'Kapan pemain biru dinyatakan berhasil mencetak 1 poin gol?',
          explanation: 'Hebat! Saat bola berhasil melewati batas kanan (melewati raket komputer), pemain mendapat 1 poin!',
          options: [
            { id: 'a', text: 'Saat bola melewati batas kanan (X > 400)', isCorrect: true },
            { id: 'b', text: 'Saat raket bergerak ke atas', isCorrect: false },
            { id: 'c', text: 'Saat permainan baru dimulai', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="pong_init" x="30" y="30">
    <field name="BALL_SPEED">4</field>
    <field name="MAX_SCORE">5</field>
    <next>
      <block type="pong_move_paddle">
        <field name="DIR">UP</field>
        <next>
          <block type="pong_move_paddle">
            <field name="DIR">DOWN</field>
            <next>
              <block type="pong_wall_bounce">
                <next>
                  <block type="pong_ball_bounce">
                    <next>
                      <block type="pong_check_goal"></block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Game Pong utuh berfungsi dengan skor, raket, pantulan bola, dan pesan pemenang.',
        badgeName: 'Master Juara Pong',
      },
    ],
  },

  rps: {
    gameId: 'rps',
    gameTitle: 'Batu Gunting Kertas (RPS)',
    gameTagline: 'Kuasai logika percabangan if-elif-else dan pilihan acak komputer!',
    totalStages: 4,
    stages: [
      {
        id: 1,
        slug: 'rps-1-daftar-pilihan',
        title: 'Tahap 1: Membuat Daftar Pilihan Tangan (List)',
        subtitle: 'Konsep: Tipe Data List di Python ["Batu", "Gunting", "Kertas"]',
        conceptName: 'Tipe Data List',
        icon: '🪨',
        story: 'Halo teman-teman! Di game Batu Gunting Kertas, ada 3 bentuk tangan. Dalam Python, kita menyimpan kumpulan benda di dalam kotak khusus bernama List (Daftar)!',
        mission: 'Buat daftar pilihan berisi 3 kata: "Batu", "Gunting", dan "Kertas".',
        requirements: [
          'Pasang balok "Mulai Game Batu Gunting Kertas"',
          'Buat daftar berisi 3 pilihan tangan',
          'Pahami fungsi List dalam menyimpan banyak kata sekaligus!',
        ],
        hint: 'Tarik balok "Mulai Game Batu Gunting Kertas" ke area kerja Blockly!',
        quiz: {
          id: 'rps-q1',
          question: 'Dalam bahasa Python, tanda kurung siku ["Batu", "Gunting", "Kertas"] digunakan untuk membuat apa?',
          explanation: 'Tepat sekali! Tanda kurung siku [] digunakan untuk membuat List (daftar kumpulan data)!',
          options: [
            { id: 'a', text: 'List (Daftar kumpulan benda)', isCorrect: true },
            { id: 'b', text: 'Gambar segitiga', isCorrect: false },
            { id: 'c', text: 'Kalkulator perkalian', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="rps_init" x="30" y="30">
    <field name="WIN_SCORE">3</field>
  </block>
</xml>`,
        expectedBehavior: 'Daftar pilihan tangan siap digunakan oleh pemain dan komputer.',
        badgeName: 'Kolektor List Python',
      },
      {
        id: 2,
        slug: 'rps-2-acak-komputer',
        title: 'Tahap 2: Komputer Memilih Acak (Random Choice)',
        subtitle: 'Konsep: Modul random.choice() di Python',
        conceptName: 'Fungsi Acak (Random)',
        icon: '🤖',
        story: 'Komputer tidak boleh curang mengintip tangan kita! Kita harus membuat komputer memilih salah satu dari daftar pilihan secara acak dan adil menggunakan random.choice()!',
        mission: 'Pasang balok "Komputer Memilih Acak (Batu / Gunting / Kertas)".',
        requirements: [
          'Gunakan balok acak komputer',
          'Komputer dapat memilih secara adil dan tak terduga',
          'Coba klik pilihanmu untuk melihat pilihan acak bot!',
        ],
        hint: 'Fungsi random.choice() seperti mengambil kelereng dari dalam kantong dengan mata tertutup!',
        quiz: {
          id: 'rps-q2',
          question: 'Mengapa komputer perlu menggunakan random.choice() saat memilih tangan?',
          explanation: 'Pintar! Jika komputer selalu memilih Batu terus, pemain akan selalu menang dengan mudah!',
          options: [
            { id: 'a', text: 'Supaya pilihannya adil dan tidak bisa ditebak', isCorrect: true },
            { id: 'b', text: 'Supaya baterai komputer hemat', isCorrect: false },
            { id: 'c', text: 'Karena komputer tidak punya mata', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="rps_init" x="30" y="30">
    <field name="WIN_SCORE">3</field>
    <next>
      <block type="rps_bot_choice"></block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Komputer mengeluarkan pilihan acak yang berbeda-beda setiap ronde.',
        badgeName: 'Perancang Bot Adil',
      },
      {
        id: 3,
        slug: 'rps-3-logika-seri-menang',
        title: 'Tahap 3: Logika Keputusan (If - Elif - Else)',
        subtitle: 'Konsep: Aturan Batu kalahkan Gunting, Gunting kalahkan Kertas, Kertas kalahkan Batu',
        conceptName: 'Percabangan Logika',
        icon: '⚖️',
        story: 'Bagaimana komputer menentukan siapa juaranya? Jika pilihan sama, maka SERI. Jika tanganmu mengalahkan tangan komputer, kamu MENANG! Jika tidak, kamu KALAH!',
        mission: 'Susun balok logika perbandingan: Cek Seri, Cek Kemenangan, dan Cek Kekalahan.',
        requirements: [
          'Gunakan balok "Tentukan Pemenang Sesuai Aturan"',
          'Pahami urutan logika percabangan if-elif-else',
          'Menangkan minimal 1 ronde duel!',
        ],
        hint: 'Tarik balok "Tentukan Pemenang Sesuai Aturan" di bawah balok pilihan bot!',
        quiz: {
          id: 'rps-q3',
          question: 'Jika kamu memilih "Gunting" dan komputer memilih "Kertas", siapakah pemenangnya?',
          explanation: 'Betul sekali! Gunting memotong Kertas, sehingga kamu yang Menang!',
          options: [
            { id: 'a', text: 'Kamu Menang (Gunting memotong Kertas)', isCorrect: true },
            { id: 'b', text: 'Komputer Menang', isCorrect: false },
            { id: 'c', text: 'Hasilnya Seri', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="rps_init" x="30" y="30">
    <field name="WIN_SCORE">3</field>
    <next>
      <block type="rps_bot_choice">
        <next>
          <block type="rps_check_logic"></block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Sistem otomatis mendeteksi hasil duel secara tepat sesuai aturan baku.',
        badgeName: 'Hakim Logika Cerdas',
      },
      {
        id: 4,
        slug: 'rps-4-turnamen-3-ronde',
        title: 'Tahap 4: Pertandingan 3 Ronde Juara',
        subtitle: 'Konsep: Variabel Skor & Kondisi Berhenti (While Loop)',
        conceptName: 'Variabel Skor & Pemenang',
        icon: '⭐',
        story: 'Satu ronde saja kurang seru! Ayo buat turnamen seru: siapa yang pertama kali mengumpulkan 3 kemenangan berhak membawa pulang Piala Master Batu Gunting Kertas!',
        mission: 'Raih 3 kemenangan melawan bot komputer dan perhatikan kode Python yang menghitung skor!',
        requirements: [
          'Target skor diatur menjadi 3 kemenangan',
          'Kalahkan bot komputer dalam pertandingan penuh!',
        ],
        hint: 'Pilih strategimu dengan cerdas dan amati pola pilihan komputer!',
        quiz: {
          id: 'rps-q4',
          question: 'Dalam kode Python skor_pemain += 1, apa arti tanda += 1?',
          explanation: 'Hebat! += 1 artinya menambah nilai yang ada di variabel skor sebanyak 1 angka!',
          options: [
            { id: 'a', text: 'Menambah nilai skor sebanyak 1', isCorrect: true },
            { id: 'b', text: 'Mengurangi skor jadi 0', isCorrect: false },
            { id: 'c', text: 'Menghapus game dari komputer', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="rps_init" x="30" y="30">
    <field name="WIN_SCORE">3</field>
    <next>
      <block type="rps_bot_choice">
        <next>
          <block type="rps_check_logic"></block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Game penuh berjalan hingga salah satu pemain mencapai 3 skor kemenangan.',
        badgeName: 'Kampiun Batu Gunting Kertas',
      },
    ],
  },

  flappy: {
    gameId: 'flappy',
    gameTitle: 'Flappy Bird Sederhana',
    gameTagline: 'Pelajari fisika gravitasi, gaya angkat kepakan sayap, dan rintangan pipa bergerak!',
    totalStages: 5,
    stages: [
      {
        id: 1,
        slug: 'flappy-1-burung-langit',
        title: 'Tahap 1: Memunculkan Burung Kuning di Langit',
        subtitle: 'Konsep: Koordinat Posisi Awal Burung di Sumbu Y',
        conceptName: 'Inisialisasi Posisi',
        icon: '🐦',
        story: 'Halo! Kenalkan Bibo si burung kuning mungil dengan kacamata terbang! Bibo ingin melintasi langit. Mari kita siapkan Bibo di ketinggian yang pas!',
        mission: 'Atur posisi Bibo di koordinat Y = 150 dan atur nilai gravitasi = 0.5.',
        requirements: [
          'Pasang balok "Siapkan Flappy Bird"',
          'Atur gravitasi = 0.5 dan daya lompat = 7',
          'Lihat Bibo siap terbang di langit biru berawan!',
        ],
        hint: 'Tarik balok "Siapkan Flappy Bird: Gravitasi 0.5, Daya Lompat 7" ke area kerja!',
        quiz: {
          id: 'flappy-q1',
          question: 'Mengapa ketinggian burung diukur menggunakan sumbu Y dan bukan sumbu X?',
          explanation: 'Tepat sekali! Sumbu Y mengatur posisi tegak (naik-turun) di layar komputer!',
          options: [
            { id: 'a', text: 'Karena sumbu Y menunjukkan posisi tegak (atas-bawah)', isCorrect: true },
            { id: 'b', text: 'Karena sumbu X adalah untuk warna', isCorrect: false },
            { id: 'c', text: 'Hanya kebetulan saja', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="flappy_init" x="30" y="30">
    <field name="GRAVITY">0.5</field>
    <field name="JUMP">7</field>
  </block>
</xml>`,
        expectedBehavior: 'Bibo si burung kuning muncul di tengah layar langit biru.',
        badgeName: 'Penerbang Pemula',
      },
      {
        id: 2,
        slug: 'flappy-2-gravitasi',
        title: 'Tahap 2: Gravitasi Menarik Burung ke Bawah',
        subtitle: 'Konsep: Percepatan Fisika (Kecepatan_Y += Gravitasi)',
        conceptName: 'Fisika Gravitasi',
        icon: '🍎',
        story: 'Sama seperti buah apel yang jatuh ke tanah, di bumi ada gaya gravitasi! Di setiap detik permainan, kecepatan jatuh burung terus bertambah ke bawah jika tidak mengepakkan sayap!',
        mission: 'Pasang balok perulangan gravitasi yang menarik burung ke bawah setiap detik.',
        requirements: [
          'Gunakan balok gravitasi loop',
          'Amati bagaimana burung meluncur turun karena tarikan gravitasi!',
        ],
        hint: 'Di komputer, gravitasi dibuat dengan menambahkan angka positif ke posisi Y burung!',
        quiz: {
          id: 'flappy-q2',
          question: 'Jika kecepatan burung mula-mula 0, lalu bertambah gravitasi 0.5 setiap detik, berapakah kecepatannya setelah 2 detik?',
          explanation: 'Hebat! 0 + 0.5 + 0.5 = 1.0! Burung jatuh semakin cepat!',
          options: [
            { id: 'a', text: '1.0', isCorrect: true },
            { id: 'b', text: '0', isCorrect: false },
            { id: 'c', text: '50', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="flappy_init" x="30" y="30">
    <field name="GRAVITY">0.5</field>
    <field name="JUMP">7</field>
    <next>
      <block type="flappy_gravity_loop"></block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Burung meluncur turun secara alami mengikuti gaya gravitasi.',
        badgeName: 'Peneliti Gravitasi Cilik',
      },
      {
        id: 3,
        slug: 'flappy-3-kepak-lompat',
        title: 'Tahap 3: Kepakkan Sayap & Melompat ke Atas!',
        subtitle: 'Konsep: Memberikan Kecepatan Negatif (Kecepatan_Y = -7)',
        conceptName: 'Gaya Angkat Lompat',
        icon: '🪽',
        story: 'Agar Bibo tidak jatuh ke rumput, Bibo harus mengepakkan sayapnya! Saat tombol Spasi ditekan atau layar disentuh, kita beri dorongan ke atas sebesar -7 piksel!',
        mission: 'Pasang balok "Ketika Tombol Spasi Ditekan: Burung Kepakkan Sayap & Lompat".',
        requirements: [
          'Pasang balok kontrol lompatan sayap',
          'Coba tekan spasi atau klik layar agar burung melayang di udara!',
        ],
        hint: 'Nilai kecepatan negatif membuat burung melompat ke atas melawan gravitasi!',
        quiz: {
          id: 'flappy-q3',
          question: 'Mengapa gaya lompat bernilai negatif (-7) sedangkan gravitasi bernilai positif (+0.5)?',
          explanation: 'Pintar! Karena di koordinat komputer, nilai Y menuju atas adalah minus, dan ke bawah adalah plus!',
          options: [
            { id: 'a', text: 'Karena arah ke atas di layar komputer nilainya berkurang (negatif)', isCorrect: true },
            { id: 'b', text: 'Karena burung sedang kedinginan', isCorrect: false },
            { id: 'c', text: 'Karena komputer salah hitung', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="flappy_init" x="30" y="30">
    <field name="GRAVITY">0.5</field>
    <field name="JUMP">7</field>
    <next>
      <block type="flappy_jump">
        <next>
          <block type="flappy_gravity_loop"></block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Burung dapat melompat dan bertahan di udara saat tombol spasi ditekan.',
        badgeName: 'Pilot Sayap Lincah',
      },
      {
        id: 4,
        slug: 'flappy-4-rintangan-pipa',
        title: 'Tahap 4: Rintangan Pipa Hijau Bergerak',
        subtitle: 'Konsep: Menggeser Pipa ke Kiri (Pipa_X -= Kecepatan)',
        conceptName: 'Animasi Rintangan Bergerak',
        icon: '🧱',
        story: 'Ada rintangan pipa hijau di depan! Di dalam game, sebenarnya burung tetap di tempatnya, tetapi pipa-pipa yang berjalan ke arah kiri sehingga terlihat seperti burung melesat maju!',
        mission: 'Aktifkan pergerakan pipa dari kanan ke kiri dengan celah acak yang menantang.',
        requirements: [
          'Pipa hijau bergerak mulus ke arah kiri',
          'Celah pipa dibuat cukup untuk dilewati tubuh Bibo',
        ],
        hint: 'Trik programmer: Menggerakkan latar ke kiri membuat pemain merasa bergerak maju ke kanan!',
        quiz: {
          id: 'flappy-q4',
          question: 'Bagaimana ilusi burung melaju ke depan dibuat di dalam game?',
          explanation: 'Luar biasa! Pipa digeser ke kiri dengan mengurangi posisi X-nya!',
          options: [
            { id: 'a', text: 'Dengan menggeser rintangan pipa ke kiri secara terus menerus', isCorrect: true },
            { id: 'b', text: 'Dengan mengganti warna langit', isCorrect: false },
            { id: 'c', text: 'Burung ditarik menggunakan tali tak terlihat', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="flappy_init" x="30" y="30">
    <field name="GRAVITY">0.5</field>
    <field name="JUMP">7</field>
    <next>
      <block type="flappy_jump">
        <next>
          <block type="flappy_gravity_loop"></block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Pipa hijau muncul berurutan dari sisi kanan layar.',
        badgeName: 'Arsitek Rintangan Pipa',
      },
      {
        id: 5,
        slug: 'flappy-5-tabrakan-dan-skor',
        title: 'Tahap 5: Hati-hati Menabrak! Skor & Rekor Terbaik',
        subtitle: 'Konsep: Deteksi Tabrakan Kotak (Bounding Box Collision)',
        conceptName: 'Deteksi Tabrakan & Skor',
        icon: '🏆',
        story: 'Saat Bibo menabrak pipa atau jatuh ke rumput, game selesai! Tapi jika Bibo sukses melewati celah di antara kedua pipa, TING! Skor bertambah +1!',
        mission: 'Pasang balok tabrakan game over dan coba lewati minimal 3 celah pipa untuk mencetak rekor!',
        requirements: [
          'Pasang balok "Jika Menabrak Pipa atau Jatuh ke Tanah: Game Over"',
          'Berhasil melewati pipa dan menambah skor!',
        ],
        hint: 'Konsentrasi dan jaga ritme kepakan sayap burungmu agar seimbang!',
        quiz: {
          id: 'flappy-q5',
          question: 'Kapan pemain mendapatkan tambahan skor +1 di Flappy Bird?',
          explanation: 'Tepat! Setiap kali berhasil melewati celah pipa tanpa menyentuh tepinya!',
          options: [
            { id: 'a', text: 'Saat berhasil terbang melewati celah pipa', isCorrect: true },
            { id: 'b', text: 'Saat burung menabrak tanah', isCorrect: false },
            { id: 'c', text: 'Setiap kali menekan tombol spasi', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="flappy_init" x="30" y="30">
    <field name="GRAVITY">0.5</field>
    <field name="JUMP">7</field>
    <next>
      <block type="flappy_jump">
        <next>
          <block type="flappy_gravity_loop">
            <next>
              <block type="flappy_collision"></block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Game Flappy Bird lengkap berjalan dengan gravitasi, tabrakan, dan pencatat skor.',
        badgeName: 'Juara Langit Flappy',
      },
    ],
  },

  space: {
    gameId: 'space',
    gameTitle: 'Space Shooter (Penjelajah Antariksa)',
    gameTagline: 'Kendalikan pesawat tempur, tembakkan laser energi, dan kalahkan armada alien!',
    totalStages: 5,
    stages: [
      {
        id: 1,
        slug: 'space-1-pesawat-bawah',
        title: 'Tahap 1: Mempersiapkan Pesawat Tempur',
        subtitle: 'Konsep: Posisi Pesawat di Bawah Layar & Jumlah Nyawa',
        conceptName: 'Inisialisasi Karakter',
        icon: '🚀',
        story: 'Bumi sedang dalam bahaya! Armada monster cumi luar angkasa sedang mendekat. Kita harus menyiapkan pesawat jet tempur oranye di bagian bawah layar!',
        mission: 'Atur posisi pesawat di X = 180, Y = 260, kecepatan laser = 8, dan siapkan 3 nyawa.',
        requirements: [
          'Pasang balok "Siapkan Pesawat Luar Angkasa"',
          'Tentukan 3 nyawa pelindung',
          'Lihat pesawat tempur siap meluncur di antara bintang-bintang!',
        ],
        hint: 'Tarik balok "Siapkan Pesawat Luar Angkasa: Nyawa 3, Kecepatan Laser 8"!',
        quiz: {
          id: 'space-q1',
          question: 'Di mana posisi ideal pesawat pemain pada game tembak-menembak antariksa klasik?',
          explanation: 'Tepat! Pesawat berada di bawah menghadap ke atas untuk menembak musuh yang datang dari atas!',
          options: [
            { id: 'a', text: 'Di bagian bawah layar menghadap ke atas', isCorrect: true },
            { id: 'b', text: 'Di pojok luar layar', isCorrect: false },
            { id: 'c', text: 'Di dalam lubang hitam', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="space_init" x="30" y="30">
    <field name="LIVES">3</field>
    <field name="LASER_SPEED">8</field>
  </block>
</xml>`,
        expectedBehavior: 'Pesawat jet oranye muncul di bagian bawah angkasa bertabur bintang.',
        badgeName: 'Kadet Antariksa',
      },
      {
        id: 2,
        slug: 'space-2-gerak-pesawat',
        title: 'Tahap 2: Mengemudikan Pesawat Kiri & Kanan',
        subtitle: 'Konsep: Mengubah Nilai Sumbu X (X += Kecepatan)',
        conceptName: 'Kontrol Horizontal',
        icon: '🕹️',
        story: 'Pesawat harus bisa bermanuver menghindari tembakan musuh! Kita buat kendali tombol Panah Kiri (X berkurang) dan Panah Kanan (X bertambah)!',
        mission: 'Kendalikan pesawat tempurmu bergerak gesit ke kiri dan ke kanan.',
        requirements: [
          'Uji coba tombol panah kiri dan panah kanan',
          'Pastikan pesawat tidak keluar dari batas pinggir layar!',
        ],
        hint: 'Gunakan tombol keyboard A dan D atau panah kiri/kanan!',
        quiz: {
          id: 'space-q2',
          question: 'Jika posisi X pesawat adalah 180, ke manakah arah gerak pesawat jika X menjadi 205?',
          explanation: 'Pintar! Nilai X bertambah berarti bergerak ke arah kanan!',
          options: [
            { id: 'a', text: 'Bergerak ke kanan', isCorrect: true },
            { id: 'b', text: 'Bergerak ke kiri', isCorrect: false },
            { id: 'c', text: 'Diam di tempat', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="space_init" x="30" y="30">
    <field name="LIVES">3</field>
    <field name="LASER_SPEED">8</field>
  </block>
</xml>`,
        expectedBehavior: 'Pesawat bergerak mulus ke kiri dan kanan menyusuri arena tempur.',
        badgeName: 'Pilot Tempur Handal',
      },
      {
        id: 3,
        slug: 'space-3-tembak-laser',
        title: 'Tahap 3: Menembakkan Sinar Laser Biru!',
        subtitle: 'Konsep: Membuat Objek Proyektil & Bergerak ke Atas (Y -= Kecepatan)',
        conceptName: 'Proyektil Laser',
        icon: '⚡',
        story: 'PEW PEW! Saat tombol Spasi ditekan, moncong pesawat menembakkan sinar laser biru terang. Laser ini melesat cepat ke atas menuju langit antariksa!',
        mission: 'Pasang balok "Tembakkan Laser Biru dari Moncong Pesawat".',
        requirements: [
          'Pasang balok tembakan laser',
          'Tekan tombol Spasi untuk menembakkan laser beruntun!',
        ],
        hint: 'Laser disimpan di dalam daftar (List) dan posisinya dikurangi sumbu Y setiap detik!',
        quiz: {
          id: 'space-q3',
          question: 'Bagaimana cara komputer menggerakkan laser dari bawah ke atas?',
          explanation: 'Hebat! Di layar komputer, mengurangi nilai Y membuat benda bergerak naik ke atas!',
          options: [
            { id: 'a', text: 'Dengan mengurangi koordinat Y laser setiap detik (Y -= kecepatan)', isCorrect: true },
            { id: 'b', text: 'Dengan memutar monitor komputer', isCorrect: false },
            { id: 'c', text: 'Dengan memperbesar ukuran layar', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="space_init" x="30" y="30">
    <field name="LIVES">3</field>
    <field name="LASER_SPEED">8</field>
    <next>
      <block type="space_shoot_laser"></block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Laser biru memancar meluncur ke atas setiap kali tombol tembak ditekan.',
        badgeName: 'Penembak Laser Jitu',
      },
      {
        id: 4,
        slug: 'space-4-monster-alien',
        title: 'Tahap 4: Armada Alien Cumi Menyerang!',
        subtitle: 'Konsep: Monster Turun ke Bawah Secara Zig-Zag',
        conceptName: 'Pergerakan Musuh',
        icon: '👾',
        story: 'Monster alien cumi ungu dan hijau mulai bermunculan dari atas! Mereka bergerak ke kiri dan ke kanan sambil perlahan mendekati pesawat kita!',
        mission: 'Amati formasi alien yang bergerak zig-zag dan bidik laser ke arah mereka!',
        requirements: [
          'Armada alien bergerak menuruni layar',
          'Latih ketepatan membidik sasaran yang bergerak!',
        ],
        hint: 'Monster alien akan berbalik arah setiap kali membentur tepi layar!',
        quiz: {
          id: 'space-q4',
          question: 'Mengapa monster alien dibuat bergerak zig-zag dan bukan diam di tempat?',
          explanation: 'Tepat! Target yang bergerak membuat game jauh lebih menantang dan seru untuk dimainkan!',
          options: [
            { id: 'a', text: 'Agar game lebih seru dan menantang untuk ditembak', isCorrect: true },
            { id: 'b', text: 'Karena alien sedang berdansa', isCorrect: false },
            { id: 'c', text: 'Agar pesawat cepat rusak', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="space_init" x="30" y="30">
    <field name="LIVES">3</field>
    <field name="LASER_SPEED">8</field>
    <next>
      <block type="space_shoot_laser"></block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Alien meluncur turun secara menantang di atas langit berbintang.',
        badgeName: 'Pengintai Armada Musuh',
      },
      {
        id: 5,
        slug: 'space-5-hancurkan-alien-skor',
        title: 'Tahap 5: Ledakkan Alien & Lindungi Galaksi!',
        subtitle: 'Konsep: Deteksi Tabrakan Proyektil & Poin Skor (+20)',
        conceptName: 'Tabrakan Proyektil & Skor',
        icon: '💥',
        story: 'BOOOM! Tembakan laser tepat mengenai tubuh alien! Alien hancur, suara ledakan terdengar, dan skor kita melesat naik +20 poin! Hati-hati jangan sampai alien menabrak badan pesawat ya!',
        mission: 'Pasang balok "Jika Laser Mengenai Alien: Hancurkan Alien & Tambah Skor +20", dan raih minimal 60 poin!',
        requirements: [
          'Pasang balok deteksi tabrakan laser & alien',
          'Raih minimal 60 poin (kalahkan 3 alien)',
          'Pertahankan 3 nyawa pesawat dan selamatkan galaksi!',
        ],
        hint: 'Setiap alien yang meledak memberi kita bonus skor +20 poin!',
        quiz: {
          id: 'space-q5',
          question: 'Apa yang terjadi dalam memori program saat laser mengenai alien?',
          explanation: 'Luar biasa! Komputer menghapus alien dan laser yang bertabrakan dari daftar, lalu menambah nilai skor!',
          options: [
            { id: 'a', text: 'Alien dan laser dihapus dari daftar, dan variabel skor bertambah', isCorrect: true },
            { id: 'b', text: 'Layar komputer langsung mati', isCorrect: false },
            { id: 'c', text: 'Tidak ada perubahan apa pun', isCorrect: false },
          ],
        },
        defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="space_init" x="30" y="30">
    <field name="LIVES">3</field>
    <field name="LASER_SPEED">8</field>
    <next>
      <block type="space_shoot_laser">
        <next>
          <block type="space_alien_hit"></block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
        expectedBehavior: 'Game Space Shooter lengkap dengan tembakan laser, ledakan alien, skor, dan sistem nyawa.',
        badgeName: 'Pahlawan Penjaga Galaksi',
      },
    ],
  },
};
