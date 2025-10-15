// prisma/seed/blogs.ts
import { PrismaClient } from '@prisma/client'

export async function seedBlogs(prisma: PrismaClient) {
  console.log('🌱 Seeding blogs...')

  // Get the first user to use as author
  const author = await prisma.user.findFirst()
  if (!author) {
    throw new Error('No users found. Please seed users first.')
  }

  await prisma.blog.deleteMany() // Clear existing data

  const blogs = [
    {
      title: 'Deploy Aplikasi Next.js dengan mudah dan gratis menggunakan Vercel',
      excerpt: 'Panduan Lengkap Step-by-Step untuk Deploy Aplikasi Next.js di Vercel.',
      content: `<h2>Pendahuluan</h2>
<p>Next.js adalah salah satu framework React yang paling populer untuk membangun aplikasi web modern. Dengan dukungan <strong>Server-Side Rendering (SSR)</strong>, <strong>Static Site Generation (SSG)</strong>, hingga <strong>Incremental Static Regeneration (ISR)</strong>, Next.js menawarkan performa yang optimal sekaligus fleksibilitas tinggi.</p>
<p>Salah satu cara termudah dan tercepat untuk <strong>mendeploy aplikasi Next.js</strong> adalah menggunakan <strong>Vercel</strong>. Vercel sendiri merupakan platform hosting serverless yang dibuat oleh tim pembuat Next.js, sehingga integrasinya sangat mulus.</p>
<p>Pada artikel ini, kita akan membahas langkah demi langkah bagaimana cara mendeploy aplikasi Next.js ke Vercel.</p>
<hr>
<h2>Persiapan</h2>
<p>Sebelum memulai, pastikan kamu sudah menyiapkan beberapa hal berikut:</p>
<ul>
<li><strong>Node.js &amp; npm/yarn</strong> sudah terinstal di komputer.</li>
<li><strong>Aplikasi Next.js</strong> sudah berjalan di lokal.</li>
<li><strong>Akun Vercel</strong> (bisa daftar gratis di <a target="_blank" rel="noopener noreferrer nofollow" href="https://vercel.com">https://vercel.com</a>).</li>
<li><strong>GitHub/GitLab/Bitbucket repository</strong> tempat menyimpan source code project.</li>
</ul>
<hr>
<h2>Step 1: Membuat Project Next.js (Opsional)</h2>
<p>Jika belum punya project Next.js, buat project baru dengan perintah berikut:</p>
<pre><code>npx create-next-app@latest my-next-app
cd my-next-app
npm run dev</code></pre>
<p>Setelah itu buka <a target="_blank" rel="noopener noreferrer nofollow" href="http://localhost:3000">http://localhost:3000</a> untuk memastikan aplikasi berjalan.</p>
<hr>
<h2>Step 2: Push Project ke GitHub</h2>
<p>Agar bisa dideploy di Vercel, project Next.js harus ada di repository Git (GitHub, GitLab, atau Bitbucket).</p>
<pre><code>git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/my-next-app.git
git push -u origin main</code></pre>
<hr>
<h2>Step 3: Login ke Vercel</h2>
<ol>
<li>Buka <a target="_blank" rel="noopener noreferrer nofollow" href="https://vercel.com">https://vercel.com</a>.</li>
<li>Login menggunakan GitHub/GitLab/Bitbucket.</li>
<li>Klik tombol <strong>"New Project"</strong>.</li>
</ol>
<hr>
<h2>Step 4: Import Project</h2>
<ol>
<li>Pilih repository yang sudah kamu push ke GitHub.</li>
<li>Klik <strong>Import</strong>.</li>
<li>Vercel akan otomatis mendeteksi bahwa project kamu adalah <strong>Next.js</strong>.</li>
<li>Klik <strong>Deploy</strong>.</li>
</ol>
<hr>
<h2>Step 5: Tunggu Proses Build</h2>
<p>Vercel akan menjalankan proses build secara otomatis. Biasanya membutuhkan beberapa menit, tergantung ukuran project.</p>
<p>Jika sukses, kamu akan mendapatkan domain default seperti:</p>
<pre><code>https://my-next-app.vercel.app</code></pre>
<hr>
<h2>Step 6: Custom Domain (Opsional)</h2>
<p>Jika ingin menggunakan domain sendiri:</p>
<ol>
<li>Buka dashboard project di Vercel.</li>
<li>Masuk ke tab <strong>Settings &gt; Domains</strong>.</li>
<li>Tambahkan domain milikmu.</li>
<li>Update DNS domain ke Vercel.</li>
</ol>
<hr>
<h2>Step 7: Continuous Deployment</h2>
<p>Setiap kali kamu melakukan <strong>push ke GitHub</strong>, Vercel akan otomatis:</p>
<ul>
<li>Build ulang project.</li>
<li>Deploy versi terbaru.</li>
</ul>
<p>Dengan cara ini, workflow development menjadi sangat cepat dan praktis.</p>
<hr>
<h2>Kesimpulan</h2>
<p>Deploying Next.js ke Vercel sangat mudah karena:</p>
<ul>
<li>Integrasi langsung (Next.js dibuat oleh tim yang sama dengan Vercel).</li>
<li>Otomatisasi penuh (build &amp; deploy langsung dari GitHub).</li>
<li>Gratis untuk penggunaan dasar (hobby plan).</li>
</ul>
<p>Dengan langkah-langkah di atas, kamu sudah bisa mendeploy aplikasi Next.js ke production dalam hitungan menit. 🚀</p>`,
      authorId: author.id,
      slug: 'deploy-aplikasi-nextjs-dengan-mudah-dan-gratis-menggunakan-vercel',
      tags: ['Next.js', 'Vercel', 'Deployment'],
      published: true
    },
    {
      title: 'Panduan Lengkap Membangun RESTful API dengan Node.js dan Express',
      excerpt: 'Pelajari cara membangun RESTful API yang efisien dan terstruktur menggunakan Node.js dan Express. Dari setup dasar hingga implementasi CRUD, artikel ini akan membimbing Anda langkah demi langkah dengan contoh kode yang siap digunakan.',
      content: `<h2><strong>Membangun RESTful API dengan Node.js dan Express</strong></h2>
<p>Dalam era pengembangan web modern, RESTful API menjadi tulang punggung komunikasi antara frontend dan backend. Node.js bersama framework Express.js menawarkan solusi efisien untuk membangun API yang cepat dan skalabel. Artikel ini akan memandu Anda membuat RESTful API lengkap dengan operasi CRUD.</p>

<h3><strong>Apa Itu RESTful API?</strong></h3>
<p>REST (Representational State Transfer) adalah arsitektur yang menggunakan HTTP protocol untuk komunikasi data. RESTful API mengikuti prinsip:</p>
<ul>
<li><strong>Stateless</strong>: Setiap request harus mengandung semua informasi yang dibutuhkan.</li>
<li><strong>Resource-Based</strong>: Data diakses sebagai resource melalui endpoint.</li>
<li><strong>Uniform Interface</strong>: Konsistensi dalam struktur request/response.</li>
</ul>

<h3><strong>Langkah 1: Persiapan Environment</strong></h3>
<p>Pastikan Anda telah menginstal:</p>
<ul>
<li>Node.js (versi 16 atau lebih baru)</li>
<li>npm atau yarn</li>
<li>Text editor (VS Code recommended)</li>
</ul>

<h3><strong>Langkah 2: Inisialisasi Proyek</strong></h3>
<p>Buat folder proyek dan jalankan:</p>
<pre><code>mkdir my-rest-api
cd my-rest-api
npm init -y</code></pre>

<h3><strong>Langkah 3: Instalasi Dependencies</strong></h3>
<pre><code>npm install express nodemon</code></pre>
<ul>
<li><strong>Express</strong>: Framework web untuk Node.js</li>
<li><strong>Nodemon</strong>: Tools untuk restart otomatis selama development</li>
</ul>

<h3><strong>Langkah 4: Setup Server Dasar</strong></h3>
<p>Buat file <code>index.js</code>:</p>
<pre><code>const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Data sementara (simulasi database)
let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Books API!' });
});

// GET semua buku
app.get('/api/books', (req, res) => {
  res.json(books);
});

// GET buku by ID
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// POST buku baru
app.post('/api/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  
  const newBook = {
    id: books.length + 1,
    title,
    author
  };
  
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT update buku
app.put('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  
  const { title, author } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;
  
  res.json(book);
});

// DELETE buku
app.delete('/api/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Book not found' });
  
  books.splice(index, 1);
  res.status(204).send();
});

// Jalankan server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});</code></pre>

<h3><strong>Langkah 5: Konfigurasi Nodemon</strong></h3>
<p>Tambahkan script di <code>package.json</code>:</p>
<pre><code>"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}</code></pre>
<p>Jalankan development server:</p>
<pre><code>npm run dev</code></pre>

<h3><strong>Langkah 6: Testing API dengan Postman</strong></h3>
<p>Gunakan Postman untuk menguji endpoint:</p>

<ol>
<li><strong>GET All Books</strong>
<ul>
<li>Method: GET</li>
<li>URL: <code>http://localhost:3000/api/books</code></li>
</ul>
</li>

<li><strong>GET Book by ID</strong>
<ul>
<li>Method: GET</li>
<li>URL: <code>http://localhost:3000/api/books/1</code></li>
</ul>
</li>

<li><strong>POST New Book</strong>
<ul>
<li>Method: POST</li>
<li>URL: <code>http://localhost:3000/api/books</code></li>
<li>Body (raw JSON):</li>
</ul>
<pre><code>{
  "title": "1984",
  "author": "George Orwell"
}</code></pre>
</li>

<li><strong>PUT Update Book</strong>
<ul>
<li>Method: PUT</li>
<li>URL: <code>http://localhost:3000/api/books/1</code></li>
<li>Body:</li>
</ul>
<pre><code>{
  "title": "The Great Gatsby - Updated"
}</code></pre>
</li>

<li><strong>DELETE Book</strong>
<ul>
<li>Method: DELETE</li>
<li>URL: <code>http://localhost:3000/api/books/1</code></li>
</ul>
</li>
</ol>

<h3><strong>Best Practices yang Diimplementasikan</strong></h3>
<ol>
<li><strong>Status Code yang Tepat</strong>
<ul>
<li>200: Success</li>
<li>201: Created</li>
<li>400: Bad Request</li>
<li>404: Not Found</li>
</ul>
</li>

<li><strong>Error Handling Dasar</strong>
<ul>
<li>Validasi input</li>
<li>Handling resource tidak ditemukan</li>
</ul>
</li>

<li><strong>Struktur Response Konsisten</strong>
<ul>
<li>Selalu kembalikan JSON</li>
<li>Pesan error yang informatif</li>
</ul>
</li>
</ol>

<h3><strong>Langkah Selanjutnya</strong></h3>
<p>Untuk pengembangan lebih lanjut:</p>
<ul>
<li>Integrasi database (MongoDB dengan Mongoose atau PostgreSQL)</li>
<li>Authentication dengan JWT</li>
<li>Rate limiting</li>
<li>Documentation dengan Swagger</li>
<li>Unit testing dengan Jest</li>
</ul>

<h3><strong>Kesimpulan</strong></h3>
<p>Dengan Node.js dan Express, membangun RESTful API menjadi proses yang straightforward. Struktur yang kita buat sudah mengikuti konvensi REST dan siap untuk dikembangkan lebih lanjut.</p>

<p><strong>Tips Terakhir:</strong></p>
<ul>
<li>Selalu gunakan version control (Git)</li>
<li>Terapkan ESLint untuk konsistensi kode</li>
<li>Dokumentasi API dengan tools seperti Postman atau Swagger</li>
</ul>

<p>Dengan mengikuti panduan ini, Anda sekarang memiliki fondasi kuat untuk mengembangkan RESTful API yang robust dan mudah dipelihara. Selamat coding! 🚀</p>`,
      authorId: author.id,
      slug: 'membangun-restful-api-dengan-nodejs-dan-express',
      tags: ['Node.js', 'Express', 'API', 'RESTful API', 'Backend Development'],
      published: true,
    },
    {
      title: '10 Tips Meningkatkan Performa Aplikasi Web',
      excerpt: 'Tips dan trik untuk mengoptimalkan kecepatan dan performa aplikasi web Anda.',
      content: `<h2>Pendahuluan</h2>
<p>Performa aplikasi web adalah faktor krusial yang memengaruhi pengalaman pengguna (UX) dan SEO. Aplikasi yang lambat dapat menyebabkan frustrasi pengguna, meningkatkan bounce rate, dan menurunkan peringkat di mesin pencari. Oleh karena itu, mengoptimalkan performa aplikasi web sangat penting bagi pengembang.</p>
<p>Berikut adalah 10 tips efektif untuk meningkatkan performa aplikasi web Anda:</p>
<hr>
<h2>1. Gunakan CDN (Content Delivery Network)</h2>
<p>CDN membantu mendistribusikan konten statis (gambar, CSS, JS) ke server di berbagai lokasi geografis. Ini mengurangi latensi dan mempercepat waktu muat halaman, terutama untuk pengguna yang jauh dari server utama.</p>
<hr>
<h2>2. Optimalkan Gambar</h2>
<p>Gambar sering menjadi penyebab utama lambatnya waktu muat halaman. Gunakan format gambar modern seperti WebP, kompres gambar tanpa mengorbankan kualitas, dan gunakan atribut <code>srcset</code> untuk melayani gambar dengan resolusi sesuai perangkat pengguna.</p>
<hr>
<h2>3. Minifikasi dan Bundling</h2>
<p>Minifikasi menghapus karakter yang tidak perlu dari file CSS dan JavaScript, sementara bundling menggabungkan beberapa file menjadi satu. Ini mengurangi ukuran file dan jumlah permintaan HTTP, mempercepat waktu muat halaman.</p>
<hr>
<h2>4. Gunakan Lazy Loading</h2>
<p>Lazy loading menunda pemuatan gambar dan konten lain hingga benar-benar diperlukan (misalnya saat pengguna menggulir ke bawah). Ini mengurangi beban awal halaman dan mempercepat waktu muat awal.</p>
<hr>
<h2>5. Manfaatkan Caching</h2>
<p>Caching menyimpan salinan data di lokasi terdekat dengan pengguna, sehingga mengurangi waktu akses ke server. Gunakan header cache yang tepat untuk mengontrol bagaimana dan kapan konten disimpan dalam cache.</p>
<hr>
<h2>6. Optimalkan Kode Backend</h2>
<p>Pastikan kode backend Anda efisien dan tidak melakukan operasi yang tidak perlu. Gunakan query database yang dioptimalkan, hindari loop yang tidak perlu, dan gunakan teknik seperti pagination untuk mengelola data besar.</p>
<hr>
<h2>7. Gunakan HTTP/2</h2>
<p>HTTP/2 menawarkan beberapa peningkatan dibandingkan HTTP/1.1, termasuk multiplexing (mengirim beberapa permintaan dalam satu koneksi), header compression, dan server push. Ini dapat secara signifikan meningkatkan performa aplikasi web.</p>
<hr>
<h2>8. Kurangi Redirects</h2>
<p>Setiap redirect menambah waktu muat halaman karena memerlukan permintaan tambahan ke server. Minimalkan penggunaan redirects sebanyak mungkin untuk mempercepat waktu muat.</p>
<hr>
<h2>9. Monitor Performa Secara Berkala</h2>
<p>Gunakan alat seperti Google Lighthouse, WebPageTest, atau GTmetrix untuk memantau performa aplikasi web Anda secara berkala. Ini membantu mengidentifikasi masalah dan area yang perlu dioptimalkan.</p>
<hr>
<h2>10. Gunakan Framework dan Library yang Ringan</h2>
<p>Pilih framework dan library yang sesuai dengan kebutuhan aplikasi Anda. Hindari penggunaan library besar jika hanya membutuhkan sebagian kecil fungsionalitasnya. Framework ringan seperti Preact atau Svelte dapat menjadi alternatif yang baik untuk aplikasi sederhana.</p>
<hr>
<h2>Kesimpulan</h2>
<p>Meningkatkan performa aplikasi web adalah proses berkelanjutan yang memerlukan perhatian terhadap detail dan pemantauan rutin. Dengan menerapkan tips di atas, Anda dapat menciptakan pengalaman pengguna yang lebih baik, meningkatkan retensi pengguna, dan mendukung kesuksesan aplikasi web Anda di pasar yang kompetitif.</p>`,
      authorId: author.id,
      slug: '10-tips-meningkatkan-performa-aplikasi-web',
      tags: ['Performance', 'Web Development', 'Optimization', 'Frontend', 'Backend'],
      published: true,
    },
    {
      title: 'Mengenal TypeScript: JavaScript dengan Superpowers',
      excerpt: 'Pelajari dasar-dasar TypeScript dan bagaimana TypeScript dapat meningkatkan produktivitas development Anda.',
      content: `<h2>Apa Itu TypeScript?</h2>
<p>TypeScript adalah bahasa pemrograman yang dikembangkan oleh Microsoft yang merupakan superset dari JavaScript. TypeScript menambahkan fitur static typing ke JavaScript, yang membantu mendeteksi error lebih awal dan membuat kode lebih mudah dipahami dan dipelihara.</p>

<h2>Keuntungan Menggunakan TypeScript</h2>
<ul>
<li><strong>Static Typing</strong>: Mendeteksi error pada waktu kompilasi</li>
<li><strong>Better IDE Support</strong>: Autocomplete dan refactoring yang lebih baik</li>
<li><strong>Enhanced Readability</strong>: Kode lebih mudah dipahami</li>
<li><strong>Easier Refactoring</strong>: Perubahan kode lebih aman</li>
</ul>

<h2>Dasar-Dasar TypeScript</h2>
<pre><code>// Basic types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Interface
interface User {
  id: number;
  name: string;
  email: string;
}

// Function with types
function getUser(id: number): User {
  return {
    id: id,
    name: "John Doe",
    email: "john@example.com"
  };
}</code></pre>

<h2>Kesimpulan</h2>
<p>TypeScript memberikan keamanan tipe dan tooling yang lebih baik untuk pengembangan JavaScript skala besar. Meskipun ada kurva belajar, manfaat yang didapat sepadan dengan usaha yang dikeluarkan.</p>`,
      authorId: author.id,
      slug: 'mengenal-typescript-javascript-dengan-superpowers',
      tags: ['TypeScript', 'JavaScript', 'Web Development', 'Programming'],
      published: true,
    }
  ]

  for (const blog of blogs) {
    await prisma.blog.create({
      data: blog,
    })
  }

  console.log('✅ Blogs seeding finished.')
}