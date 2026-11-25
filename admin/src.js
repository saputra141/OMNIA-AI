/**
 * OMNIA AI Admin Dashboard Logic
 * Modular Vanilla JS
 */

class OmniaAdmin {
    constructor() {
        this.state = {
            stats: {},
            users: [],
            activeTab: 'dashboard',
            loading: true
        };
        this.init();
    }

    async init() {
        this.renderLayout();
        await this.fetchData();
        this.addEventListeners();
    }

    async fetchData() {
        try {
            // Dalam produksi, ganti URL dengan endpoint backend asli
            const statsRes = await fetch('/api/stats').catch(() => ({ 
                json: () => ({ totalUsers: '1.2k', activeRequests: 42, serverHealth: 'Excellent', uptime: '99%' }) 
            }));
            const usersRes = await fetch('/api/users').catch(() => ({ 
                json: () => ([
                    { id: 1, name: "Admin", email: "admin@omnia.ai", role: "Admin", status: "Active" },
                    { id: 2, name: "Developer", email: "dev@omnia.ai", role: "Editor", status: "Active" }
                ]) 
            }));

            this.state.stats = await statsRes.json();
            this.state.users = await usersRes.json();
            this.state.loading = false;
            this.renderContent();
        } catch (err) {
            console.error("Failed to fetch data:", err);
        }
    }

    renderLayout() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <!-- Sidebar -->
            <aside class="w-full lg:w-64 glass border-r border-slate-800 flex flex-col">
                <div class="p-6">
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">OMNIA AI</h1>
                    <p class="text-xs text-slate-500 font-medium">Control Center v1.0</p>
                </div>
                <nav class="flex-1 px-4 space-y-2">
                    ${this.navItem('dashboard', 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', 'Dashboard')}
                    ${this.navItem('users', 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', 'User Management')}
                    ${this.navItem('settings', 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'Settings')}
                </nav>
                <div class="p-4 border-t border-slate-800">
                    <div class="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg text-sm">
                        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold">A</div>
                        <div>
                            <p class="font-medium">Administrator</p>
                            <p class="text-xs text-slate-400">admin@omnia.ai</p>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div id="content-area">
                    <div class="animate-pulse flex flex-col space-y-4">
                        <div class="h-8 bg-slate-800 rounded w-1/4"></div>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div class="h-32 bg-slate-800 rounded"></div>
                            <div class="h-32 bg-slate-800 rounded"></div>
                            <div class="h-32 bg-slate-800 rounded"></div>
                            <div class="h-32 bg-slate-800 rounded"></div>
                        </div>
                    </div>
                </div>
            </main>
        `;
    }

    navItem(id, iconPath, label) {
        const isActive = this.state.activeTab === id;
        return `
            <button data-tab="${id}" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"></path></svg>
                <span class="font-medium">${label}</span>
            </button>
        `;
    }

    renderContent() {
        const container = document.getElementById('content-area');
        if (this.state.activeTab === 'dashboard') {
            container.innerHTML = `
                <header class="mb-8">
                    <h2 class="text-3xl font-bold text-white">System Overview</h2>
                    <p class="text-slate-400">Real-time performance and analytics monitoring.</p>
                </header>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    ${this.statCard('Total Users', this.state.stats.totalUsers, 'text-blue-400')}
                    ${this.statCard('Active API Calls', this.state.stats.activeRequests, 'text-green-400')}
                    ${this.statCard('Server Health', this.state.stats.serverHealth, 'text-primary')}
                    ${this.statCard('Uptime', this.state.stats.uptime, 'text-orange-400')}
                </div>

                <div class="glass p-6 rounded-2xl border border-slate-800">
                    <h3 class="text-lg font-semibold mb-4">Recent Users</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="text-slate-500 border-b border-slate-800 text-sm">
                                    <th class="pb-4 font-medium uppercase">User</th>
                                    <th class="pb-4 font-medium uppercase">Role</th>
                                    <th class="pb-4 font-medium uppercase">Status</th>
                                    <th class="pb-4 font-medium uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800">
                                ${this.state.users.map(user => `
                                    <tr class="text-sm">
                                        <td class="py-4 font-medium text-slate-200">
                                            ${user.name}<br><span class="text-xs text-slate-500">${user.email}</span>
                                        </td>
                                        <td class="py-4 text-slate-400">${user.role}</td>
                                        <td class="py-4">
                                            <span class="px-2 py-1 rounded-full text-[10px] uppercase font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                                                ${user.status}
                                            </span>
                                        </td>
                                        <td class="py-4">
                                            <button class="text-primary hover:underline font-medium">Edit</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `<div class="p-20 text-center text-slate-500">Fitur ${this.state.activeTab} sedang dalam pengembangan.</div>`;
        }
    }

    statCard(title, value, colorClass) {
        return `
            <div class="glass p-6 rounded-2xl border border-slate-800">
                <p class="text-sm text-slate-500 mb-1">${title}</p>
                <p class="text-2xl font-bold ${colorClass}">${value}</p>
            </div>
        `;
    }

    addEventListeners() {
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.state.activeTab = e.currentTarget.dataset.tab;
                this.renderLayout();
                this.renderContent();
                this.addEventListeners(); // Re-bind
            });
        });
    }
}

// Start Application
window.addEventListener('DOMContentLoaded', () => {
    new OmniaAdmin();
});
