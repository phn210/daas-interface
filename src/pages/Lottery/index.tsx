import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Box, Grid, styled } from '@mui/material';
import gsap from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';
import Loading from 'src/components/Loading';
import { buildPathToPublicResource } from 'src/utils';
import { useLottery } from './hooks/useLottery';
import LuckyNumberItem from './LuckyNumberItem';
import WinnerList from './WinnerList';
import YourLuckyNumberRange from './YourLuckyNumberRange';

const SectionTitle = styled('div')(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: '#FDE58D',
  marginBottom: 16,
}));

export default function Lottery() {
  const { loading, data } = useLottery();
  const img1Ref = useRef<HTMLImageElement | null>(null);
  const img2Ref = useRef<HTMLImageElement | null>(null);
  const musicNoteRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const winnerList = data.winnerList;
  const randomDurations = useMemo<Array<number>>(() => new Array(10).fill(0).map(() => 1.5 + Math.random()), []);
  const luckyNumbers = useMemo<Array<number>>(() => {
    const a = new Array(10).fill(-1);
    if (data.luckyNumbers) {
      data.luckyNumbers.forEach((n, i) => {
        a[i] = n;
      });
    }
    return a;
  }, [data]);

  useEffect(() => {
    if (img2Ref.current) {
      gsap.fromTo(
        img2Ref.current,
        {
          rotateZ: '0',
        },
        {
          rotateZ: '20',
          duration: 1,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        }
      );
    }

    if (img1Ref.current) {
      gsap.fromTo(
        img1Ref.current,
        {
          scale: 0.1,
        },
        {
          scale: 1,
          duration: 1,
          transformOrigin: 'center',
        }
      );
    }
  }, []);

  useEffect(() => {
    const audio = new Audio(buildPathToPublicResource('/mp3/music.mp3'));
    audio.loop = true;
    document.body.addEventListener('click', function () {
      audio.play();
      setIsPlaying(true);
    });
  }, []);

  useEffect(() => {
    let animation: gsap.core.Tween | undefined;
    if (musicNoteRef.current && isPlaying) {
      animation = gsap.to(musicNoteRef.current, {
        rotate: '+=360',
        duration: 5,
        repeat: -1,
        ease: 'none',
      });
    }

    return () => {
      if (animation) {
        animation.kill();
      }
    };
  }, [isPlaying]);

  return (
    <Box
      sx={{
        backgroundImage: `url(${buildPathToPublicResource('/images/lottery/bg.png')})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        py: 2,
      }}
    >
      <Box ref={musicNoteRef} sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000, color: 'white' }}>
        <MusicNoteIcon />
      </Box>
      <Box sx={{ maxWidth: 700, mx: 'auto', mb: 3 }}>
        <img
          ref={img1Ref}
          src={buildPathToPublicResource('/images/lottery/title.png')}
          alt="trava governance lottery"
          width="100%"
        />
      </Box>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={8}>
            <SectionTitle>Lucky number</SectionTitle>
            <Grid container columns={10} spacing={2}>
              {loading && (
                <Grid item>
                  <Loading size={40} />
                </Grid>
              )}
              {!loading &&
                luckyNumbers.map((n: number, i) => (
                  <Grid key={i} item xs={3} sm={2}>
                    <LuckyNumberItem luckyNumber={n} open={n !== -1} duration={randomDurations[i % 10]} />
                  </Grid>
                ))}
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: 'column',
            }}
          >
            <SectionTitle sx={{ mb: 2 }}>Your lottery number range</SectionTitle>
            <YourLuckyNumberRange />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ mt: { sm: 5 } }}>
              <SectionTitle>Winner list</SectionTitle>
              {loading && <Loading size={40} />}
              {!loading && winnerList && <WinnerList list={winnerList} />}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ maxWidth: 200, mx: 'auto', overflow: 'hidden' }}>
              <img
                ref={img2Ref}
                src={buildPathToPublicResource('/images/lottery/chest.png')}
                alt="chest"
                width="100%"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
