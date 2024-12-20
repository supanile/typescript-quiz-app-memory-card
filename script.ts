// Define interfaces for card data
interface CardData {
    question: string;
    answer: string;
}

// Define types for HTML elements
type HTMLElementOrNull = HTMLElement | null;
type HTMLTextAreaOrNull = HTMLTextAreaElement | null;

// DOM Element selections with type assertions
const showBtn = document.getElementById('show') as HTMLButtonElement;
const hiddenBtn = document.getElementById('btn-hidden') as HTMLButtonElement;
const addContainer = document.getElementById('add-container') as HTMLElementOrNull;
const cardContainer = document.getElementById('card-container') as HTMLElementOrNull;
const nextBtn = document.getElementById('next') as HTMLButtonElement;
const prevBtn = document.getElementById('prev') as HTMLButtonElement;
const currentEl = document.getElementById('current') as HTMLElementOrNull;
const clearBtn = document.getElementById('clear') as HTMLButtonElement;
const questionEl = document.getElementById('question') as HTMLTextAreaOrNull;
const answerEl = document.getElementById('answer') as HTMLTextAreaOrNull;
const addCardBtn = document.getElementById('add-card') as HTMLButtonElement;

// State variables
let currentActiveCard: number = 0;
let cardsEl: HTMLDivElement[] = [];
const cardData: CardData[] = getCardData();

function createCard(): void {
    cardData.forEach((data: CardData, index: number) => {
        createSingleCard(data, index);
    });
}

function createSingleCard(data: CardData, index: number): void {
    const card = document.createElement('div');
    card.classList.add('card');

    if (index === 0) {
        card.classList.add('active');
    }

    card.innerHTML = `
    <div class="inner-card">
        <div class="inner-card-front">
            <p>${data.question}</p>
            <i class="fas fa-sync-alt flip-icon"></i>
            <i class="fa-solid fa-trash delete-btn"></i>
        </div>
        <div class="inner-card-back">
            <p>${data.answer}</p>
            <i class="fas fa-sync-alt flip-icon"></i>
            <i class="fa-solid fa-trash delete-btn"></i>
        </div>
    </div>
    `;

    card.addEventListener('click', () => card.classList.toggle("show-answer"));

    const deleteBtns = card.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e: Event) => {
            e.stopPropagation();
            deleteCard(index);
        });
    });

    cardsEl.push(card);
    cardContainer?.appendChild(card);
    updateCurrentQuestion();
}

function deleteCard(index: number): void {
    cardData.splice(index, 1);
    setCardData(cardData);
    window.location.reload();
}

function updateCurrentQuestion(): void {
    if (currentEl) {
        currentEl.innerText = `${currentActiveCard + 1} / ${cardsEl.length}`;
    }
}

function updateCardPositions(): void {
    cardsEl.forEach((card: HTMLDivElement, index: number) => {
        card.style.transform = `translateX(${100 * (index - currentActiveCard)}%) rotateY(0deg)`;
        card.style.opacity = index === currentActiveCard ? '1' : '0';
        card.style.zIndex = index === currentActiveCard ? '10' : '0';
    });
}

nextBtn.addEventListener('click', () => {
    if (currentActiveCard < cardsEl.length - 1) {
        currentActiveCard++;
        updateCardPositions();
        updateCurrentQuestion();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentActiveCard > 0) {
        currentActiveCard--;
        updateCardPositions();
        updateCurrentQuestion();
    }
});

addCardBtn.addEventListener('click', () => {
    const question = questionEl?.value || '';
    const answer = answerEl?.value || '';

    if (question.trim() && answer.trim()) {
        const newCard: CardData = { question, answer };
        createSingleCard(newCard, cardsEl.length);

        if (questionEl) questionEl.value = '';
        if (answerEl) answerEl.value = '';
        
        if (addContainer) {
            addContainer.classList.remove('show');
        }

        cardData.push(newCard);
        setCardData(cardData);
        updateCardPositions();
        updateCurrentQuestion();
    }
});

function toggleAddContainer(): void {
    addContainer?.classList.toggle('show');
}

showBtn.addEventListener('click', toggleAddContainer);
hiddenBtn.addEventListener('click', toggleAddContainer);

function setCardData(cards: CardData[]): void {
    localStorage.setItem('cards', JSON.stringify(cards));
    window.location.reload();
}

function getCardData(): CardData[] {
    const cards = JSON.parse(localStorage.getItem('cards') || '[]');
    return cards;
}

clearBtn.addEventListener('click', () => {
    localStorage.clear();
    if (cardContainer) {
        cardContainer.innerHTML = '';
    }
    window.location.reload();
});

updateCardPositions();
createCard();
updateCardPositions();

window.addEventListener('resize', updateCardPositions);