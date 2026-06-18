// 1. Recupera os dados do LocalStorage ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    const dadosSalvos = localStorage.getItem("cadastro");

    if (dadosSalvos) {
        const usuario = JSON.parse(dadosSalvos);

        // O operador '|| ""' evita que apareça a palavra "undefined" nos campos vazios
        if(document.getElementById("nome")) document.getElementById("nome").value = usuario.nome || "";
        if(document.getElementById("email")) document.getElementById("email").value = usuario.email || "";
        if(document.getElementById("telefone")) document.getElementById("telefone").value = usuario.telefone || "";
        if(document.getElementById("cep")) document.getElementById("cep").value = usuario.cep || "";
        if(document.getElementById("logradouro")) document.getElementById("logradouro").value = usuario.logradouro || "";
        if(document.getElementById("bairro")) document.getElementById("bairro").value = usuario.bairro || "";
        if(document.getElementById("cidade")) document.getElementById("cidade").value = usuario.cidade || "";
        if(document.getElementById("estado")) document.getElementById("estado").value = usuario.estado || "";
        if(document.getElementById("numero")) document.getElementById("numero").value = usuario.numero || "";
        if(document.getElementById("complemento")) document.getElementById("complemento").value = usuario.complemento || "";
    }
});

// Máscara de Telefone inteligente (Aceita Fixo com 8 dígitos e Celular com 9 dígitos)
function mascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, ""); 
    
    if (valor.length > 11) {
        valor = valor.slice(0, 11); // Limita ao máximo de caracteres de celular com DDD
    }

    if (valor.length > 6) {
        // Formato Celular: (XX) XXXXX-XXXX
        if (valor.length > 10) {
            valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
        } else {
            // Formato Fixo: (XX) XXXX-XXXX
            valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`;
        }
    } else if (valor.length > 2) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    } else if (valor.length > 0) {
        valor = `(${valor}`;
    }
    
    input.value = valor;
}

// 2. Agrupamento de Eventos e Máscara do CEP
const campoCep = document.getElementById("cep");
if (campoCep) {
    campoCep.setAttribute("maxlength", "9");
    
    campoCep.addEventListener("input", (evento) => {
        let valor = evento.target.value.replace(/\D/g, "");
        if (valor.length > 5) {
            valor = `${valor.slice(0, 5)}-${valor.slice(5, 8)}`;
        }
        evento.target.value = valor;
    });

    campoCep.addEventListener("blur", (evento) => {  
        const elemento = evento.target;
        const cepInformado = elemento.value.replace(/\D/g, "");

        if (cepInformado.length !== 8) {
            return;
        }

        fetch(`https://viacep.com.br/ws/${cepInformado}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                if(document.getElementById('logradouro')) document.getElementById('logradouro').value = data.logradouro;
                if(document.getElementById('bairro')) document.getElementById('bairro').value = data.bairro;
                if(document.getElementById('cidade')) document.getElementById('cidade').value = data.localidade;
                if(document.getElementById('estado')) document.getElementById('estado').value = data.uf; 
            } else {
                alert("CEP não encontrado.");
            }
        })
        .catch(error => console.error("Erro ao buscar o CEP:", error));
    });
}

// Função auxiliar para validar formato de e-mail básico
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// 3. EVENTO ÚNICO DE SUBMIT: Valida e Salva no LocalStorage
const formulario = document.getElementById("meuFormulario");
const notificacao = document.getElementById("notificacao-sucesso");

if (formulario) {
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        // Captura os valores atuais dos inputs
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const cep = document.getElementById("cep").value.trim();

       // Remove o hífen para validar a quantidade numérica real do CEP
        const cepNumerico = cep.replace(/\D/g, "");

        // Validação simples de campos obrigatórios antes de salvar
        if (!nome || !email || !telefone || !cep) {
            alert("Por favor, preencha todos os campos obrigatórios (Nome, E-mail, Telefone e CEP).");
            return;
        }

        // Validação do formato do e-mail
        if (!validarEmail(email)) {
            alert("Por favor, insira um e-mail válido (exemplo@dominio.com).");
            return;
        }

        // Se passar na validação, monta o objeto do usuário
        const usuario = {
            nome:        nome,
            email:       email,
            telefone:    telefone,
            cep:         cep,
            logradouro:  document.getElementById("logradouro") ? document.getElementById("logradouro").value : "",
            bairro:      document.getElementById("bairro") ? document.getElementById("bairro").value : "",
            cidade:      document.getElementById("cidade") ? document.getElementById("cidade").value : "",
            estado:      document.getElementById("estado") ? document.getElementById("estado").value : "",
            numero:      document.getElementById("numero") ? document.getElementById("numero").value : "",
            complemento: document.getElementById("complemento") ? document.getElementById("complemento").value : "",
        };

        // Grava no LocalStorage
        localStorage.setItem("cadastro", JSON.stringify(usuario));
        alert("Cadastro realizado e salvo com sucesso!");
        
        // MODIFICAÇÃO AQUI: Mostra a notificação customizada em vez do alert
        const notificacao = document.getElementById("notificacao-sucesso");
        if (notificacao) {
            notificacao.classList.add("mostrar");

            // Esconde a caixinha automaticamente após 5 segundos
            setTimeout(() => {
                notificacao.classList.remove("mostrar");
            }, 5000);
        }

        // Reseta todos os campos visualmente após o salvamento
        formulario.reset();
    });
}