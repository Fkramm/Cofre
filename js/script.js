
// CONFIGURAÇÕES

const MAX_ATTEMPTS = 7;
const MIN_NUMBER = 0;
const MAX_NUMBER = 50;

let secret = Math.floor(Math.random() * 51);

let attemptsUsed = 0;
let spinning = false;
let finished = false;

let position1 = 0;
let position2 = 0;

let digitHeight = 0;
let imageLoaded = false;

let previousGuesses = [];

// ELEMENTOS

const resultOverlay = document.getElementById("resultOverlay");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

const game = document.querySelector(".game");

const wheel1 = document.getElementById("wheel1");
const wheel2 = document.getElementById("wheel2");

const guessInput = document.getElementById("guess");

const submit = document.getElementById("submit");
const reset = document.getElementById("reset");

const status = document.getElementById("status");
const history = document.getElementById("history");
const attempts = document.getElementById("attempts");

const gearSound = document.getElementById("gearSound");

const plus = document.getElementById("plus");
const minus = document.getElementById("minus");

const wheels = [wheel1, wheel2];

// CARREGAR IMAGEM DOS NÚMEROS

const numberImage = new Image();

numberImage.onload = () => {

    const wheelWidth = wheel1.getBoundingClientRect().width;

    if (!wheelWidth) {
        status.textContent = "ERRO NO TAMANHO DAS ROLDANAS";
        return;
    }

    // Altura de cada número da imagem

    digitHeight =
        (wheelWidth * numberImage.naturalHeight /
        numberImage.naturalWidth) / 10;

    imageLoaded = true;

    // CENTRALIZAR O PRIMEIRO NÚMERO

    wheels.forEach(wheel => {

        const offset =
            (wheel.clientHeight - digitHeight) / 2;

        wheel.style.transition = "none";

        wheel.style.backgroundPositionY = offset + "px";

    });

    console.log("Imagem carregada!");
    console.log("Altura de cada número:", digitHeight);
};

numberImage.onerror = () => {

    status.textContent = "ERRO AO CARREGAR A IMAGEM DOS NÚMEROS";

    console.error("Não foi possível carregar numeros.png");

};

numberImage.src = "images/numeros.png";

// POSIÇÃO CENTRALIZADA

function getNumberOffset(wheel) {

    return (wheel.clientHeight - digitHeight) / 2;

}

// BOTÕES + E -

plus.onclick = () => {

    if (spinning || finished) return;

    guessInput.value = Math.min(
        MAX_NUMBER,
        Number(guessInput.value) + 1
    );

};

minus.onclick = () => {

    if (spinning || finished) return;

    guessInput.value = Math.max(
        MIN_NUMBER,
        Number(guessInput.value) - 1
    );

};

// TENTATIVAS VISUAIS

function renderAttempts() {

    attempts.innerHTML = "";

    for (let i = 0; i < MAX_ATTEMPTS; i++) {

        const dot = document.createElement("div");

        dot.className = "dot";

        if (i < attemptsUsed) {
            dot.classList.add("used");
        }

        attempts.appendChild(dot);
    }
}

renderAttempts();

// ANIMAÇÃO DAS ROLDANAS

function spinWheel(wheel, currentPosition, targetDigit) {

    const currentDigit = currentPosition % 10;

    const steps =
        (targetDigit - currentDigit + 10) % 10;

    const newPosition = currentPosition + steps;

    if (steps === 0) {
        return Promise.resolve(currentPosition);
    }

    const duration = 700 + steps * 140;

    // Mantém a centralização durante a animação

    const offset = getNumberOffset(wheel);

    wheel.style.transition =
        `background-position-y ${duration}ms cubic-bezier(.15,.7,.25,1)`;

    wheel.getBoundingClientRect();

    wheel.style.backgroundPositionY =
        (offset - newPosition * digitHeight) + "px";

    return new Promise(resolve => {

        setTimeout(() => {

            resolve(newPosition);

        }, duration + 50);

    });
}

// SUBMIT

submit.onclick = async () => {

    if (spinning || finished) return;

    const guess = Number(guessInput.value);

    if (
        guessInput.value.trim() === "" ||
        !Number.isInteger(guess) ||
        guess < MIN_NUMBER ||
        guess > MAX_NUMBER
    ) {

        status.textContent = "DIGITE UM NÚMERO ENTRE 00 E 50";
        return;
    }

        // IMPEDIR TENTATIVAS REPETIDAS

    if (previousGuesses.includes(guess)) {

        status.textContent = "VOCÊ JÁ TENTOU ESSE NÚMERO!";

        return;

    }

    if (!imageLoaded || !digitHeight) {

        status.textContent = "AGUARDE O CARREGAMENTO DA TRANCA";
        return;
    }

    spinning = true;

    submit.disabled = true;
    guessInput.disabled = true;
    plus.disabled = true;
    minus.disabled = true;

    status.textContent = "ENGRENAGENS EM MOVIMENTO...";

    // SEPARAR OS DÍGITOS

    const tens = Math.floor(guess / 10);
    const units = guess % 10;

    // TOCAR SOM

    const next1 = (tens - position1 % 10 + 10) % 10;
    const next2 = (units - position2 % 10 + 10) % 10;

    if ((next1 > 0 || next2 > 0) && gearSound) {

        gearSound.currentTime = 0;

        gearSound.play().catch(() => {});

    }

    // GIRAR AS DUAS ROLDANAS

    const [newPosition1, newPosition2] = await Promise.all([

        spinWheel(wheel1, position1, tens),

        spinWheel(wheel2, position2, units)

    ]);

    position1 = newPosition1;
    position2 = newPosition2;

    // PARAR SOM

    if (gearSound) {

        gearSound.pause();
        gearSound.currentTime = 0;

    }

    // REGISTRAR TENTATIVA

    previousGuesses.push(guess);

    attemptsUsed++;

    renderAttempts();

    // VERIFICAR SENHA

    if (guess === secret) {

        addHistory(guess, "CORRETO");

        status.textContent = "COFRE DESBLOQUEADO!";

        finishGame(true);

    } else {

        const hint = guess < secret ? "↑ MAIOR" : "↓ MENOR";

        addHistory(guess, hint);

        status.textContent = hint;

        if (attemptsUsed >= MAX_ATTEMPTS) {

            status.textContent =
                "VOCÊ PERDEU! SENHA: " +
                String(secret).padStart(2, "0");

            finishGame(false);

        } else {

            unlockControls();

        }
    }
};

// HISTÓRICO

function addHistory(number, result) {

    const item = document.createElement("div");

    item.className = "history-item";

    const numberText = document.createElement("strong");

    numberText.textContent =
        String(number).padStart(2, "0");

    const resultText = document.createElement("small");

    resultText.textContent = result;

    item.append(numberText, resultText);

    history.prepend(item);
}

// LIBERAR CONTROLES

function unlockControls() {

    spinning = false;

    submit.disabled = false;
    guessInput.disabled = false;
    plus.disabled = false;
    minus.disabled = false;
}

// FINALIZAR JOGO

function finishGame(won) {

    finished = true;
    spinning = false;

    submit.disabled = true;
    guessInput.disabled = true;
    plus.disabled = true;
    minus.disabled = true;

    submit.hidden = true;
    reset.hidden = false;

    resultOverlay.classList.add("show");

    if (won) {

    game.classList.add("won");

    resultTitle.textContent = "VOCÊ ACERTOU!";
    resultMessage.textContent = "COFRE DESBLOQUEADO";

    status.textContent = "";

    } else {

        game.classList.add("lost");

        resultTitle.textContent = "VOCÊ PERDEU";
        resultMessage.textContent =
            "A SENHA ERA " + String(secret).padStart(2, "0");

        status.textContent = "";

    }

}

// REINICIAR

reset.onclick = () => {

    game.classList.remove("lost", "won");

    resultOverlay.classList.remove("show");

    resultTitle.textContent = "";
    resultMessage.textContent = "";

    secret = Math.floor(Math.random() * 51);

    attemptsUsed = 0;
    previousGuesses = [];

    position1 = 0;
    position2 = 0;

    spinning = false;
    finished = false;

    // Restaurar aparência do cofre
    game.classList.remove("lost");

    // Restaurar roldanas
    wheels.forEach(wheel => {

        wheel.style.transition = "none";

        wheel.style.backgroundPositionY =
            getNumberOffset(wheel) + "px";

    });

    // Restaurar número
    guessInput.value = 0;

    // Liberar controles
    guessInput.disabled = false;
    plus.disabled = false;
    minus.disabled = false;

    // Limpar histórico
    history.innerHTML = "";

    // Restaurar botões
    submit.disabled = false;
    submit.hidden = false;
    reset.hidden = true;

    // Parar som
    if (gearSound) {

        gearSound.pause();
        gearSound.currentTime = 0;

    }

    status.textContent = "AGUARDE A RESPOSTA DO MECANISMO";

    renderAttempts();

};
