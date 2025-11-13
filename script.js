// ========== ADICIONAR AO CARRINHO ==========

// Captura todos os cards de burger no cardápio
const burgers = document.querySelectorAll(".burger");

// Função pra carregar carrinho do localStorage
function carregarCarrinho() {
	let carrinho = localStorage.getItem("carrinho");
	return carrinho ? JSON.parse(carrinho) : [];
}

// Função pra salvar carrinho no localStorage
function salvarCarrinho(carrinho) {
	localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Adiciona botão “Adicionar ao carrinho” em cada burger (só no cardápio)
if (burgers.length > 0) {
	burgers.forEach((burger) => {
		const botao = document.createElement("button");
		botao.textContent = "🛒 Adicionar";
		botao.classList.add("btn-add");
		burger.querySelector(".burger-info").appendChild(botao);

		botao.addEventListener("click", () => {
			const nome = burger.querySelector("h3").textContent;
			const precoText = burger.querySelector(".preco").textContent;
			const preco = parseFloat(precoText.replace("R$", "").replace(",", "."));
			const imagem = burger.querySelector("img").src;

			let carrinho = carregarCarrinho();

			// Se o item já estiver no carrinho, só aumenta a quantidade
			const itemExistente = carrinho.find((i) => i.nome === nome);
			if (itemExistente) {
				itemExistente.quantidade += 1;
			} else {
				carrinho.push({ nome, preco, imagem, quantidade: 1 });
			}

			salvarCarrinho(carrinho);
			alert(`🍔 ${nome} adicionado ao carrinho!`);
		});
	});
}

// ========== PÁGINA DO CARRINHO ==========
const cartContainer = document.querySelector(".cart");
const resumo = document.querySelector(".summary");

if (cartContainer && resumo) {
	renderizarCarrinho();
}

function renderizarCarrinho() {
	let carrinho = carregarCarrinho();

	cartContainer.innerHTML = ""; // limpa antes de renderizar

	if (carrinho.length === 0) {
		cartContainer.innerHTML =
			"<p style='color: #999; text-align:center;'>🛒 Seu carrinho está vazio!</p>";
		atualizarResumo();
		return;
	}

	carrinho.forEach((item, index) => {
		const itemDiv = document.createElement("div");
		itemDiv.classList.add("cart-item");
		itemDiv.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" />
      <div class="item-info">
        <h3>${item.nome}</h3>
        <span>R$ ${item.preco.toFixed(2).replace(".", ",")}</span>
      </div>
      <div class="item-actions">
        <input type="number" min="1" value="${
					item.quantidade
				}" data-index="${index}" />
        <button class="remove" data-index="${index}">✖</button>
      </div>
    `;
		cartContainer.appendChild(itemDiv);
	});

	// Remover item
	document.querySelectorAll(".remove").forEach((btn) => {
		btn.addEventListener("click", (e) => {
			let carrinho = carregarCarrinho();
			const index = e.target.dataset.index;
			carrinho.splice(index, 1);
			salvarCarrinho(carrinho);
			renderizarCarrinho();
		});
	});

	// Atualizar quantidade
	document.querySelectorAll(".item-actions input").forEach((input) => {
		input.addEventListener("change", (e) => {
			let carrinho = carregarCarrinho();
			const index = e.target.dataset.index;
			let novaQtd = parseInt(e.target.value);
			if (novaQtd < 1) novaQtd = 1;
			carrinho[index].quantidade = novaQtd;
			salvarCarrinho(carrinho);
			atualizarResumo();
		});
	});

	atualizarResumo();
}

function atualizarResumo() {
	let carrinho = carregarCarrinho();
	const subtotal = carrinho.reduce(
		(total, item) => total + item.preco * item.quantidade,
		0
	);
	const entrega = carrinho.length > 0 ? 5.0 : 0;
	const total = subtotal + entrega;

	if (resumo) {
		resumo.innerHTML = `
      <h2>Resumo do Pedido</h2>
      <p>Subtotal: <span>R$ ${subtotal.toFixed(2).replace(".", ",")}</span></p>
      <p>Entrega: <span>R$ ${entrega.toFixed(2).replace(".", ",")}</span></p>
      <hr />
      <h3>Total: <span>R$ ${total.toFixed(2).replace(".", ",")}</span></h3>
      <button class="checkout">Finalizar Pedido</button>
    `;
	}

	const finalizar = document.querySelector(".checkout");
	if (finalizar) {
		finalizar.addEventListener("click", () => {
			if (carrinho.length === 0) {
				alert("🛒 Seu carrinho está vazio!");
				return;
			}
			alert(
				"🔥 Pedido finalizado com sucesso! Obrigado por escolher a Brutal Burguer!"
			);
			localStorage.removeItem("carrinho");
			renderizarCarrinho();
		});
	}
}
