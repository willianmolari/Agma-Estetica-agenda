const API_URL = "https://script.google.com/macros/s/AKfycbwd69RxRJBWoLLIUE65Ck-CYQwB4noi6qetFgeNkiYWzcZhEszhWE3LyD6LmyfBfYOn/exec";

// ---------------- CARREGAR AGENDA ----------------
async function carregarAgenda() {
    const list = document.getElementById("agenda-list");

    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        list.innerHTML = data.length
            ? data.map(i => `
                <div class="card">
                    <p><strong>${i.data} às ${i.horario}</strong></p>
                    <p>${i.cliente} - ${i.procedimento}</p>
                </div>
            `).join('')
            : "<p>Nenhuma agenda encontrada</p>";

    } catch (err) {
        console.error("Erro ao carregar agenda:", err);
        list.innerHTML = "<p>Erro ao carregar agenda</p>";
    }
}

// ---------------- SALVAR AGENDA (SEM CORS PROBLEMÁTICO) ----------------
document.getElementById("agenda-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
        data: document.getElementById("data").value,
        horario: document.getElementById("horario").value,
        cliente: document.getElementById("cliente").value,
        procedimento: document.getElementById("procedimento").value
    };

    const params = new URLSearchParams(dados);

    try {
        await fetch(API_URL, {
            method: "POST",
            body: params
        });

        alert("Salvo com sucesso!");
        e.target.reset();
        carregarAgenda();

    } catch (err) {
        console.error("Erro ao salvar:", err);
        alert("Erro de conexão");
    }
});

// ---------------- INICIALIZA ----------------
carregarAgenda();
