// URL da sua API publicada no Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbwd69RxRJBWoLLIUE65Ck-CYQwB4noi6qetFgeNkiYWzcZhEszhWE3LyD6LmyfBfYOn/exec";

// Função para carregar a agenda da planilha
async function carregarAgenda() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const agendaList = document.getElementById("agenda-list");
    agendaList.innerHTML = "";

    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.Data}</td>
        <td>${item.Horario}</td>
        <td>${item.Cliente}</td>
        <td>${item.Procedimento}</td>
      `;
      agendaList.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao carregar agenda:", error);
    alert("Não foi possível carregar a agenda. Verifique a API.");
  }
}

// Função para enviar novo agendamento
document.getElementById("agenda-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoAgendamento = {
    data: document.getElementById("Data").value,
    horario: document.getElementById("Horario").value,
    cliente: document.getElementById("Cliente").value,
    procedimento: document.getElementById("Procedimento").value
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(novoAgendamento),
      headers: { "Content-Type": "application/json" }
    });

    const result = await response.json();

    if (result.status === "sucesso") {
      alert("Agendamento realizado com sucesso!");
      carregarAgenda();
      document.getElementById("agenda-form").reset();
    } else {
      alert("Erro ao agendar. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro ao enviar agendamento:", error);
    alert("Não foi possível enviar o agendamento. Verifique a API.");
  }
});

// Inicializa carregando a agenda
carregarAgenda();
