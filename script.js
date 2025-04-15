let flashcards = [];                  // armazena as resposta do usuario //
let currentCard = 0;                  // declaração de variaveis globais //
let hintsRemaining = 3;                // controla numero d e dicas //
let revealedLetters = [];              // letras reveladas no _ _ //

document.getElementById("customizeButton").addEventListener("click", () => {
    document.getElementById("titleContainer").style.display = "none"; // Esconde o título na personalização

    // Faz o menu subir
    const container = document.querySelector(".container");
    container.classList.add("move-up");

    // Esconde o botão "Personalizar Jogo"
    const customizeButton = document.getElementById("customizeButton");
    customizeButton.style.display = "none"; // Esconde o botão ao entrar na personalização.

    // Exibe o modal de personalização
    const customizeModal = document.getElementById("customizeModal");
    customizeModal.classList.add("show");
});



document.getElementById("addFlashcard").addEventListener("click", () => {
    const flashcardsDiv = document.getElementById("flashcards");

    // Criar o contêiner da categoria
    const flashcardContainer = document.createElement("div");
    flashcardContainer.className = "flashcard-container";

    // Criar o wrapper para a descrição
    const descriptionWrapper = document.createElement("div");
    descriptionWrapper.className = "input-wrapper";
    
    const descriptionInput = document.createElement("input");
    descriptionInput.setAttribute("type", "text");
    descriptionInput.setAttribute("placeholder", "Descrição");
    descriptionInput.className = "description-input";
    
    descriptionWrapper.appendChild(descriptionInput);

    // Criar o wrapper para a resposta
    const answerWrapper = document.createElement("div");
    answerWrapper.className = "input-wrapper";

    const answerInput = document.createElement("input");
    answerInput.setAttribute("type", "text");
    answerInput.setAttribute("placeholder", "Resposta");
    answerInput.className = "answer-input";

    answerWrapper.appendChild(answerInput);

    // Criar botão "X" para remover a categoria
    const removeButton = document.createElement("button");
    removeButton.className = "removeFlashcard";
    removeButton.innerText = "✖";

    // Evento para remover esta categoria específica
    removeButton.addEventListener("click", () => {
        flashcardsDiv.removeChild(flashcardContainer);
    });

    // Adicionar elementos ao contêiner da categoria
    flashcardContainer.appendChild(descriptionWrapper);
    flashcardContainer.appendChild(answerWrapper);
    flashcardContainer.appendChild(removeButton);

    flashcardsDiv.appendChild(flashcardContainer);
});

document.getElementById("startGame").addEventListener("click", () => {
    document.getElementById("titleContainer").style.display = "block"; // Mostra o título na tela do jogo
    const descriptions = document.querySelectorAll(".description-input");
    const answers = document.querySelectorAll(".answer-input");

    flashcards = [];
    let hasEmptyFields = false //variavel para verificar campos vazios

    for (let i = 0; i < descriptions.length; i++) {

        const descriptionText = descriptions[i].value.trim();
        const answerText = answers[i].value.trim();

        if (descriptionText === "" || answerText === "") {
            hasEmptyFields = true; // Se alguma caixa estiver vazia, impede o avanço
            break;
        }
        
        flashcards.push({
            description: descriptions[i].value,
            answer: answers[i].value,
        });
    }

    if (hasEmptyFields) {
        alert("Por favor, preencha todas as descrições e respostas antes de começar!"); // Alerta o usuário
    } else {
        // Esconde o modal de personalização
        document.getElementById("customizeModal").classList.add("hidden");
        document.getElementById("customizeModal").classList.remove("show");

        // Remove o botão de personalizar jogo
        document.getElementById("customizeButton").style.display = "none";

        // Inicia o jogo
        startGame();
    }
});

    if (flashcards.length > 0) {
        // Esconde o modal de personalização
        document.getElementById("customizeModal").classList.add("hidden");
        document.getElementById("customizeModal").classList.remove("show");

        // Remove o botão de personalizar jogo
        document.getElementById("customizeButton").style.display = "none";
        
        // Inicia o jogo
        startGame();
    }


document.getElementById("restartDuringGame").addEventListener("click", () => {
    location.reload(); // Recarrega a página, voltando para a configuração inicial.
});


function startGame() {
    currentCard = 0; // Reinicia o índice dos flashcards.
    resetHints(); // Reinicia as dicas.
    revealedLetters = Array(flashcards[currentCard].answer.length).fill("_"); // Reseta os traços.

    // Esconde a tela final, caso ela esteja visível
    document.getElementById("endScreen").classList.add("hidden");

    // Exibe a tela do jogo
    document.getElementById("gameScreen").classList.remove("hidden");

    loadCard(); // Carrega o primeiro flashcard.
}


function loadCard() {
    const card = flashcards[currentCard];      // Obtém o flashcard atual
    document.getElementById("gameDescription").innerText = card.description;      // Mostra a descrição
    document.getElementById("guessInput").value = "";        // Limpa o campo de entrada
    updateAnswerPlaceholder();        // Atualiza os tracinhos
    resetHints();             // Reinicia o número de dicas disponíveis
}

function resetHints() {
    hintsRemaining = 3; // Sempre começa com 3 dicas
    document.getElementById("hintButton").innerText = `Dica (3 restantes)`;
}

function updateAnswerPlaceholder() {    // mostra os traços ou letras ja revelados
    
    document.getElementById("answerPlaceholder").innerText = revealedLetters.join(" ");
}

document.getElementById("hintButton").addEventListener("click", () => {
    if (hintsRemaining > 0) {
        const answer = flashcards[currentCard].answer;
        let randomIndex;
       
        // Encontre uma posição aleatória que ainda não foi revelada
        do {
            randomIndex = Math.floor(Math.random() * answer.length);
        } while (revealedLetters[randomIndex] !== "_");
       
        // Revele a letra na posição aleatória
        revealedLetters[randomIndex] = answer[randomIndex];
        hintsRemaining--;

        // Atualiza o botão de dicas e o placeholder
        document.getElementById("hintButton").innerText = `Dica (${hintsRemaining} restantes)`;
        updateAnswerPlaceholder();
    } else {
        alert("Sem mais dicas!");
    }
});


document.getElementById("submitGuess").addEventListener("click", () => {
    const guess = document.getElementById("guessInput").value.trim();
    const correctAnswer = flashcards[currentCard].answer;

    if (guess.toLowerCase() === correctAnswer.toLowerCase()) {
        alert("Você acertou!");
        currentCard++;
        if (currentCard < flashcards.length) {
            revealedLetters = Array(flashcards[currentCard].answer.length).fill("_");
            loadCard();         // Carrega o próximo flashcard
        } else {
            endGame(true);        // Finaliza o jogo se não houver mais flashcards
        }
    } else {
        alert(`Tente novamente! A resposta correta era: ${correctAnswer}`);
    }
});

function endGame(won) {
    document.getElementById("gameScreen").classList.add("hidden");         // Esconde a tela de jogo
    document.getElementById("endScreen").classList.remove("hidden");        // Mostra a tela final
    document.getElementById("endMessage").innerText = won ? "Parabéns, você venceu!" : "Fim de Jogo!";
}

document.getElementById("playAgain").addEventListener("click", () => {
    startGame();  // Reinicia o jogo com os mesmos flashcards
});

document.getElementById("restartGame").addEventListener("click", () => {
    location.reload();
});         // Recarrega a página para começar do zero
