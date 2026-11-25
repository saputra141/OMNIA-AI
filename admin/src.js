async function fetchLogs() {
    const token = document.getElementById('adminToken').value;
    const tbody = document.getElementById('logTableBody');
    const totalReq = document.getElementById('totalRequests');
    
    if (!token) {
        alert("Please enter Admin Token");
        return;
    }

    try {
        const response = await fetch('/api/admin/logs', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Unauthorized or Server Error");
        
        const logs = await response.json();
        tbody.innerHTML = '';
        totalReq.innerText = logs.length;

        logs.forEach(log => {
            const row = `
                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td class="p-4 text-slate-500">${log.id}</td>
                    <td class="p-4 font-mono">${log.user_id}</td>
                    <td class="p-4"><span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs">${log.action}</span></td>
                    <td class="p-4 text-slate-300">${log.provider}</td>
                    <td class="p-4 text-slate-500 text-xs">${new Date(log.timestamp).toLocaleString()}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (err) {
        alert(err.message);
    }
}
