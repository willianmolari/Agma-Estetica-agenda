const API_URL = "SUA_URL_DO_APPS_SCRIPT_AQUI"; // Cole a URL que você copiou do Google

// Função para buscar e listar agendamentos
async function carregarAgenda() {
    const container = document.getElementById('container-agenda');
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        container.innerHTML = data.map(item => `
            <div class="card">
                <p><strong>${item.data} - ${item.horario}</strong></p>
                <p>${item.cliente} | ${item.procedimento}</p>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = "Erro ao carregar dados.";
    }
}

// Função para salvar novo agendamento
async function salvar() {
    const dados = {
        data: document.getElementById('data').value,
        horario: document.getElementById('horario').value,
        cliente: document.getElementById('cliente').value,
        procedimento: document.getElementById('procedimento').value
    };

    if(!dados.cliente || !dados.data) return alert("Preencha todos os campos!");

    fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', // Necessário para evitar erro de CORS
        body: JSON.stringify(dados)
    }).then(() => {
        alert("Agendado com sucesso!");
        location.reload();
    });
}

carregarAgenda();
