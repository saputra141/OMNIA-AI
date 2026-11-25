// OMNIA AI - V2 Core Logic
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    const STYLES_DATA = [
        { id: 'doodle', name: 'Doodle Manusia Gua', desc: 'Gaya sejarah penemuan purba neon brush.', img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=200' },
        { id: 'stickman', name: 'Stickman Putih', desc: 'Penjelasan kehidupan sehari-hari psikologi.', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200' },
        { id: 'cartoon', name: 'Kartun Anak Ceria', desc: 'Dongeng & edukasi anak bahasa Indonesia.', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=200' },
        { id: 'mystery', name: 'Misteri Gelap', desc: 'Cerita misteri, urban legend, true crime.', img: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=200' },
        { id: 'anime', name: 'Anime Sinematik', desc: 'Aksi fantasi dengan kontras tinggi.', img: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=200' },
        { id: 'clay', name: '3D Clay Lucu', desc: 'Edukasi ringan, resep, tokoh lucu.', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=200' },
        { id: 'islamic', name: 'Cahaya Islami', desc: 'Doa, hadits, dan sejarah tanpa wajah.', img: 'https://images.unsplash.com/photo-1590076215667-873d6f3731ad?auto=format&fit=crop&q=80&w=200' },
        { id: 'infographic', name: 'Infografis 3D', desc: 'Presentasi bisnis & data modern.', img: 'https://images.unsplash.com/photo-1551288049-bbbda5366392?auto=format&fit=crop&q=80&w=200' }
    ];

    const grid = document.getElementById('visual-styles-grid');
    let selectedStyle = 'doodle';

    // Render Style Cards
    function renderStyles() {
        grid.innerHTML = STYLES_DATA.map(style => `
            <div onclick="window.selectStyle('${style.id}')" 
                 id="style-${style.id}"
                 class="relative group cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-white/5 transition-all hover:scale-[1.02] ${style.id === selectedStyle ? 'card-active' : ''}">
                <img src="${style.img}" class="w-full h-32 object-cover opacity-60 group-hover:opacity-100 transition-opacity">
                <div class="p-3">
                    <h5 class="text-sm font-bold truncate">${style.name}</h5>
                    <p class="text-[10px] text-slate-400 line-clamp-2 mt-1">${style.desc}</p>
                </div>
                ${style.id === selectedStyle ? '<div class="absolute top-2 right-2 bg-primary-500 rounded-full p-1"><i data-lucide="check" class="w-3 h-3 text-white"></i></div>' : ''}
            </div>
        `).join('');
        lucide.createIcons();
    }

    window.selectStyle = (id) => {
        selectedStyle = id;
        renderStyles();
    };

    // Modal Logic
    const modal = document.getElementById('modal-char');
    const btnAddChar = document.getElementById('btn-add-char');
    const btnCloseModal = document.getElementById('close-modal');

    btnAddChar.addEventListener('click', () => modal.classList.remove('hidden'));
    btnCloseModal.addEventListener('click', () => modal.classList.add('hidden'));

    // Handle Render Flow
    const btnRender = document.querySelector('button.bg-primary-600');
    btnRender.addEventListener('click', () => {
        btnRender.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Memproses...';
        lucide.createIcons();
        
        setTimeout(() => {
            alert('Video sedang diproses! Silakan cek tab Library untuk memantau progres.');
            btnRender.innerHTML = '<i data-lucide="play-circle" class="w-4 h-4"></i> Mulai Render';
            lucide.createIcons();
        }, 2000);
    });

    renderStyles();
});
