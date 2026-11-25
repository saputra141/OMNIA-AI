/**
 * OMNIA AI Admin Dashboard Logic
 * Refactored for Security and Performance
 */

class OmniaAdmin {
    constructor() {
        this.state = {
            stats: { totalUsers: 0, activeRequests: 0, serverHealth: 'N/A', uptime: '0%' },
            users: [],
            activeTab: 'dashboard',
            loading: true,
            apiBase: import.meta.env?.VITE_API_BASE || '',
            token: localStorage.getItem('omnia_admin_token') || ''
        };
        this.init();
    }

    async init() {
        if (!this.state.token) {
            const promptToken = prompt("Masukkan Admin Token:");
            if (promptToken) {
                this.state.token = promptToken;
                localStorage.setItem('omnia_admin_token', promptToken);
            }
        }
        
        this.renderLayout();
        await this.fetchData();
        this.setupEventDelegation();
    }

    async fetchData() {
        this.state.loading = true;
        try {
            const headers = { 
                'Authorization': `Bearer ${this.state.token}`,
                'Content-Type': 'application/json'
            };

            const [statsRes, usersRes] = await Promise.all([
                fetch(`${this.state.apiBase}/api/stats`, { headers }),
                fetch(`${this.state.apiBase}/api/users`, { headers })
            ]);

            if (statsRes.status === 401) throw new Error("Unauthorized");

            this.state.stats = await statsRes.json().catch(() => this.state.stats);
            this.state.users = await usersRes.json().catch(() => []);
        } catch (err) {
            console.error("Fetch error:", err);
            // Fallback untuk demo jika API belum siap
            if (this.state.token === 'demo') {
                this.state.stats = { totalUsers: '1.2k', activeRequests: 42, serverHealth: 'Excellent', uptime: '99%' };
                this.state.users = [{ id: 1, name: "Demo User", email: "demo@omnia.ai", role: "Admin", status: "Active" }];
            }
        } finally {
            this.state.loading = false;
            this.renderContent();
        }
    }

    renderLayout() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <aside class="w-full lg:w-64 glass border-r border-slate-800 flex flex-col h-screen sticky top-0">
                <div class="p-6">
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">OMNIA AI</h1>
                    <p class="text-xs text-slate-500 font-medium">Control Center v1.0</p>
                </div>
                <nav id="sidebar-nav" class="flex-1 px-4 space-y-2">
                    ${this.navItem('dashboard', 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', 'Dashboard')}
                    ${this.navItem('users', 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', 'User Management')}
                </nav>
                <div class="p-4 border-t border-slate-800">
                    <button id="logout-btn" class="w-full text-left text-xs text-slate-500 hover:text-white transition">Sign Out</button>
                </div>
            </aside>
            <main class="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div id="content-area"></div>
            </main>
        `;
    }

    navItem(id, iconPath, label) {
        const isActive = this.state.activeTab === id;
        return `
            <button data-tab="${id}" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"></path></svg>
                <span class="font-medium">${label}</span>
            </button>
        `;
    }

    renderContent() {
        const container = document.getElementById('content-area');
        if (this.state.loading) {
            container.innerHTML = `<div class="animate-pulse">Loading data...</div>`;
            return;
        }

        if (this.state.activeTab === 'dashboard') {
            container.innerHTML = `
                <header class="mb-8">
                    <h2 class="text-3xl font-bold text-white">System Overview</h2>
                    <p class="text-slate-400">Real-time performance metrics.</p>
                </header>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    ${this.statCard('Total Users', this.state.stats.totalUsers, 'text-blue-400')}
                    ${this.statCard('API Calls', this.state.stats.activeRequests, 'text-green-400')}
                    ${this.statCard('Health', this.state.stats.serverHealth, 'text-primary')}
                    ${this.statCard('Uptime', this.state.stats.uptime, 'text-orange-400')}
                </div>
                <div class="glass p-6 rounded-2xl border border-slate-800">
                    <h3 class="text-lg font-semibold mb-4">Users</h3>
                    <table class="w-full">
                        <tbody class="divide-y divide-slate-800">
                            ${this.state.users.map(u => `
                                <tr>
                                    <td class="py-3 text-slate-200">${u.name}</td>
                                    <td class="py-3 text-slate-500 text-sm">${u.role}</td>
                                    <td class="py-3 text-right"><span class="text-green-500 text-xs font-bold uppercase">${u.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            container.innerHTML = `<div class="p-20 text-center text-slate-500">Module [${this.state.activeTab}] is under construction.</div>`;
        }
    }

    statCard(title, value, color) {
        return `<div class="glass p-6 rounded-2xl border border-slate-800"><p class="text-xs text-slate-500 mb-1 capitalize">${title}</p><p class="text-2xl font-bold ${color}">${value}</p></div>`;
    }

    setupEventDelegation() {
        // Menggunakan delegation agar tidak perlu re-bind event setiap render
        document.body.addEventListener('click', (e) => {
            const tabBtn = e.target.closest('[data-tab]');
            if (tabBtn) {
                this.state.activeTab = tabBtn.dataset.tab;
                this.renderLayout(); // Refresh sidebar active state
                this.renderContent();
            }

            if (e.target.id === 'logout-btn') {
                localStorage.removeItem('omnia_admin_token');
                location.reload();
            }
        });
    }
}

new OmniaAdmin();
