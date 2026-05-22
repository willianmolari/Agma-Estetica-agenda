const API_URL = "https://script.google.com/macros/s/AKfycbwd69RxRJBWoLLIUE65Ck-CYQwB4noi6qetFgeNkiYWzcZhEszhWE3LyD6LmyfBfYOn/exec";

// ======================
// CARREGAR AGENDA (FETCH SEM CORS)
// ======================
async function carregarAgenda() {
  const container = document.getElementById("agenda-list");
  if (!container) return;

  try {
    // Fazemos um fetch normal. O "redirect: 'follow'" é o segredo para o Apps Script
    const response = await fetch(API_URL, {
      method: "GET",
      redirect: "follow" 
    });

    if (!response.ok) throw new Error("Erro ao buscar dados");

    const data = await response.json();
    container.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `<p class="sem-agenda">Nenhum agendamento encontrado.</p>`;
      return;
    }

    data.forEach(item => {
      let dataFormatada = item.data;
      if (item.data && item.data.includes("-")) {
        const parts = item.data.split("-");
        dataFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }

      const div = document.createElement("div");
      div.className = "agenda-item";
      div.innerHTML = `
        <strong>${item.cliente || "Cliente Sem Nome"}</strong>
        <div class="agenda-meta">
          📅 ${dataFormatada || ""} • ⏰ ${item.horario || ""}
        </div>
        <div class="agenda-meta">
          💆 ${item.procedimento || ""}
        </div>
      `;
      container.appendChild(div);
    });

  } catch (err) {
    console.error("Erro ao carregar agenda:", err);
    container.innerHTML = `<p class="erro">Não foi possível carregar a agenda automaticamente.</p>`;
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
    // POST com no-cors envia os dados com sucesso, mas oculta a resposta do servidor do JS.
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    // Como o modo no-cors não permite ler a resposta do Google, assumimos sucesso se não houver erro de rede
    alert("Agendamento enviado com sucesso!");
    
    document.getElementById("agenda-form").reset();
    
    // Dá 1.2 segundos para a planilha processar antes de atualizar a lista na tela
    setTimeout(carregarAgenda, 1200);

  } catch (err) {
    alert("Erro de conexão ao tentar salvar.");
    console.error(err);
  }
});

// Inicialização
document.addEventListener("DOMContentLoaded", carregarAgenda);
