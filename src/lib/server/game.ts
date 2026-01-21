export function generateSecretCode() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const code = [];

	for (let i = 0; i < 4; i++) {
		const randomIndex = Math.floor(Math.random() * numbers.length);
		code.push(numbers[randomIndex]);
		numbers.splice(randomIndex, 1);
	}

	return code;
}

export function calculateResult(guess: (number | null)[], secret: number[]) {
	let killed = 0;
	let injured = 0;

	const secretCopy: (number | null)[] = [...secret];
	const guessCopy = [...guess];

	// First pass: count killed (exact matches)
	for (let i = 0; i < 4; i++) {
		if (guessCopy[i] === secretCopy[i]) {
			killed++;
			secretCopy[i] = null;
			guessCopy[i] = null;
		}
	}

	// Second pass: count injured (right number, wrong position)
	for (let i = 0; i < 4; i++) {
		if (guessCopy[i] !== null) {
			const foundIndex = secretCopy.indexOf(guessCopy[i]);
			if (foundIndex !== -1) {
				injured++;
				secretCopy[foundIndex] = null;
			}
		}
	}

	return { killed, injured };
}
