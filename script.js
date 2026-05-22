const API_URL = "hhttps://script.google.com/macros/s/AKfycbwd69RxRJBWoLLIUE65Ck-CYQwB4noi6qetFgeNkiYWzcZhEszhWE3LyD6LmyfBfYOn/exec";

// ---------------- CARREGAR AGENDA ----------------
async function carregarAgenda() {
    const list = document.getElementById("agenda-list");

    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        list.innerHTML = data.length
            ? data.map(item => `
                <div class="card">
                    <p><strong>${item.data} às ${item.horario}</strong></p>
                    <p>${item.cliente} - ${item.procedimento}</p>
                </div>
            `).join('')
            : "<p>Nenhuma agenda encontrada</p>";

    } catch (err) {
        console.error("Erro ao carregar agenda:", err);
        list.innerHTML = "<p>Erro ao carregar agenda</p>";
    }
}

// ---------------- SALVAR AGENDA (SEM FETCH POST) ----------------
// 🔥 ISSO AQUI É O QUE RESOLVE O CORS DEFINITIVAMENTE
const form = document.getElementById("agenda-form");

form.action = API_URL;
form.method = "POST";

// depois de enviar, limpa e recarrega
form.addEventListener("submit", () => {
    setTimeout(async () => {
        form.reset();
        await carregarAgenda();
    }, 1200);
});

// ---------------- INICIALIZA ----------------
carregarAgenda();
