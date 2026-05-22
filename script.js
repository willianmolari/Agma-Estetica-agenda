// URL do Apps Script (Mantenha a sua URL de execução aqui)
const API_URL = "https://script.google.com/macros/s/AKfycbwd69RxRJBWoLLIUE65Ck-CYQwB4noi6qetFgeNkiYWzcZhEszhWE3LyD6LmyfBfYOn/exec";

// ======================
// CARREGAR AGENDA (JSONP - sem CORS)
// ======================
function carregarAgenda() {
  // Remove scripts de chamadas anteriores para não poluir o HTML
  const antigoScript = document.getElementById("jsonp-script");
  if (antigoScript) antigoScript.remove();

  const script = document.createElement("script");
  script.id = "jsonp-script";
  // Adiciona um timestamp para evitar que o navegador cacheie os agendamentos antigos
  script.src = `${API_URL}?callback=handleData&_=${new Date().getTime()}`;

  document.body.appendChild(script);
}

// callback JSONP
function handleData(data) {
  const container = document.getElementById("agenda-list");
  if (!container) return;
  
  container.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = `<p class="sem-agenda">Nenhum agendamento encontrado.</p>`;
    return;
  }

  data.forEach(item => {
    // Formata a data de AAAA-MM-DD para DD/MM/AAAA na exibição (opcional, mas fica mais bonito)
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
}

// ======================
// SALVAR AGENDAMENTO (POST com modo 'no-cors')
// ======================
document.getElementById("agenda-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new URLSearchParams();
  formData.append("data", document.getElementById("data").value);
  formData.append("horario", document.getElementById("horario").value);
  formData.append("cliente", document.getElementById("cliente").value);
  formData.append("procedimento", document.getElementById("procedimento").value);

  try {
    // O Google Apps Script não aceita POST direto com leitura de resposta JSON por padrão no cliente devido ao CORS.
    // Usamos 'mode: "no-cors"'. O navegador envia os dados, o Google grava, mas não conseguimos ler o "success".
    // Por isso, se não cair no 'catch', assumimos que deu certo!
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors", // <--- CRUCIAL PARA FAZER O POST FUNCIONAR SEM TRANCAR NO CORS
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    // Como o 'no-cors' não permite ler o resultado, se o fetch foi concluído, consideramos sucesso:
    alert("Agendamento enviado com sucesso!");
    
    document.getElementById("agenda-form").reset();
    
    // Aguarda 1 segundo antes de recarregar para dar tempo do Google processar a linha
    setTimeout(carregarAgenda, 1000);

  } catch (err) {
    alert("Erro de conexão ao tentar salvar.");
    console.error(err);
  }
});

// Inicialização automatica ao abrir a página
document.addEventListener("DOMContentLoaded", carregarAgenda);
