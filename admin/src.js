/**
 * OMNIA AI - Architecture Core JS
 * Design System Implementation
 */

const state = {
    isSidebarOpen: true,
    activeTab: 'dashboard',
    user: {
        name: 'Administrator',
        role: 'Superuser',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff'
    },
    stats: [
        { label: 'Total Requests', value: '1.2M', growth: '+12.5%', icon: 'zap' },
        { label: 'Active Users', value: '45.2K', growth: '+8.1%', icon: 'users' },
        { label: 'API Uptime', value: '99.9%', growth: 'Stable', icon: 'shield-check' },
        { label: 'Cost Saved', value: '$12.4K', growth: '+15.2%', icon: 'banknote' }
    ]
};

function init() {
    renderApp();
    setupEventListeners();
    lucide.createIcons();
    // Remove loader after mount
    setTimeout(() => {
        document.getElementById('loader')?.fadeOut();
        document.getElementById('loader')?.remove();
    }, 800);
}

function renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="flex min-h-screen">
            <!-- Sidebar -->
            <aside id="sidebar" class="fixed lg:sticky top-0 left-0 z-50 h-screen w-72 glass border-r border-white/5 transition-all duration-300 transform -translate-x-full lg:translate-x-0">
                <div class="p-6">
                    <div class="flex items-center gap-3 mb-10">
                        <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <i data-lucide="cpu" class="w-6 h-6 text-white"></i>
                        </div>
                        <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">OMNIA AI</span>
                    </div>

                    <nav class="space-y-1">
                        ${renderNavItem('dashboard', 'layout-dashboard', 'Dashboard')}
                        ${renderNavItem('analytics', 'bar-chart-3', 'Analytics')}
                        ${renderNavItem('models', 'brain-circuit', 'AI Models')}
                        ${renderNavItem('users', 'user-cog', 'Management')}
                        <div class="py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold px-4">System</div>
                        ${renderNavItem('settings', 'settings', 'Settings')}
                        ${renderNavItem('logs', 'terminal', 'System Logs')}
                    </nav>
                </div>
                
                <div class="absolute bottom-0 w-full p-6 border-t border-white/5">
                    <div class="flex items-center gap-3 glass p-3 rounded-2xl">
                        <img src="${state.user.avatar}" class="w-10 h-10 rounded-xl object-cover" />
                        <div class="overflow-hidden">
                            <p class="text-sm font-semibold truncate">${state.user.name}</p>
                            <p class="text-[10px] text-slate-500 uppercase tracking-wider">${state.user.role}</p>
                        </div>
                        <button class="ml-auto text-slate-400 hover:text-white transition-colors">
                            <i data-lucide="log-out" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 min-w-0 flex flex-col">
                <!-- Top Header -->
                <header class="h-20 glass sticky top-0 z-40 px-6 flex items-center justify-between border-b border-white/5">
                    <button id="menu-toggle" class="lg:hidden p-2 text-slate-400 hover:bg-white/5 rounded-lg">
                        <i data-lucide="menu" class="w-6 h-6"></i>
                    </button>

                    <div class="flex-1 max-w-xl mx-8 hidden md:block">
                        <div class="relative group">
                            <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500 transition-colors"></i>
                            <input type="text" placeholder="Cari data, model, atau log..." 
                                class="w-full bg-slate-900/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all">
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <button class="relative p-2 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
                            <i data-lucide="bell" class="w-5 h-5"></i>
                            <span class="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-dark-950"></span>
                        </button>
                        <div class="h-8 w-[1px] bg-white/10"></div>
                        <button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                            <span>New Deployment</span>
                        </button>
                    </div>
                </header>

                <!-- Dashboard Content -->
                <div class="p-6 lg:p-10 space-y-8 custom-scrollbar">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-3xl font-bold">Intelligence Overview</h1>
                            <p class="text-slate-400 mt-1">Selamat datang kembali, pantau performa AI Anda secara real-time.</p>
                        </div>
                        <div class="flex gap-2">
                            <select class="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary-500 transition-all cursor-pointer">
                                <option>Last 24 Hours</option>
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                    </div>

                    <!-- Stats Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        ${state.stats.map(stat => `
                            <div class="glass glass-hover p-6 rounded-3xl group transition-all duration-500">
                                <div class="flex items-start justify-between">
                                    <div class="p-3 bg-primary-500/10 rounded-2xl group-hover:bg-primary-500/20 transition-colors">
                                        <i data-lucide="${stat.icon}" class="w-6 h-6 text-primary-500"></i>
                                    </div>
                                    <span class="text-[10px] font-bold px-2 py-1 rounded-full ${stat.growth.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}">
                                        ${stat.growth}
                                    </span>
                                </div>
                                <div class="mt-4">
                                    <h3 class="text-slate-400 text-sm font-medium">${stat.label}</h3>
                                    <p class="text-2xl font-bold mt-1 tabular-nums">${stat.value}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Main Chart & Recent Activity -->
                    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div class="xl:col-span-2 glass rounded-3xl p-6">
                            <div class="flex items-center justify-between mb-6">
                                <h2 class="text-lg font-bold">API Performance Spectrum</h2>
                                <div class="flex items-center gap-2">
                                    <div class="flex items-center gap-1.5"><span class="w-2 h-2 bg-primary-500 rounded-full"></span><span class="text-[10px] text-slate-400">Response Time</span></div>
                                    <div class="flex items-center gap-1.5"><span class="w-2 h-2 bg-purple-500 rounded-full"></span><span class="text-[10px] text-slate-400">Success Rate</span></div>
                                </div>
                            </div>
                            <div class="h-64 flex items-end justify-between gap-2 px-2">
                                ${Array.from({length: 24}).map(() => `
                                    <div class="flex-1 bg-gradient-to-t from-primary-600/20 to-primary-500/60 rounded-t-lg transition-all hover:to-primary-400 cursor-pointer" 
                                         style="height: ${Math.floor(Math.random() * 80) + 20}%"></div>
                                `).join('')}
                            </div>
                            <div class="flex justify-between mt-4 text-[10px] text-slate-500 font-medium px-1 uppercase tracking-tighter">
                                <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>23:59</span>
                            </div>
                        </div>

                        <div class="glass rounded-3xl p-6">
                            <h2 class="text-lg font-bold mb-6">Recent Nodes</h2>
                            <div class="space-y-4">
                                ${[1,2,3,4,5].map(i => `
                                    <div class="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5">
                                        <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary-400 font-bold text-xs">N${i}</div>
                                        <div class="flex-1">
                                            <p class="text-sm font-semibold">Edge-Node-${i}04</p>
                                            <p class="text-[10px] text-slate-500 uppercase">Singapore - Cluster A</p>
                                        </div>
                                        <div class="text-right text-[10px]">
                                            <p class="text-emerald-500 font-bold">ONLINE</p>
                                            <p class="text-slate-500">12ms</p>
                                        </div>
                                    </div>
                                `).join('')}
                                <button class="w-full py-3 text-sm text-slate-400 hover:text-white transition-colors border border-dashed border-white/10 rounded-2xl mt-2">
                                    View All Node Clusters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}

function renderNavItem(id, icon, label) {
    const isActive = state.activeTab === id;
    return `
        <a href="#" onclick="switchTab('${id}')" 
           class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive ? 'sidebar-item-active' : 'text-slate-400 hover:text-white hover:bg-white/5'}">
            <i data-lucide="${icon}" class="w-5 h-5 transition-transform group-hover:scale-110"></i>
            <span class="text-sm font-medium">${label}</span>
            ${id === 'logs' ? '<span class="ml-auto w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>' : ''}
        </a>
    `;
}

window.switchTab = (tab) => {
    state.activeTab = tab;
    renderApp();
    lucide.createIcons();
    setupEventListeners();
};

function setupEventListeners() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    // Close sidebar on click outside (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 1024) {
            if (!sidebar?.contains(e.target) && !menuToggle?.contains(e.target)) {
                sidebar?.classList.add('-translate-x-full');
            }
        }
    });
}

// Global helper for smooth fade
Element.prototype.fadeOut = function() {
    this.style.transition = 'opacity 0.5s ease';
    this.style.opacity = '0';
};

document.addEventListener('DOMContentLoaded', init);
