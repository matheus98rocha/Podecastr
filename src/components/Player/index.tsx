import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss'
import Image from 'next/image';


import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { converteDurationToTimeString } from '../../utils/converteDurationToTimeString';

function Player() {

  const audioRef = useRef<HTMLAudioElement>(null);

  const [progress, setProgress] = useState(0);


  const {
    episodeList,
    currenteEpisodeIndex,
    isPlaying,
    isLooping,
    isRandom,
    togglePlay,
    toggleLoop,
    toggleRandom,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    clearPlayerState,
  } = usePlayer();

  useEffect(() => {

    if (!audioRef.current) {
      return
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    };
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleChangeProgressSlider(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext()
    } else {
      clearPlayerState();
    }
  }

  const episode = episodeList[currenteEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando Agora" />
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>
            {converteDurationToTimeString(progress)}
          </span>

          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleChangeProgressSlider}
                trackStyle={{ backgroundColor: '#84d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>

          <span>{converteDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {
          episode && (
            <audio
              src={episode.url}
              ref={audioRef}
              loop={isLooping}
              autoPlay
              onEnded={handleEpisodeEnded}
              onPlay={() => setPlayingState(true)}
              onPause={() => setPlayingState(false)}
              onLoadedMetadata={setupProgressListener}
            />
          )
        }

        <div className={styles.buttons}>
          <button 
          type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleRandom}
            className={isRandom ? styles.isActive : ''}
          >

            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button type="button"
            onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img
              src="/play-previous.svg"
              alt="Embaralhar"
            />
          </button>

          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {
              isPlaying ?
                <img src="/pause.svg" alt="Tocar" /> :
                <img src="/play.svg" alt="Pausar" />
            }
          </button>

          <button type="button" onClick={playNext} disabled={!episode || !hasNext} >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>

          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>

        </div>
      </footer>
    </div>
  );
};

export default Player;