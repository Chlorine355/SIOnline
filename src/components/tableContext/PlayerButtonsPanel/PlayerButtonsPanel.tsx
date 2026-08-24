import * as React from 'react';
import PassButton from '../PassButton/PassButton';
import GuaranteedAnswerButton from '../GuaranteedAnswer/GuaranteedAnswerButton';
import AnswerButton from '../AnswerButton/AnswerButton';

import './PlayerButtonsPanel.scss';

export function PlayerButtonsPanel(): JSX.Element | null {
	return (
		<div className='playerButtonsPanel'>
			<PassButton />
			<AnswerButton />
			<GuaranteedAnswerButton />
		</div>
	);
}

export default PlayerButtonsPanel;