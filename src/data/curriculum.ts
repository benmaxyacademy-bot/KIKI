import { LevelConfig } from '../types/lms';

export const CURRICULUM_LEVELS: LevelConfig[] = [
  {
    id: 1,
    slug: 'level-1-posisi-awal',
    title: 'Level 1: Siap Meluncur! Menaruh Ular di Papan',
    subtitle: 'Konsep: Titik Koordinat (X & Y) dan Papan Game',
    conceptName: 'Koordinat X & Y',
    icon: '🎯',
    story: 'Halo adik-adik! Kenalkan, aku Kiki si Ular Hijau! Hari ini kita akan belajar bahasa pemrograman Python. Langkah pertama membuat game Snake adalah menyiapkan papan kotak-kotak dan menaruh kepala ular tepat di tengah!',
    mission: 'Atur ukuran papan game menjadi 20 x 20 petak, lalu tempatkan kepala Ular di koordinat X = 10 dan Y = 10.',
    requirements: [
      'Gunakan balok "Mulai Game" dengan ukuran 20x20',
      'Atur posisi kepala Ular di X = 10 dan Y = 10',
      'Klik "Jalankan Game" untuk melihat kepala Kiki muncul!'
    ],
    quiz: {
      id: 'q1',
      question: 'Di dalam layar game, koordinat X menunjukkan arah mendatar (kanan/kiri) dan koordinat Y menunjukkan arah tegak (atas/bawah). Jika posisi Ular ada di (10, 10), berada di manakah Ular?',
      explanation: 'Betul sekali! Pada kotak berukuran 20x20, angka 10 berada tepat di tengah-tengah!',
      options: [
        { id: 'a', text: 'Di pojok kiri atas', isCorrect: false },
        { id: 'b', text: 'Tepat di tengah papan game', isCorrect: true },
        { id: 'c', text: 'Di luar layar permainan', isCorrect: false }
      ]
    },
    hint: 'Tarik balok "Mulai Game" ke area kerja, lalu pasang balok "Taruh Ular di Koordinat X, Y" di dalamnya!',
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="snake_init" x="40" y="40">
    <value name="WIDTH">
      <shadow type="math_number">
        <field name="NUM">20</field>
      </shadow>
    </value>
    <value name="HEIGHT">
      <shadow type="math_number">
        <field name="NUM">20</field>
      </shadow>
    </value>
    <next>
      <block type="snake_set_position">
        <value name="POS_X">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <value name="POS_Y">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
    </next>
  </block>
</xml>`,
    expectedBehavior: 'Ular muncul di tengah papan game kotak 20x20.',
    badgeName: 'Penjelajah Koordinat',
    badgeDescription: 'Berhasil menentukan koordinat awal ular di peta permainan!',
    speedDefault: 1
  },
  {
    id: 2,
    slug: 'level-2-ular-bergerak',
    title: 'Level 2: Ular Meluncur Maju!',
    subtitle: 'Konsep: Perulangan (Game Loop) & Mengubah Posisi',
    conceptName: 'Game Loop & Pergerakan',
    icon: '🚀',
    story: 'Hore! Kiki sudah punya rumah di papan game. Tapi Kiki masih diam mematung nih! Dalam komputer, agar sesuatu bergerak, posisinya harus terus ditambah setiap saat di dalam perulangan (Loop).',
    mission: 'Buat Kiki meluncur maju ke arah KANAN dengan memasang balok "Gerakkan Ular Maju" di dalam perulangan Game Loop.',
    requirements: [
      'Gunakan balok perulangan "Setiap Detik Game (Loop)"',
      'Pasang balok "Gerakkan Ular Maju"',
      'Ular berhasil bergerak ke kanan minimal 5 langkah!'
    ],
    quiz: {
      id: 'q2',
      question: 'Jika posisi X ular mula-mula adalah 10, dan setiap detik nilai X bertambah 1 (X = X + 1), berapakah nilai X setelah 3 detik?',
      explanation: 'Hebat! 10 + 1 + 1 + 1 = 13. Setiap detik bertambah 1 petak ke arah kanan!',
      options: [
        { id: 'a', text: 'Tetap 10', isCorrect: false },
        { id: 'b', text: '13', isCorrect: true },
        { id: 'c', text: '30', isCorrect: false }
      ]
    },
    hint: 'Gunakan balok "Setiap Detik Game (Loop)" dan masukkan balok "Gerakkan Ular Maju" ke dalamnya!',
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="snake_init" x="40" y="30">
    <value name="WIDTH">
      <shadow type="math_number">
        <field name="NUM">20</field>
      </shadow>
    </value>
    <value name="HEIGHT">
      <shadow type="math_number">
        <field name="NUM">20</field>
      </shadow>
    </value>
    <next>
      <block type="snake_set_position">
        <value name="POS_X">
          <shadow type="math_number">
            <field name="NUM">5</field>
          </shadow>
        </value>
        <value name="POS_Y">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <next>
          <block type="snake_loop">
            <statement name="DO">
              <block type="snake_step_forward"></block>
            </statement>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
    expectedBehavior: 'Ular bergerak meluncur maju secara otomatis di layar.',
    badgeName: 'Pengendali Kecepatan',
    badgeDescription: 'Menguasai Game Loop untuk menggerakkan objek di layar!',
    speedDefault: 1.5
  },
  {
    id: 3,
    slug: 'level-3-kontrol-arah',
    title: 'Level 3: Kemudi Ular: Atas, Bawah, Kiri, Kanan!',
    subtitle: 'Konsep: Event Tombol Keyboard & Percabangan If-Else',
    conceptName: 'Event Listener & Arah',
    icon: '🎮',
    story: 'Waaah, Kiki meluncur lurus terus! Kiki butuh setir kendali nih! Kita harus mendengarkan tombol keyboard (Panah Atas, Bawah, Kiri, Kanan) agar Kiki bisa belok sesuai perintah kita!',
    mission: 'Pasang balok pendengar tombol kendali agar ular bisa belok ke Atas, Bawah, Kiri, dan Kanan ketika tombol panah ditekan.',
    requirements: [
      'Gunakan balok kontrol arah tombol keyboard',
      'Pastikan tombol Panah Atas, Bawah, Kiri, Kanan sudah terpasang',
      'Coba kendalikan Kiki berkeliling minimal 3 kali belokan!'
    ],
    quiz: {
      id: 'q3',
      question: 'Ketika kita menekan tombol keyboard "Panah Atas", koordinat manakah yang harus kita ubah?',
      explanation: 'Tepat! Bergerak ke atas dan bawah mengubah nilai Y (tegak). Di sistem game layar, ke atas mengurangi Y menuju 0!',
      options: [
        { id: 'a', text: 'Koordinat Y (Tegak)', isCorrect: true },
        { id: 'b', text: 'Koordinat X (Mendatar)', isCorrect: false },
        { id: 'c', text: 'Warna ular', isCorrect: false }
      ]
    },
    hint: 'Pasang balok "Ketika Tombol Ditekan" di bawah balok Loop pergerakan!',
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="snake_init" x="30" y="30">
    <value name="WIDTH">
      <shadow type="math_number"><field name="NUM">20</field></shadow>
    </value>
    <value name="HEIGHT">
      <shadow type="math_number"><field name="NUM">20</field></shadow>
    </value>
    <next>
      <block type="snake_set_position">
        <value name="POS_X"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
        <value name="POS_Y"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
        <next>
          <block type="snake_loop">
            <statement name="DO">
              <block type="snake_step_forward"></block>
            </statement>
            <next>
              <block type="snake_key_handler">
                <field name="DIRECTION">UP</field>
                <next>
                  <block type="snake_key_handler">
                    <field name="DIRECTION">DOWN</field>
                    <next>
                      <block type="snake_key_handler">
                        <field name="DIRECTION">LEFT</field>
                        <next>
                          <block type="snake_key_handler">
                            <field name="DIRECTION">RIGHT</field>
                          </block>
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
    </next>
  </block>
</xml>`,
    expectedBehavior: 'Ular dapat dikendalikan dengan tombol keyboard panah atau tombol layar.',
    badgeName: 'Pilot Ular Handal',
    badgeDescription: 'Berhasil menghubungkan kontrol tombol untuk menyetir ular!',
    speedDefault: 2
  },
  {
    id: 4,
    slug: 'level-4-apel-acak',
    title: 'Level 4: Munculkan Apel Merah Lezat!',
    subtitle: 'Konsep: Angka Acak (Random Number) di Python',
    conceptName: 'Modul Acak (Random)',
    icon: '🍎',
    story: 'Kiki lapar sekali! Perutnya berbunyi "kruuuk...". Di game Snake, makanan harus muncul di tempat yang berbeda-beda setiap waktu agar seru. Dalam Python, kita menggunakan fungsi random.randint()!',
    mission: 'Munculkan makanan buah apel di koordinat acak di antara petak 1 sampai 18 pada papan game.',
    requirements: [
      'Gunakan balok "Munculkan Apel di Koordinat Acak"',
      'Pilih warna atau jenis makanan apel merah',
      'Lihat apel muncul di papan saat game dimulai!'
    ],
    quiz: {
      id: 'q4',
      question: 'Mengapa posisi apel harus dibuat acak (random) dan bukan selalu di titik (5, 5)?',
      explanation: 'Pintar! Posisi acak membuat game selalu menantang dan pemain tidak bosan karena lokasinya selalu berpindah!',
      options: [
        { id: 'a', text: 'Supaya game lebih seru dan mengejutkan', isCorrect: true },
        { id: 'b', text: 'Karena komputer malas menghitung', isCorrect: false },
        { id: 'c', text: 'Supaya ular tidak bisa makan', isCorrect: false }
      ]
    },
    hint: 'Tarik balok "Munculkan Apel Acak" dari kategori "Apel & Makanan" ke bawah inisialisasi ular!',
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="snake_init" x="30" y="20">
    <value name="WIDTH"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
    <value name="HEIGHT"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
    <next>
      <block type="snake_set_position">
        <value name="POS_X"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
        <value name="POS_Y"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
        <next>
          <block type="snake_spawn_food">
            <field name="FOOD_TYPE">apple</field>
            <next>
              <block type="snake_loop">
                <statement name="DO">
                  <block type="snake_step_forward"></block>
                </statement>
                <next>
                  <block type="snake_key_handler">
                    <field name="DIRECTION">UP</field>
                    <next>
                      <block type="snake_key_handler">
                        <field name="DIRECTION">DOWN</field>
                        <next>
                          <block type="snake_key_handler">
                            <field name="DIRECTION">LEFT</field>
                            <next>
                              <block type="snake_key_handler">
                                <field name="DIRECTION">RIGHT</field>
                              </block>
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
        </next>
      </block>
    </next>
  </block>
</xml>`,
    expectedBehavior: 'Apel merah muncul di posisi acak di atas papan rumput.',
    badgeName: 'Ahli Angka Acak',
    badgeDescription: 'Mampu menggunakan perintah acak Python untuk menempatkan makanan!',
    speedDefault: 2
  },
  {
    id: 5,
    slug: 'level-5-makan-dan-tumbuh',
    title: 'Level 5: Nyam! Ular Makan Apel & Skor Bertambah!',
    subtitle: 'Konsep: Deteksi Tabrakan (Collision) & Variabel Skor',
    conceptName: 'Deteksi Tabrakan & Skor',
    icon: '⭐',
    story: 'Kiki sudah sampai di dekat apel! Sekarang kita harus mengecek: Jika kepala ular menyentuh apel, apa yang terjadi? Nyam! Skor bertambah +10, badan ular bertambah panjang 1 ruas, dan apel baru muncul di tempat lain!',
    mission: 'Pasang balok "Jika Ular Makan Apel": naikkan Skor +10, perpanjang badan ular, dan acak lagi apel baru!',
    requirements: [
      'Gunakan balok "Jika Kepala Ular Menyentuh Apel"',
      'Di dalamnya: Tambah Skor +10 dan Perpanjang Badan Ular',
      'Pindahkan Apel ke posisi acak baru',
      'Dapatkan minimal 30 poin (makan 3 apel)!'
    ],
    quiz: {
      id: 'q5',
      question: 'Bagaimana komputer tahu bahwa Ular sudah memakan Apel?',
      explanation: 'Hebat! Komputer membandingkan apakah koordinat X dan Y kepala ular persis sama dengan koordinat apel!',
      options: [
        { id: 'a', text: 'Komputer mencium aroma apel', isCorrect: false },
        { id: 'b', text: 'Ketika koordinat kepala ular sama dengan koordinat apel', isCorrect: true },
        { id: 'c', text: 'Secara kebetulan saja', isCorrect: false }
      ]
    },
    hint: 'Di dalam balok loop, masukkan balok "Jika Kepala Ular Menyentuh Apel". Jangan lupa pasang balok "Tambah Skor" dan "Perpanjang Badan Ular"!',
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="snake_init" x="25" y="20">
    <value name="WIDTH"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
    <value name="HEIGHT"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
    <next>
      <block type="snake_set_position">
        <value name="POS_X"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
        <value name="POS_Y"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
        <next>
          <block type="snake_spawn_food">
            <field name="FOOD_TYPE">apple</field>
            <next>
              <block type="snake_loop">
                <statement name="DO">
                  <block type="snake_step_forward">
                    <next>
                      <block type="snake_check_food">
                        <statement name="DO">
                          <block type="snake_add_score">
                            <value name="POINTS"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                            <next>
                              <block type="snake_grow">
                                <next>
                                  <block type="snake_respawn_food"></block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </statement>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="snake_key_handler">
                    <field name="DIRECTION">UP</field>
                    <next>
                      <block type="snake_key_handler">
                        <field name="DIRECTION">DOWN</field>
                        <next>
                          <block type="snake_key_handler">
                            <field name="DIRECTION">LEFT</field>
                            <next>
                              <block type="snake_key_handler"><field name="DIRECTION">RIGHT</field></block>
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
        </next>
      </block>
    </next>
  </block>
</xml>`,
    expectedBehavior: 'Ular memakan apel, menghasilkan suara "Nyam!", skor bertambah, dan badan semakin panjang.',
    badgeName: 'Koki Ular Rakus',
    badgeDescription: 'Berhasil memprogram tabrakan apel dan pertumbuhan ular!',
    speedDefault: 2.2
  },
  {
    id: 6,
    slug: 'level-6-game-over-dinding',
    title: 'Level 6: Hati-hati Dinding! Game Selesai & Juara',
    subtitle: 'Konsep: Batas Arena & Aturan Game Over',
    conceptName: 'Kondisi Batas & Game Over',
    icon: '🏆',
    story: 'Kiki semakin panjang dan gesit! Tapi ingat, arena game punya tembok pembatas. Jika Kiki menabrak dinding atau menabrak tubuhnya sendiri, permainan selesai! Ini aturan penting dalam game klasik.',
    mission: 'Tambahkan aturan pengecekan: Jika Ular menabrak dinding atau menabrak tubuhnya sendiri, maka tampilkan Game Over!',
    requirements: [
      'Gunakan balok "Jika Menabrak Dinding atau Tubuh"',
      'Panggil balok "Selesaikan Game (Game Over)"',
      'Raih skor minimal 50 poin untuk lulus dan meraih Sertifikat Juara!'
    ],
    quiz: {
      id: 'q6',
      question: 'Jika ukuran papan adalah lebar 20 dan tinggi 20, kapankah Ular dianggap menabrak dinding kiri?',
      explanation: 'Tepat sekali! Sisi paling kiri memiliki nilai X = 0. Jika X lebih kecil dari 0, berarti keluar dari papan permainan!',
      options: [
        { id: 'a', text: 'Saat posisi X kurang dari 0', isCorrect: true },
        { id: 'b', text: 'Saat posisi X sama dengan 10', isCorrect: false },
        { id: 'c', text: 'Saat skor bertambah 100', isCorrect: false }
      ]
    },
    hint: 'Pasang balok "Jika Menabrak Dinding atau Tubuh" di dalam Loop pergerakan setelah memakan apel!',
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="snake_init" x="25" y="15">
    <value name="WIDTH"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
    <value name="HEIGHT"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
    <next>
      <block type="snake_set_position">
        <value name="POS_X"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
        <value name="POS_Y"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
        <next>
          <block type="snake_spawn_food">
            <field name="FOOD_TYPE">apple</field>
            <next>
              <block type="snake_loop">
                <statement name="DO">
                  <block type="snake_step_forward">
                    <next>
                      <block type="snake_check_food">
                        <statement name="DO">
                          <block type="snake_add_score">
                            <value name="POINTS"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                            <next>
                              <block type="snake_grow">
                                <next>
                                  <block type="snake_respawn_food"></block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </statement>
                        <next>
                          <block type="snake_check_collision">
                            <statement name="DO">
                              <block type="snake_game_over">
                                <field name="MESSAGE">Aduh, nabrak! Game Over!</field>
                              </block>
                            </statement>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="snake_key_handler">
                    <field name="DIRECTION">UP</field>
                    <next>
                      <block type="snake_key_handler">
                        <field name="DIRECTION">DOWN</field>
                        <next>
                          <block type="snake_key_handler">
                            <field name="DIRECTION">LEFT</field>
                            <next>
                              <block type="snake_key_handler"><field name="DIRECTION">RIGHT</field></block>
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
        </next>
      </block>
    </next>
  </block>
</xml>`,
    expectedBehavior: 'Game Snake lengkap berfungsi dengan tabrakan dinding, skor, pertambahan panjang badan, dan game over.',
    badgeName: 'Programmer Python Cilik',
    badgeDescription: 'Lulus kursus dan berhasil membuat game Snake utuh dengan Python!',
    speedDefault: 2.4
  },
  {
    id: 7,
    slug: 'level-7-kreasi-bebas',
    title: 'Level 7: Laboratorium Kreasi Bebas (Sandbox)',
    subtitle: 'Modifikasi Game Snake Karyamu Sendiri!',
    conceptName: 'Remix & Kreasi Mandiri',
    icon: '🎨',
    story: 'Selamat! Kamu sudah menguasai semua dasar pemrograman Snake Python! Di mode laboratorium ini, kamu bebas berkreasi: ganti warna kulit Kiki, ganti buah makanan menjadi donat atau stroberi, atur kecepatan kilat, dan download file Python asli (.py) untuk dipamerkan ke teman dan gurumu!',
    mission: 'Bereksperimenlah dengan kode game Snake! Coba ubah kecepatan, warna ular, atau pasang makanan bintang emas!',
    requirements: [
      'Gunakan fitur kustomisasi warna dan kecepatan',
      'Cobalah jalankan game kreasimu',
      'Ekspor kode Python murni (.py) untuk disimpan di komputermu!'
    ],
    quiz: {
      id: 'q7',
      question: 'Apa langkah selanjutnya setelah kamu selesai membuat sebuah program game?',
      explanation: 'Tepat sekali! Programmer hebat selalu bereksperimen, menambah fitur baru yang seru, dan membagikan karyanya!',
      options: [
        { id: 'a', text: 'Bereksperimen, menambah fitur seru, dan berbagi', isCorrect: true },
        { id: 'b', text: 'Menghapus komputernya', isCorrect: false },
        { id: 'c', text: 'Tidak pernah memainkannya lagi', isCorrect: false }
      ]
    },
    hint: 'Gunakan tombol ekspor Python untuk melihat kode game Snake lengkap dalam library Turtle / Pygame!',
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="snake_init" x="20" y="10">
    <value name="WIDTH"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
    <value name="HEIGHT"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
    <next>
      <block type="snake_set_position">
        <value name="POS_X"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
        <value name="POS_Y"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
        <next>
          <block type="snake_spawn_food">
            <field name="FOOD_TYPE">apple</field>
            <next>
              <block type="snake_loop">
                <statement name="DO">
                  <block type="snake_step_forward">
                    <next>
                      <block type="snake_check_food">
                        <statement name="DO">
                          <block type="snake_add_score">
                            <value name="POINTS"><shadow type="math_number"><field name="NUM">15</field></shadow></value>
                            <next>
                              <block type="snake_grow">
                                <next>
                                  <block type="snake_respawn_food"></block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </statement>
                        <next>
                          <block type="snake_check_collision">
                            <statement name="DO">
                              <block type="snake_game_over">
                                <field name="MESSAGE">Game Selesai! Kamu Hebat!</field>
                              </block>
                            </statement>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="snake_key_handler">
                    <field name="DIRECTION">UP</field>
                    <next>
                      <block type="snake_key_handler">
                        <field name="DIRECTION">DOWN</field>
                        <next>
                          <block type="snake_key_handler">
                            <field name="DIRECTION">LEFT</field>
                            <next>
                              <block type="snake_key_handler"><field name="DIRECTION">RIGHT</field></block>
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
        </next>
      </block>
    </next>
  </block>
</xml>`,
    expectedBehavior: 'Mode bebas untuk merancang dan memodifikasi game Snake tanpa batas!',
    badgeName: 'Arsitek Game Cilik',
    badgeDescription: 'Menciptakan variasi game Snake kreatif sendiri!',
    speedDefault: 2.5
  }
];

export const GLOSSARY_TERMS = [
  {
    term: 'Variabel (Variable)',
    icon: '📦',
    simpleExplain: 'Seperti kotak mainan yang diberi label nama untuk menyimpan angka atau kata yang bisa berubah, contohnya skor atau posisi ular.',
    pythonExample: 'skor = 0\nular_x = 10'
  },
  {
    term: 'Perulangan (Loop)',
    icon: '🔄',
    simpleExplain: 'Perintah ke komputer untuk mengulang suatu tindakan berulang kali tanpa lelah, contohnya terus menggerakkan ular maju setiap detik.',
    pythonExample: 'while game_aktif:\n    ular.maju()\n    perbarui_layar()'
  },
  {
    term: 'Percabangan (If - Else)',
    icon: '🔀',
    simpleExplain: 'Keputusan cerdas! "Jika ini terjadi, lakukan itu. Kalau tidak, lakukan hal lain". Contoh: Jika ular makan apel, skor bertambah!',
    pythonExample: 'if ular.posisi == apel.posisi:\n    skor += 10'
  },
  {
    term: 'Fungsi Acak (Random)',
    icon: '🎲',
    simpleExplain: 'Seperti mengocok dadu! Komputer memilih angka sembarang yang tidak bisa ditebak pemain, cocok untuk memunculkan apel.',
    pythonExample: 'import random\napel_x = random.randint(1, 18)'
  },
  {
    term: 'Koordinat (X & Y)',
    icon: '🗺️',
    simpleExplain: 'Alamat rumah di papan game. X adalah garis mendatar (kiri-kanan) dan Y adalah garis tegak (atas-bawah).',
    pythonExample: 'posisi = (x, y)'
  },
  {
    term: 'Bug (Kutu Komputer)',
    icon: '🐛',
    simpleExplain: 'Kesalahan kecil dalam kode yang membuat program bertingkah aneh. Jangan takut bug, kita bisa perbaiki bersama!',
    pythonExample: '# Memperbaiki bug membuat kita jadi programmer hebat!'
  }
];
