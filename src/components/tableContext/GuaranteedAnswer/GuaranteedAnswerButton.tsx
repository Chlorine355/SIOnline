import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import PlayerStates from '../../../model/enums/PlayerStates';
import { pressGameButton } from '../../../state/room2Slice';

import './../AnswerButton/AnswerButton.scss';

export default function GuaranteedAnswerButton() {
	const isConnected = useAppSelector((state) => state.common.isSIHostConnected);
	const name = useAppSelector((state) => state.room2.name);
	const persons = useAppSelector((state) => state.room2.persons);
	const isGameButtonEnabled = useAppSelector((state) => state.room2.isGameButtonEnabled);
	const table = useAppSelector((state) => state.table);
	const { canPress, content } = table;

	const appDispatch = useAppDispatch();
	const me = persons.players.find(p => p.name === name);
	const canAnswer = me && (me.state === PlayerStates.None || me.state === PlayerStates.Lost);
	// component kills itself so no need to reset
	const [haveAnswerBeforeFs, setHaveAnswerBeforeFs] = React.useState(false);
	const [haveAnswerForNextSlide, setHaveAnswerForNextSlide] = React.useState(false);

	React.useEffect(() => {
		if (canPress && haveAnswerBeforeFs) {
			console.log('Boom!');
			appDispatch(pressGameButton());
		}
	}, [
		canPress, haveAnswerBeforeFs
	]);

	React.useEffect(() => {
		if (canPress && haveAnswerForNextSlide) {
			console.log('Boom for slide!');
			appDispatch(pressGameButton());
		}
	}, [
		content?.[0]?.content?.[0]?.value // if content changes
	]);

	return (
		<>
			<button
				type='button'
				className={`cheat playerButton mainAction active ${canAnswer ? '' : ' hidden'} ${canPress ? ' can-press' : ''}`}
				disabled={!isConnected || !isGameButtonEnabled || !canAnswer}
				onClick={() => setHaveAnswerBeforeFs(!haveAnswerBeforeFs)}>
				ОТВЕТИТЬ СРАЗУ {haveAnswerBeforeFs ? '☑️' : ''}
			</button>
			<button
				type='button'
				className={`cheat playerButton mainAction active ${canAnswer ? '' : ' hidden'} ${canPress ? ' can-press' : ''}`}
				disabled={!isConnected || !isGameButtonEnabled || !canAnswer}
				onClick={() => setHaveAnswerForNextSlide(!haveAnswerForNextSlide)}>
				ОТВЕТИТЬ СЛ. СЛАЙД {haveAnswerForNextSlide ? '☑️' : ''}
			</button>
		</>

	);
}
