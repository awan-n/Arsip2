document.addEventListener('DOMContentLoaded', () => {
    // Data Storage Dinamis
    let archives = [
        {
            id: 'ARS-2026-001',
            noSurat: '005/ADM/XI/2026',
            judul: 'Surat Undangan Rapat Koordinasi Tahunan',
            jenis: 'Surat Masuk',
            kategori: 'Undangan',
            tanggal: '2026-10-24',
            pengirimPenerima: 'PT Media Nusantara',
            file: 'undangan_rapat.pdf'
        },
        {
            id: 'ARS-2026-002',
            noSurat: '012/HRD/XI/2026',
            judul: 'Surat Keputusan Promosi Jabatan',
            jenis: 'Surat Keluar',
            kategori: 'SK',
            tanggal: '2026-10-22',
            pengirimPenerima: 'Divisi HRD',
            file: 'sk_promosi_2026.pdf'
        },
        {
            id: 'ARS-2026-003',
            noSurat: '088/FIN/X/2026',
            judul: 'Laporan Keuangan Triwulan III',
            jenis: 'Surat Masuk',
            kategori: 'Laporan',
            tanggal: '2026-10-15',
            pengirimPenerima: 'Kementerian Keuangan',
            file: 'laporan_q3_2026.pdf'
        }
    ];

    // Elemen DOM
    const tableBody = document.getElementById('archiveTableBody');
    const searchInput = document.getElementById('searchInput');
    const filterJenis = document.getElementById('filterJenis');
    const filterKategori = document.getElementById('filterKategori');
    const formTambah = document.getElementById('formTambahArsip');

    // Fungsi Render Tabel Data Surat
    function renderTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-6 text-gray-500">
                        Tidak ada data arsip surat yang ditemukan.
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach((item, index) => {
            const isMasuk = item.jenis === 'Surat Masuk';
            const badgeClass = isMasuk 
                ? 'bg-blue-100 text-blue-800 border-blue-200' 
                : 'bg-green-100 text-green-800 border-green-200';

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors border-b border-gray-100';
            tr.innerHTML = `
                <td class="py-3 px-4 text-sm font-medium text-gray-900">${index + 1}</td>
                <td class="py-3 px-4 text-sm font-semibold text-gray-800">${item.noSurat}</td>
                <td class="py-3 px-4 text-sm text-gray-700 font-medium">${item.judul}</td>
                <td class="py-3 px-4 text-sm">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}">
                        ${item.jenis}
                    </span>
                </td>
                <td class="py-3 px-4 text-sm text-gray-600">${item.kategori}</td>
                <td class="py-3 px-4 text-sm text-gray-600">${item.tanggal}</td>
                <td class="py-3 px-4 text-sm text-center">
                    <button class="btn-detail text-indigo-600 hover:text-indigo-900 mx-1 font-medium" data-id="${item.id}">Detail</button>
                    <button class="btn-hapus text-red-600 hover:text-red-900 mx-1 font-medium" data-id="${item.id}">Hapus</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        updateSummaryCounts();
    }

    // Update Counter Ringkasan Statistik
    function updateSummaryCounts() {
        const totalElem = document.getElementById('totalArsipCount');
        const masukElem = document.getElementById('suratMasukCount');
        const keluarElem = document.getElementById('suratKeluarCount');

        if (totalElem) totalElem.textContent = archives.length;
        if (masukElem) masukElem.textContent = archives.filter(a => a.jenis === 'Surat Masuk').length;
        if (keluarElem) keluarElem.textContent = archives.filter(a => a.jenis === 'Surat Keluar').length;
    }

    // Handler Tambah Surat Baru dari Form Input
    if (formTambah) {
        formTambah.addEventListener('submit', (e) => {
            e.preventDefault();

            const noSurat = document.getElementById('inputNoSurat').value;
            const judul = document.getElementById('inputJudul').value;
            const jenis = document.getElementById('inputJenis').value;
            const kategori = document.getElementById('inputKategori').value;
            const tanggal = document.getElementById('inputTanggal').value;
            const pengirimPenerima = document.getElementById('inputPengirimPenerima')?.value || '-';
            const fileInput = document.getElementById('inputFile');
            const fileName = fileInput && fileInput.files[0] ? fileInput.files[0].name : 'dokumen.pdf';

            const newArchive = {
                id: `ARS-2026-00${archives.length + 1}`,
                noSurat: noSurat,
                judul: judul,
                jenis: jenis,
                kategori: kategori,
                tanggal: tanggal,
                pengirimPenerima: pengirimPenerima,
                file: fileName
            };

            // Tambahkan ke array tanpa batas 3
            archives.unshift(newArchive);

            // Re-render tabel
            renderTable(archives);

            // Reset Form & Tutup Modal jika ada
            formTambah.reset();
            const modalTambah = document.getElementById('modalTambahArsip');
            if (modalTambah) {
                modalTambah.classList.add('hidden');
            }
        });
    }

    // Filter & Search Event Handler
    function filterData() {
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        const jenisVal = filterJenis ? filterJenis.value : '';
        const katVal = filterKategori ? filterKategori.value : '';

        const filtered = archives.filter(item => {
            const matchQuery = item.noSurat.toLowerCase().includes(query) || item.judul.toLowerCase().includes(query);
            const matchJenis = jenisVal === '' || item.jenis === jenisVal;
            const matchKategori = katVal === '' || item.kategori === katVal;
            return matchQuery && matchJenis && matchKategori;
        });

        renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener('input', filterData);
    if (filterJenis) filterJenis.addEventListener('change', filterData);
    if (filterKategori) filterKategori.addEventListener('change', filterData);

    // Event Delegation Hapus Data
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-hapus')) {
                const id = e.target.getAttribute('data-id');
                archives = archives.filter(a => a.id !== id);
                filterData();
            }
        });
    }

    // Render Awal
    renderTable(archives);
});