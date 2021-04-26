import { createContext, useState, ReactNode, useContext } from 'react';



type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currenteEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isRandom: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    togglePlay: () => void
    toggleLoop: () => void
    toggleRandom: () => void
    playNext: () => void
    playPrevious: () => void
    setPlayingState: (state: boolean) => void;
    hasNext: boolean;
    clearPlayerState: () => void;
    hasPrevious: boolean;

};

type PlayerContextProviderProps = {
    children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currenteEpisodeIndex, setCurrenteEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isRandom, setIsRandom] = useState(false);


    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrenteEpisodeIndex[0];
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrenteEpisodeIndex(index);
        setIsPlaying(true);

    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toggleRandom() {
        setIsRandom(!isRandom);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrenteEpisodeIndex(0);
    }

    const hasPrevious = currenteEpisodeIndex > 0;
    const hasNext = isRandom || (currenteEpisodeIndex + 1) < episodeList.length;

    function playNext() {

        if (isRandom) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrenteEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext) {
            setCurrenteEpisodeIndex(currenteEpisodeIndex + 1);

        }
    }

    function playPrevious() {
        if (hasPrevious) {
            setCurrenteEpisodeIndex(currenteEpisodeIndex - 1);
        }
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currenteEpisodeIndex,
            play,
            playList,
            playNext,
            playPrevious,
            isPlaying,
            isLooping,
            isRandom,
            togglePlay,
            toggleLoop,
            toggleRandom,
            setPlayingState,
            hasNext,
            hasPrevious,
            clearPlayerState,
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export default PlayerContext;

export const usePlayer = () => {
    return useContext(PlayerContext);
}