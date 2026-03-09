
import { Clubes, Encuentro } from '../types';

export interface BracketMatch {
  id: number | string;
  teams: Array<{ name: string; score?: number } | null>;
  winner?: string;
}

export interface BracketRound {
  title: string;
  matches: BracketMatch[];
}

export const getWinner = (encuentro: Encuentro): Clubes | null => {
    if (encuentro.estado !== 'DISPUTADO') return null;
    const [score1, score2] = encuentro.resultado.split('-').map(Number);
    if (score1 > score2) return encuentro.clubLocal;
    if (score2 > score1) return encuentro.clubVisitante;
    return null; // Should handle draws/penalties if applicable
};

export const generateBracket = (clubes: Clubes[], encuentros: Encuentro[]): BracketRound[] => {
    if (!clubes || clubes.length === 0) return [];
    
    const rounds: BracketRound[] = [];
    let currentRoundMatches = encuentros.filter(e => e.fase === 1);
    let roundNumber = 1;

    // Initial round
    rounds.push({
        title: `Ronda ${roundNumber}`,
        matches: currentRoundMatches.map(e => ({
            id: e.id,
            teams: [
                { name: e.clubLocal.nombre, score: e.estado === 'DISPUTADO' ? Number(e.resultado.split('-')[0]) : undefined },
                { name: e.clubVisitante.nombre, score: e.estado === 'DISPUTADO' ? Number(e.resultado.split('-')[1]) : undefined }
            ],
            winner: getWinner(e)?.nombre
        }))
    });

    let winners = currentRoundMatches.map(getWinner);

    while (winners.filter(w => w !== null).length > 1 || currentRoundMatches.length > 1) {
        roundNumber++;
        const nextRoundMatches: BracketMatch[] = [];
        const nextRoundEncounters = encuentros.filter(e => e.fase === roundNumber);

        for (let i = 0; i < winners.length; i += 2) {
            const team1 = winners[i];
            const team2 = i + 1 < winners.length ? winners[i + 1] : null;

            const existingEncuentro = nextRoundEncounters.find(e => 
                (e.clubLocal.cod === team1?.cod && e.clubVisitante.cod === team2?.cod) ||
                (e.clubLocal.cod === team2?.cod && e.clubVisitante.cod === team1?.cod)
            );

            if (existingEncuentro) {
                nextRoundMatches.push({
                    id: existingEncuentro.id,
                    teams: [
                        { name: existingEncuentro.clubLocal.nombre, score: existingEncuentro.estado === 'DISPUTADO' ? Number(existingEncuentro.resultado.split('-')[0]) : undefined },
                        { name: existingEncuentro.clubVisitante.nombre, score: existingEncuentro.estado === 'DISPUTADO' ? Number(existingEncuentro.resultado.split('-')[1]) : undefined }
                    ],
                    winner: getWinner(existingEncuentro)?.nombre
                });
            } else {
                 nextRoundMatches.push({
                    id: `r${roundNumber}-m${i/2}`,
                    teams: [
                        team1 ? { name: team1.nombre } : null,
                        team2 ? { name: team2.nombre } : null
                    ]
                });
            }
        }
        
        rounds.push({
            title: `Ronda ${roundNumber}`,
            matches: nextRoundMatches
        });

        currentRoundMatches = encuentros.filter(e => e.fase === roundNumber);
        winners = currentRoundMatches.map(getWinner);
        
        // Break if no more winners to process
        if (winners.filter(w => w !== null).length < 2 && nextRoundMatches.every(m => m.teams.filter(t => t).length < 2)) {
            // Check if there is a final winner
            if(nextRoundMatches.length === 1 && nextRoundMatches[0].winner) {
                 rounds.push({
                    title: 'Ganador',
                    matches: [{
                        id: 'winner',
                        teams: [{ name: nextRoundMatches[0].winner! }],
                        winner: nextRoundMatches[0].winner
                    }]
                });
            }
            break;
        }
    }

    return rounds;
};
