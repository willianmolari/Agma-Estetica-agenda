// Substitua pela URL publicada do seu Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbwd69RxRJBWoLLIUE65Ck-CYQwB4noi6qetFgeNkiYWzcZhEszhWE3LyD6LmyfBfYOn/exec";


// Carregar agenda ao iniciar
async function carregarAgenda() {
  const response = await fetch(API_URL);
  const data = await response.json();

  const agendaList = document.getElementById("agenda-list");
  agendaList.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.data}</td>
      <td>${item.horario}</td>
      <td>${item.cliente}</td>
      <td>${item.procedimento}</td>
    `;
    agendaList.appendChild(row);
  });
}

// Enviar novo agendamento
document.getElementById("agenda-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoAgendamento = {
    data: document.getElementById("data").value,
    horario: document.getElementById("horario").value,
    cliente: document.getElementById("cliente").value,
    procedimento: document.getElementById("procedimento").value
  };

  // Aqui você precisa criar no Apps Script um `doPost` para receber novos dados
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(novoAgendamento),
    headers: { "Content-Type": "application/json" }
  });

  alert("Agendamento realizado com sucesso!");
  carregarAgenda();
});

// Inicializa
carregarAgenda();
