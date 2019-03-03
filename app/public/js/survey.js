'use strict';

$(document).ready(() => {
	// Populate list of questions
	const questionList = [
		'Your mind is always buzzing with unexplored ideas and plans.',
		'Generally speaking, you rely more on your experience than your imagination.',
		'You find it easy to stay relaxed and focused even when there is some pressure.',
		'You rarely do something just out of sheer curiosity.',
		'People can rarely upset you.',
		'It is often difficult for you to relate to other people’s feelings.',
		'In a discussion, truth should be more important than people’s sensitivities.',
		'You rarely get carried away by fantasies and ideas.',
		'You think that everyone’s views should be respected regardless of whether they are supported by facts or not.',
		'You feel more energetic after spending time with a group of people.',
	];

	// Declare some Global vars
	let userName;
	let userPhotoURL;
	let totalQuestions = questionList.length;
	let currentQuestionIndx = -1;
	let userQAList = [];
	let userAnswers = [];
	let progressVal;

	// Begin submit event handler
	$('#formBegin').submit((event) => {
		event.preventDefault();

		userName = $('#inputName')
			.val()
			.trim();
		userPhotoURL = $('#inputPhotoURL')
			.val()
			.trim();

		$('form').trigger('reset');

		$('#formBasic').toggle('slow');
		$('#formDetail').toggle('slow');

		callBegin();
	});

	// Option click event handler
	$('input[name=radio]').change((event) => {
		event.preventDefault();
		if (!$('#alertMsg').hasClass('hidden')) {
			$('#alertMsg').addClass('hidden');
		}
	});

	// Previous btn event handler
	$('#btnPrevious').click((event) => {
		event.preventDefault();

		if (!$('#alertMsg').hasClass('hidden')) {
			$('#alertMsg').addClass('hidden');
		}

		let currentUserAnswerChoise = parseInt(
			$('input[name=radio]:checked', '#formQuestionnaire').val(),
		);

		if (isNaN(currentUserAnswerChoise)) {
			previousBTNRoutine();
		} else {
			populateUserAnswer(currentUserAnswerChoise).then((res) => {
				previousBTNRoutine();
			});
		}
	});

	// Next btn event handler
	$('#btnNext').click((event) => {
		event.preventDefault();

		let currentUserAnswerChoise = parseInt(
			$('input[name=radio]:checked', '#formQuestionnaire').val(),
		);

		if (isNaN(currentUserAnswerChoise)) {
			$('#alertMsg').removeClass('hidden');
		} else {
			if (!$('#alertMsg').hasClass('hidden')) {
				$('#alertMsg').addClass('hidden');
			}
			populateUserAnswer(currentUserAnswerChoise).then((res) => {
				updateProgress(res);
				nextBTNRoutine();
			});
		}
	});

	// Submit btn event handler
	$('#formQuestionnaire').submit((event) => {
		event.preventDefault();
		let currentUserAnswerChoise = parseInt(
			$('input[name=radio]:checked', '#formQuestionnaire').val(),
		);

		if (isNaN(currentUserAnswerChoise)) {
			$('#alertMsg').removeClass('hidden');
		} else {
			if (!$('#alertMsg').hasClass('hidden')) {
				$('#alertMsg').addClass('hidden');
			}
			$('#formDetail').toggle('slow');
			populateUserAnswer(currentUserAnswerChoise).then((res) => {
				updateProgress(res);
				submitBTNRoutine().then((res) => {
					$.post('/api/survey', res, (res) => {
						let friendId = res.id;
						$.get(`/api/survey/${friendId}`, (res) => {
							let friendName = res.data.name;
							let friendPhoto = res.data.photo;
							$('#myMatch .modal-body').html(`<div class="text-center">
									<img src="${friendPhoto}" class="rounded" alt="...">
									<h3>${friendName}</h3>
								</div>`);
						});
					});
				});
			});
		}
	});

	// Modal close event handler
	$('#myMatch').on('hidden.bs.modal', (event) => {
		event.preventDefault();
		document.location.href = '/';
	});

	// fx to update currentQuestionIndx val
	const updateCurrentQuestionIndx = (action) => {
		if (action === 'increase') {
			currentQuestionIndx += 1;
		} else if (action === 'decrease') {
			currentQuestionIndx -= 1;
		}
	};

	// fx to show or hide previous btn
	const showHidePreviousButton = () => {
		if (currentQuestionIndx === 0) {
			if (!$('#btnPrevious').hasClass('hidden')) {
				$('#btnPrevious').addClass('hidden');
			}
		} else {
			$('#btnPrevious').removeClass('hidden');
		}
	};

	// fx to show or hide next btn
	const showHideNextButton = () => {
		if (currentQuestionIndx === questionList.length - 1) {
			if (!$('#btnNext').hasClass('hidden')) {
				$('#btnNext').addClass('hidden');
			}
		} else {
			$('#btnNext').removeClass('hidden');
		}
	};

	// fx to show or hide submit  btn
	const showhideSubmitButton = () => {
		if (currentQuestionIndx === questionList.length - 1) {
			$('#btnSubmit').removeClass('hidden');
		} else {
			if (!$('#btnSubmit').hasClass('hidden')) {
				$('#btnSubmit').addClass('hidden');
			}
		}
	};

	// a grouped fx to call show/hide fxs
	const callShowHide = () => {
		showHidePreviousButton();
		showHideNextButton();
		showhideSubmitButton();
	};

	// fx to perform tasks when Begin btn ic clicked
	const callBegin = () => {
		updateCurrentQuestionIndx('increase');
		callShowHide();
		$('#question').text(questionList[currentQuestionIndx]);
	};

	// fx to check if Q&A is already answered
	const checkQA = () => {
		if (!userQAList.length) {
			return null;
		} else {
			let result = userQAList.filter(
				(question) => question.question === currentQuestionIndx,
			);

			if (!result.length) {
				return null;
			} else {
				return result[0].answer;
			}
		}
	};

	// fx to populate answer array
	const populateUserAnswer = async (answer) => {
		userQAList = await userQAList.filter(
			(item) => item.question !== currentQuestionIndx,
		);

		await userQAList.push({
			question: currentQuestionIndx,
			answer: answer,
		});

		return userQAList.length;
	};

	// fx to update progress bar
	const updateProgress = (totalAnswered) => {
		progressVal = (totalAnswered / totalQuestions) * 100;
		$('.progress-bar')
			.attr('aria-valuenow', progressVal)
			.css('width', `${progressVal}%`);
	};

	// fx to perform tasks when Previous btn ic clicked
	const previousBTNRoutine = () => {
		updateCurrentQuestionIndx('decrease');
		callShowHide();
		$('#question').text(questionList[currentQuestionIndx]);
		let userAnswerChoice = checkQA();
		$(`#radio${userAnswerChoice}`).prop('checked', true);
		$('#btnPrevious').blur();
	};

	// fx to perform tasks when Next btn ic clicked
	const nextBTNRoutine = () => {
		updateCurrentQuestionIndx('increase');
		callShowHide();
		$('#question').text(questionList[currentQuestionIndx]);
		let userAnswerChoice = checkQA();
		if (userAnswerChoice !== null) {
			$('input[name=radio]').prop('checked', false);
			$(`#radio${userAnswerChoice}`).prop('checked', true);
		} else {
			$('input[name=radio]').prop('checked', false);
		}
		$('#btnNext').blur();
	};

	// fx to sort data
	const compareValues = (key, order = 'asc') => {
		return (a, b) => {
			if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
				return 0;
			}

			const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
			const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

			let comparison = 0;
			if (varA > varB) {
				comparison = 1;
			} else if (varA < varB) {
				comparison = -1;
			}
			return order == 'desc' ? comparison * -1 : comparison;
		};
	};

	// fx to perform tasks when Submit btn ic clicked
	const submitBTNRoutine = async () => {
		userQAList = await userQAList.sort(compareValues('question'));
		userAnswers = await userQAList.map((a) => a.answer);

		let data = {
			name: userName,
			photo: userPhotoURL,
			scores: userAnswers,
		};
		return data;
	};
});
