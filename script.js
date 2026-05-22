
const API_URL = "https://script.google.com/macros/s/AKfycbwd69RxRJBWoLLIUE65Ck-CYQwB4noi6qetFgeNkiYWzcZhEszhWE3LyD6LmyfBfYOn/exec";


// ======================
// CARREGAR AGENDA
// ======================
async function carregarAgenda() {

  try {

    const res = await fetch(API_URL);

    if (!res.ok) throw new Error("Erro na API");

    const data = await res.json();

    const container = document.getElementById("agenda-list");

    container.innerHTML = "";

    if (!Array.isArray(data)) return;

    data.forEach(item => {

      const div = document.createElement("div");
      div.className = "agenda-item";

      div.innerHTML = `
        <strong>${item.cliente || ""}</strong>
        <div class="agenda-meta">
          📅 ${item.data || ""} • ⏰ ${item.horario || ""}
        </div>
        <div class="agenda-meta">
          💆 ${item.procedimento || ""}
        </div>
      `;

      container.appendChild(div);

    });

  } catch (err) {

    console.error("Erro GET:", err);

    document.getElementById("agenda-list").innerHTML =
      "<p>Erro ao carregar agenda.</p>";

  }

}


// ======================
// SALVAR AGENDAMENTO
// ======================
document.getElementById("agenda-form").addEventListener("submit", async (e) => {

  e.preventDefault();

  const formData = new URLSearchParams();

  formData.append("data", document.getElementById("data").value);
  formData.append("horario", document.getElementById("horario").value);
  formData.append("cliente", document.getElementById("cliente").value);
  formData.append("procedimento", document.getElementById("procedimento").value);

  try {

    const res = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Erro POST");

    const text = await res.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Resposta inválida da API");
    }

    if (result.status === "success") {

      alert("Agendado com sucesso!");

      document.getElementById("agenda-form").reset();

      carregarAgenda();

    } else {

      alert("Erro ao salvar");

    }

  } catch (err) {

    console.error("Erro POST:", err);

    alert("Erro ao salvar agendamento");

  }

});


// init
carregarAgenda();
