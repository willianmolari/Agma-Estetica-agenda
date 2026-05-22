// URL da sua API publicada no Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbwd69RxRJBWoLLIUE65Ck-CYQwB4noi6qetFgeNkiYWzcZhEszhWE3LyD6LmyfBfYOn/exec";


// =========================
// CARREGAR AGENDA
// =========================
async function carregarAgenda() {

  try {

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Erro HTTP: " + response.status);
    }

    const data = await response.json();

    const agendaList = document.getElementById("agenda-list");

    agendaList.innerHTML = "";

    // Verifica se veio array
    if (!Array.isArray(data)) {
      throw new Error("API retornou formato inválido");
    }

    data.forEach(item => {

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.data || ""}</td>
        <td>${item.horario || ""}</td>
        <td>${item.cliente || ""}</td>
        <td>${item.procedimento || ""}</td>
      `;

      agendaList.appendChild(row);

    });

  } catch (error) {

    console.error("Erro ao carregar agenda:", error);

    alert("Erro ao carregar agenda.");

  }

}


// =========================
// ENVIAR AGENDAMENTO
// =========================
document
  .getElementById("agenda-form")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

    const novoAgendamento = {

      data: document.getElementById("data").value,

      horario: document.getElementById("horario").value,

      cliente: document.getElementById("cliente").value,

      procedimento: document.getElementById("procedimento").value

    };

    try {

      const response = await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(novoAgendamento)

      });

      if (!response.ok) {
        throw new Error("Erro HTTP: " + response.status);
      }

      const result = await response.json();

      if (result.status === "sucesso") {

        alert("Agendamento realizado!");

        document
          .getElementById("agenda-form")
          .reset();

        carregarAgenda();

      } else {

        alert("Erro ao salvar.");

      }

    } catch (error) {

      console.error("Erro ao enviar:", error);

      alert("Erro ao enviar agendamento.");

    }

  });


// =========================
// INICIAR
// =========================
carregarAgenda();
