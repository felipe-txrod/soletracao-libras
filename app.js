(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const letras = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  const TEMAS = Object.keys(CATEGORIAS);
  const estado = {
    modo: "desafio", tema: "Geral", atual: null, quadros: [], posicao: 0,
    visivel: false, concluido: false, tocando: false, pausado: false,
    timer: null, sacos: {}, ultimo: {}, respostaMostrada: false
  };

  function normalizar(texto) {
    return String(texto).normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase().replace(/[-–—]/g, " ")
      .replace(/[^A-Z ]/g, "")
      .replace(/\s+/g, " ").trim();
  }

  function comparavel(texto) {
    return normalizar(texto).replace(/ /g, "");
  }

  function criarQuadros(texto) {
    const textoNormal = normalizar(texto);
    const quadros = [];
    for (let i = 0; i < textoNormal.length; i++) {
      if (textoNormal[i] !== " ") {
        quadros.push({ letra: textoNormal[i], pausa: textoNormal[i + 1] === " " });
      }
    }
    return quadros;
  }

  function embaralhar(itens) {
    const copiado = [...itens];
    for (let i = copiado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copiado[i], copiado[j]] = [copiado[j], copiado[i]];
    }
    return copiado;
  }

  function limparTemporizador() {
    if (estado.timer !== null) clearTimeout(estado.timer);
    estado.timer = null;
    estado.tocando = false;
  }

  function atualizarBotaoReproducao() {
    $("reproduzir").setAttribute("aria-pressed", String(estado.tocando));
    $("reproduzir").textContent = estado.tocando ? "Pausar" : (estado.pausado ? "Continuar" : "Reproduzir");
  }

  function atualizarContador() {
    const restante = estado.sacos[estado.tema]?.length ?? CATEGORIAS[estado.tema].length;
    $("contador").textContent = `${restante} ${restante === 1 ? "palavra restante" : "palavras restantes"} neste tema`;
  }

  function atualizarProgresso() {
    const destino = $("progresso");
    destino.replaceChildren();
    estado.quadros.forEach((_, indice) => {
      const trecho = document.createElement("span");
      if (estado.concluido || indice < estado.posicao) trecho.className = "is-complete";
      else if (estado.visivel && indice === estado.posicao) trecho.className = "is-current";
      destino.appendChild(trecho);
    });
  }

  function limparImagem() {
    $("imagem-letra").hidden = true;
    $("imagem-letra").removeAttribute("src");
    $("letras-placeholder").hidden = false;
    $("rotulo-letra").hidden = true;
    estado.visivel = false;
  }

  function mostrarQuadro(indice) {
    if (indice >= estado.quadros.length) {
      finalizar();
      return;
    }
    estado.posicao = indice;
    estado.visivel = true;
    estado.concluido = false;
    const letra = estado.quadros[indice].letra;
    $("imagem-letra").src = `imagens/${letra}.jpg`;
    $("imagem-letra").alt = estado.modo === "livre" ? `Letra ${letra} do alfabeto manual de Libras` : "Letra do alfabeto manual de Libras";
    $("imagem-letra").hidden = false;
    $("letras-placeholder").hidden = true;
    $("rotulo-letra").hidden = estado.modo !== "livre";
    $("rotulo-letra").textContent = letra;
    $("status-reproducao").textContent = `Letra ${indice + 1} de ${estado.quadros.length}`;
    atualizarProgresso();
  }

  function finalizar() {
    limparTemporizador();
    estado.posicao = estado.quadros.length;
    estado.concluido = true;
    estado.pausado = false;
    $("status-reproducao").textContent = "Fim da sequência. Você pode repetir para ver de novo.";
    atualizarBotaoReproducao();
    atualizarProgresso();
  }

  function tocarQuadro() {
    if (!estado.tocando) return;
    if (estado.posicao >= estado.quadros.length) return finalizar();
    mostrarQuadro(estado.posicao);
    const quadro = estado.quadros[estado.posicao];
    const fator = Number($("velocidade").value) || 1;
    const duracao = Math.round((1100 + (quadro.pausa ? 450 : 0)) / fator);
    estado.timer = setTimeout(() => {
      if (!estado.tocando) return;
      estado.posicao++;
      tocarQuadro();
    }, duracao);
  }

  function reproduzir() {
    if (!estado.atual) return;
    if (estado.tocando) {
      limparTemporizador();
      estado.pausado = true;
      $("status-reproducao").textContent = "Pausado. Clique em Continuar para seguir.";
      atualizarBotaoReproducao();
      return;
    }
    if (estado.concluido) {
      estado.posicao = 0;
      estado.concluido = false;
    }
    estado.pausado = false;
    estado.tocando = true;
    atualizarBotaoReproducao();
    tocarQuadro();
  }

  function repetir() {
    if (!estado.atual) return;
    limparTemporizador();
    estado.concluido = false;
    estado.pausado = false;
    estado.posicao = 0;
    estado.tocando = true;
    atualizarBotaoReproducao();
    tocarQuadro();
  }

  function proximaLetra() {
    if (!estado.atual) return;
    limparTemporizador();
    estado.pausado = false;
    atualizarBotaoReproducao();
    if (estado.concluido) {
      estado.concluido = false;
      estado.posicao = 0;
      estado.visivel = false;
    }
    mostrarQuadro(estado.posicao + (estado.visivel ? 1 : 0));
  }

  function exibirDefinicao(apenasDica = false) {
    if (!estado.atual) return;
    const definicao = estado.atual.definicao;
    $("area-definicao").hidden = false;
    $("titulo-definicao").textContent = apenasDica ? "DICA: SIGNIFICADO" : "PALAVRA E SIGNIFICADO";
    $("palavra-definicao").hidden = apenasDica;
    $("palavra-definicao").textContent = estado.atual.palavra;
    $("texto-definicao").textContent = definicao || "Esta palavra não está no catálogo de termos do site.";
  }

  function encerrarResposta(correta) {
    if (!estado.atual) return;
    estado.respostaMostrada = true;
    $("retorno").className = correta ? "feedback is-correct" : "feedback";
    $("retorno").textContent = correta ? "Acertou!" : "Esta era a resposta:";
    exibirDefinicao();
    $("dica").disabled = true;
  }

  function conferir() {
    if (!estado.atual) return;
    const tentativa = $("palpite").value.trim();
    if (!comparavel(tentativa)) {
      $("retorno").textContent = "Digite uma palavra para conferir.";
      return;
    }
    if (comparavel(tentativa) === comparavel(estado.atual.palavra)) {
      encerrarResposta(true);
      return;
    }
    $("retorno").className = "feedback is-incorrect";
    $("retorno").textContent = "Ainda não. Tente outra vez ou repita a sequência.";
  }

  function prepararPalavra(item) {
    limparTemporizador();
    estado.atual = item;
    estado.quadros = criarQuadros(item.palavra);
    estado.posicao = 0;
    estado.concluido = false;
    estado.pausado = false;
    estado.respostaMostrada = false;
    limparImagem();
    $("area-definicao").hidden = true;
    $("palpite").value = "";
    $("retorno").textContent = "";
    $("retorno").className = "feedback";
    $("status-reproducao").textContent = `${estado.quadros.length} letras · pronto para reproduzir`;
    $("titulo-exercicio").textContent = estado.modo === "desafio" ? "Descubra a palavra" : item.palavra;
    $("tipo-exercicio").textContent = estado.modo === "desafio" ? "DESAFIO" : "SOLETRAÇÃO LIVRE";
    for (const id of ["reproduzir", "repetir", "proxima"]) $(id).disabled = false;
    for (const id of ["palpite", "conferir", "dica", "revelar"]) $(id).disabled = estado.modo !== "desafio";
    atualizarBotaoReproducao();
    atualizarProgresso();
    if (estado.modo === "livre" && item.definicao) exibirDefinicao();
  }

  function sortear() {
    const tema = estado.tema;
    if (!estado.sacos[tema] || !estado.sacos[tema].length) {
      estado.sacos[tema] = embaralhar(CATEGORIAS[tema]);
      // Evita repetir a última palavra do ciclo anterior logo no primeiro sorteio novo.
      if (estado.sacos[tema].length > 1 && estado.sacos[tema].at(-1).palavra === estado.ultimo[tema]) {
        [estado.sacos[tema][0], estado.sacos[tema][estado.sacos[tema].length - 1]] =
          [estado.sacos[tema].at(-1), estado.sacos[tema][0]];
      }
    }
    const proxima = estado.sacos[tema].pop();
    estado.ultimo[tema] = proxima.palavra;
    prepararPalavra(proxima);
    atualizarContador();
    scrollToExercise();
    reproduzir();
  }

  function limparExercicio() {
    limparTemporizador();
    estado.atual = null;
    estado.quadros = [];
    estado.posicao = 0;
    estado.pausado = false;
    estado.concluido = false;
    estado.respostaMostrada = false;
    limparImagem();
    $("titulo-exercicio").textContent = estado.modo === "desafio" ? "Sorteie uma palavra para começar" : "Escreva uma palavra para começar";
    $("tipo-exercicio").textContent = estado.modo === "desafio" ? "DESAFIO" : "SOLETRAÇÃO LIVRE";
    $("status-reproducao").textContent = estado.modo === "desafio" ? "Sorteie uma palavra e acompanhe as imagens." : "Digite uma palavra para ver as letras.";
    $("palpite").value = "";
    $("retorno").textContent = "";
    $("retorno").className = "feedback";
    $("area-definicao").hidden = true;
    for (const id of ["reproduzir", "repetir", "proxima", "palpite", "conferir", "dica", "revelar"]) $(id).disabled = true;
    atualizarBotaoReproducao();
    atualizarProgresso();
  }

  function escolherTema(tema) {
    estado.tema = tema;
    $("tag-tema").textContent = tema;
    for (const botao of $("categorias").querySelectorAll("button")) {
      botao.setAttribute("aria-pressed", String(botao.dataset.tema === tema));
    }
    atualizarContador();
    if (estado.modo === "desafio") limparExercicio();
  }

  function escolherModo(modo) {
    estado.modo = modo;
    for (const nome of ["desafio", "livre"]) {
      const selecionado = nome === modo;
      $("tab-" + nome).classList.toggle("is-active", selecionado);
      $("tab-" + nome).setAttribute("aria-selected", String(selecionado));
      $("tab-" + nome).tabIndex = selecionado ? 0 : -1;
      $("opcoes-" + nome).hidden = !selecionado;
    }
    $("area-resposta").hidden = modo !== "desafio";
    $("tag-tema").textContent = modo === "desafio" ? estado.tema : "Modo livre";
    limparExercicio();
  }

  function mostrarLivre() {
    const valor = $("texto-livre").value.trim();
    const normalizada = normalizar(valor);
    if (!normalizada) {
      $("status-reproducao").textContent = "Digite uma palavra usando letras de A a Z.";
      $("texto-livre").focus();
      return;
    }
    const encontrado = Object.values(CATEGORIAS).flat().find(item => comparavel(item.palavra) === comparavel(valor));
    prepararPalavra({ palavra: valor, definicao: encontrado?.definicao ?? "" });
    scrollToExercise();
    reproduzir();
  }

  function montarCategorias() {
    const caixa = $("categorias");
    TEMAS.forEach(tema => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "topic-button";
      botao.dataset.tema = tema;
      botao.setAttribute("aria-pressed", String(tema === estado.tema));
      const nome = document.createElement("span");
      nome.textContent = tema;
      const quantidade = document.createElement("small");
      quantidade.textContent = CATEGORIAS[tema].length;
      botao.append(nome, quantidade);
      botao.addEventListener("click", () => escolherTema(tema));
      caixa.appendChild(botao);
    });
  }

  function montarAlfabeto() {
    const caixa = $("grade-alfabeto");
    for (const letra of letras) {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "letter-tile";
      botao.title = "Mostrar letra " + letra;
      const img = document.createElement("img");
      img.src = `imagens/${letra}.jpg`;
      img.alt = "Configuração da letra " + letra;
      img.loading = "lazy";
      const texto = document.createElement("span");
      texto.textContent = letra;
      botao.append(img, texto);
      botao.addEventListener("click", () => {
        escolherModo("livre");
        $("texto-livre").value = letra;
        mostrarLivre();
        scrollToExercise(true);
      });
      caixa.appendChild(botao);
    }
  }

  $("tab-desafio").addEventListener("click", () => escolherModo("desafio"));
  $("tab-livre").addEventListener("click", () => escolherModo("livre"));
  $("sortear").addEventListener("click", sortear);
  $("mostrar").addEventListener("click", mostrarLivre);
  $("texto-livre").addEventListener("keydown", evento => { if (evento.key === "Enter") mostrarLivre(); });
  $("reproduzir").addEventListener("click", reproduzir);
  $("repetir").addEventListener("click", repetir);
  $("proxima").addEventListener("click", proximaLetra);
  $("conferir").addEventListener("click", conferir);
  $("palpite").addEventListener("keydown", evento => { if (evento.key === "Enter") conferir(); });
  $("dica").addEventListener("click", () => {
    exibirDefinicao(true);
    $("dica").disabled = true;
  });
  $("revelar").addEventListener("click", () => encerrarResposta(false));

  function scrollToExercise(force = false) {
    if (typeof window.matchMedia !== "function") return;
    if (!force && !window.matchMedia("(max-width: 800px)").matches) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $("practice-player").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  function initializeTabNavigation() {
    const tabs = [$("tab-desafio"), $("tab-livre")];
    tabs.forEach((tab, index) => {
      tab.addEventListener("keydown", event => {
        let nextIndex;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[nextIndex].click();
        tabs[nextIndex].focus();
      });
    });
  }

  document.querySelectorAll('a[href="#alfabeto"]').forEach(link => {
    link.addEventListener("click", () => { $("alfabeto").open = true; });
  });

  initializeTabNavigation();
  montarCategorias();
  montarAlfabeto();
  escolherModo("desafio");
  atualizarContador();
})();
