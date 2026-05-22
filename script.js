// SUBSTITUA PELA SUA URL (Mantenha o /exec no final)
const API_URL = "https://script.google.com/macros/s/AKfycbwd69RxRJBWoLLIUE65Ck-CYQwB4noi6qetFgeNkiYWzcZhEszhWE3LyD6LmyfBfYOn/exec";

function carregarAgenda() {
    const container = document.getElementById('container-agenda');
    
    // Nome da função de callback
    const callbackName = 'callbackData';
    
    window[callbackName] = function(data) {
        container.innerHTML = data.map(item => `
            <div class="card">
                <p><strong>${item.data} - ${item.horario}</strong></p>
                <p>Cliente: ${item.cliente}</p>
                <p>Procedimento: ${item.procedimento}</p>
            </div>
        `).join('');
    };

    const script = document.createElement('script');
    script.src = `${API_URL}?callback=${callbackName}`;
    document.body.appendChild(script);
}

carregarAgenda();
