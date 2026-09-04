import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import State from '../../../state/State';
import roomActionCreators from '../../../state/room/roomActionCreators';
import PlayerInfo from '../../../model/PlayerInfo';
import Persons from '../../../model/Persons';
import getAvatarClass from '../../../utils/AccountHelpers';
import PlayerView from '../PlayerView/PlayerView';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { playerSelected } from '../../../state/room2Slice';

import './PlayersView.scss';

interface PlayersViewProps {
	players: PlayerInfo[];
	all: Persons;
	avatar: string | null;
	avatarKey: string | null;
	isVisible: boolean;

	onSumChanged: (playerIndex: number, sum: number) => void;
}

const mapStateToProps = (state: State) => ({
	players: state.room2.persons.players,
	all: state.room2.persons.all,
	avatar: state.user.avatar,
	avatarKey: state.settings.avatarKey,
	isVisible: state.ui.showPlayers,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
	onSumChanged: (playerIndex: number, sum: number) => {
		dispatch(roomActionCreators.changePlayerSum(playerIndex, sum) as object as Action);
	},
});

const PlayersView: React.FC<PlayersViewProps> = (props) => {
	const appDispatch = useAppDispatch();
	const name = useAppSelector(state => state.room2.name);
	const listRef = React.useRef<HTMLUListElement>(null);

	const onPlayerSelected = (index: number) => {
		appDispatch(playerSelected(index));
	};

	const [isSorted, setIsSorted] = React.useState(false);
	const [isExpanded, setIsExpanded] = React.useState(false);
	const [isHideNominals, setIsHideNominals] = React.useState(false);


	const isLarge = props.players.length > 6;

	const renderPlayer = (player: PlayerInfo, index: number): JSX.Element => {
		const account = props.all[player.name];
		const isMe = player.name === name;
		const avatar = isMe && props.avatar ? props.avatar : account?.avatar;

		const avatarClass = getAvatarClass(account);

		return <PlayerView
			key={`${player.name}_${index}`}
			listRef={listRef}
			player={player}
			account={account}
			isMe={isMe}
			avatar={avatar}
			avatarKey={props.avatarKey}
			sex={account?.sex}
			avatarVideo={account?.avatarVideo}
			avatarClass={avatarClass}
			index={index}
			isMuted={player.isMuted}
			hideNominals={isMe ? false : isHideNominals}
			onPlayerSelected={() => onPlayerSelected(index)}
			onSumChanged={(sum) => props.onSumChanged(index, sum)} />;
	};

	return !props.isVisible ? null : (
		<div className={`playersPanel ${isLarge ? 'large' : ''}`}>
			<ul className="gamePlayers" ref={listRef}>
				{isExpanded ? <div className="settings">
					<button onClick={() => setIsExpanded(false)}>{'<<'}</button>
					<label>
						<span>Сортировка</span>
						<input type='checkbox' checked={isSorted} onClick={() => setIsSorted(!isSorted)} />
					</label>
					<label>
						<span>Без номиналов</span>
						<input type='checkbox' checked={isHideNominals} onClick={() => setIsHideNominals(!isHideNominals)} />
					</label>
				</div> : <button onClick={() => setIsExpanded(true)}>{'>>'}</button>}
				{isSorted
					? props.players.toSorted((a: PlayerInfo, b: PlayerInfo) => b.sum - a.sum).map(renderPlayer)
					: props.players.map(renderPlayer)}
			</ul>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayersView);
