const API_URL = window.location.origin === 'http://127.0.0.1:5500' ? 'http://localhost:8787' : '';

async function loadTasks() {
    const tbody = document.getElementById('task-body');
    try {
        const response = await fetch(`${API_URL}/api/tasks`);
        const tasks = await response.json();
        
        // Update Stats
        document.getElementById('stat-total').innerText = tasks.length;
        document.getElementById('stat-pending').innerText = tasks.filter(t => t.status === 'pending').length;
        document.getElementById('stat-completed').innerText = tasks.filter(t => t.status === 'completed').length;

        tbody.innerHTML = tasks.map(task => `
            <tr class="border-t border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                <td class="p-4 text-sm max-w-xs truncate">${task.prompt}</td>
                <td class="p-4"><span class="px-2 py-1 bg-slate-700 rounded text-xs">${task.provider}</span></td>
                <td class="p-4">
                    <span class="px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(task.status)}">
                        ${task.status.toUpperCase()}
                    </span>
                </td>
                <td class="p-4 text-xs text-slate-400">${new Date(task.created_at).toLocaleString()}</td>
                <td class="p-4 text-sm">
                    ${task.result_url ? `<a href="${task.result_url}" target="_blank" class="text-blue-400 hover:underline">View Video</a>` : '-'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
    }
}

function getStatusClass(status) {
    switch(status) {
        case 'completed': return 'bg-green-500/20 text-green-400';
        case 'pending': return 'bg-yellow-500/20 text-yellow-400';
        case 'failed': return 'bg-red-500/20 text-red-400';
        default: return 'bg-slate-500/20 text-slate-400';
    }
}

// Initial Load
loadTasks();
setInterval(loadTasks, 10000);
