const API_URL = "https://script.google.com/macros/s/AKfycbwd69RxRJBWoLLIUE65Ck-CYQwB4noi6qetFgeNkiYWzcZhEszhWE3LyD6LmyfBfYOn/exec";

async function carregarAgenda() {
    const list = document.getElementById("agenda-list");
    const res = await fetch(API_URL);
    const data = await res.json();
    list.innerHTML = data.map(i => `
        <div class="card">
            <p><strong>${i.data} às ${i.horario}</strong></p>
            <p>${i.cliente} - ${i.procedimento}</p>
        </div>`).join('');
}

document.getElementById("agenda-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = {
        data: document.getElementById("data").value,
        horario: document.getElementById("horario").value,
        cliente: document.getElementById("cliente").value,
        procedimento: document.getElementById("procedimento").value
    };

    const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(dados)
    });

    if(res.ok) {
        alert("Salvo!");
        document.getElementById("agenda-form").reset();
        carregarAgenda();
    }
});

carregarAgenda();
