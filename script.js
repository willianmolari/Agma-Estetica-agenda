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
        console.error(err);
        list.innerHTML = "<p>Erro ao carregar agenda</p>";
    }
}

// ---------------- SALVAR AGENDA ----------------
document.getElementById("agenda-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
        data: document.getElementById("data").value,
        horario: document.getElementById("horario").value,
        cliente: document.getElementById("cliente").value,
        procedimento: document.getElementById("procedimento").value
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const result = await res.json();

        if (result.status === "success") {
            alert("Salvo com sucesso!");
            e.target.reset();
            carregarAgenda();
        } else {
            alert("Erro ao salvar: " + (result.message || ""));
        }

    } catch (err) {
        console.error(err);
        alert("Erro de conexão");
    }
});

// ---------------- INICIALIZA ----------------
carregarAgenda();
