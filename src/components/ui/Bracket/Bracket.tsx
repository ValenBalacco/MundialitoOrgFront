
import React from 'react';
import styles from './Bracket.module.css';
import { BracketRound } from '../../../utils/bracket';

interface Props {
  data: BracketRound[];
}

const Bracket: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className={styles.noData}>No hay datos de llaves para mostrar.</div>;
  }

  return (
    <div className={styles.bracket}>
      {data.map((round, roundIndex) => (
        <div key={roundIndex} className={styles.round}>
          <h3 className={styles.roundTitle}>{round.title}</h3>
          <div className={styles.matches}>
            {round.matches.map((match, matchIndex) => (
              <div key={match.id} className={styles.match}>
                <div className={styles.matchContent}>
                  {match.teams.map((team, teamIndex) => (
                    <div
                      key={teamIndex}
                      className={`${styles.team} ${match.winner === team?.name ? styles.winner : ''}`}
                    >
                      <span className={styles.teamName}>{team?.name || '---'}</span>
                      <span className={styles.score}>{team?.score ?? ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Bracket;
