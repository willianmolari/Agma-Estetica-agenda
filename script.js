
// URL do Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbwd69RxRJBWoLLIUE65Ck-CYQwB4noi6qetFgeNkiYWzcZhEszhWE3LyD6LmyfBfYOn/exec";


// ======================
// CARREGAR AGENDA (JSONP - sem CORS)
// ======================
function carregarAgenda() {

  const script = document.createElement("script");

  script.src = API_URL + "?callback=handleData";

  document.body.appendChild(script);

}


// callback JSONP
function handleData(data) {

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

}


// ======================
// SALVAR AGENDAMENTO (POST simples)
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

    const result = await res.json();

    if (result.status === "success") {

      alert("Agendado com sucesso!");

      document.getElementById("agenda-form").reset();

      carregarAgenda();

    } else {

      alert("Erro ao salvar");

    }

  } catch (err) {

    alert("Erro de conexão");
    console.error(err);

  }

});


// init
carregarAgenda();
