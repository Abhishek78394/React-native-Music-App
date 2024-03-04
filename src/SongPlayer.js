import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';
import TrackPlayer, { State,TrackPlayerEvents  } from 'react-native-track-player';

const SongPlayer = ({
  songsList,
  mode,
  currentIndex,
  setCurrentIndex,
  progress,
  playbackState,
  isVisible,
  onClose,
  onChange,
}) => {
  const [sliderValue, setSliderValue] = useState(progress.position);
  const [repeat, setRepeat] = useState('repeat-one');
  const bgColor = mode === 'light' ? '#fff' : '#000';
  const textColor = mode === 'light' ? '#000' : '#FFF';
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');
  const songSlider = useRef(null);

  useEffect(() => {
    setSliderValue(progress.position);
  }, [progress.position]);


  const handleSliderChange = async value => {
    setSliderValue(value);
    await TrackPlayer.seekTo(value);
  };
  useEffect(() => {
    const onPlaybackTrackChanged = async (data) => {
      try {
        console.log("Playback track changed:", data);
        if (data.nextTrack) { 
          if (repeat === 'repeat-one') {
            console.log("single ")
            await TrackPlayer.skip(currentIndex);
          } else if (repeat === 'repeat-all') {
            // handleNext()
          }
        }
      } catch (error) {
        console.error("Error in onPlaybackTrackChanged:", error);
      }
    };
  
    const subscription = TrackPlayer.addEventListener('playback-track-changed', onPlaybackTrackChanged);
  
    return () => {
      subscription.remove();
    };
  }, [currentIndex, repeat]);
  
  


  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleScroll = async(event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    if(index> currentIndex){
      await TrackPlayer.skipToNext();
      setCurrentIndex(currentIndex + 1);
    } 
    if(index< currentIndex){
      await TrackPlayer.skipToPrevious();
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePrevious = async () => {
    if (currentIndex > 0) {
      await TrackPlayer.skipToPrevious();
      setCurrentIndex(currentIndex - 1);
      songSlider.current.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const handleNext = async () => {
    if (currentIndex < songsList.length - 1) {
      await TrackPlayer.skipToNext();
      setCurrentIndex(currentIndex + 1);
      songSlider.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  return (
    <Modal isVisible={isVisible}  style={{height: '100%', width: '100%', margin: 0, backgroundColor: '#fff'}}>
      <Animated.FlatList
        ref={songSlider}
        data={songsList}
        renderItem={({ item, index }) => (
          <View style={{ width, flex: 1, height }}>
            <View style={{ width, height, backgroundColor: bgColor, paddingHorizontal: 20,  }}>
              <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
                <Image source={require('./assets/down-arrow.png')} style={{ width: 30, height: 30, tintColor: textColor }} />
              </TouchableOpacity>

              <Image source={{ uri: item.artwork }} style={{ width: '80%', height: '35%', alignSelf: 'center', marginTop: 20, borderRadius: 5 }} />

              <Text style={{ fontSize: 30, color: textColor, fontWeight: '600', marginTop: 20, marginLeft:25 }}>{item.title}</Text>
              <Text style={{ fontSize: 16, color: textColor, fontWeight: '600',marginLeft:25 }}>{item.artist}</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      />
      <View style={{padding:15, marginBottom:50}}>
      <Slider
                style={{ width: '90%', height: 40, alignSelf: 'center', marginTop: 20 }}
                minimumValue={0}
                maximumValue={progress.duration}
                value={sliderValue}
                minimumTrackTintColor={textColor}
                maximumTrackTintColor={textColor}
                onValueChange={handleSliderChange}
              />
      <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>
                <Text style={{ color: textColor }}>{format(progress.position)}</Text>
                <Text style={{ color: textColor }}>{format(progress.duration)}</Text>
              </View>

              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 30 }}>
                <TouchableOpacity onPress={() => setRepeat(repeat === 'repeat-one' ? 'repeat-all' : 'repeat-one')}>
                  {repeat === 'repeat-one' ? (
                    <Image source={require('./assets/repeate-one.png')} style={{ width: 25, height: 25, tintColor: '#91BAE3' }} />
                  ) : (
                    <Image source={require('./assets/repeat.png')} style={{ width: 25, height: 25, tintColor: '#91BAE3' }} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePrevious}>
                  <Image source={require('./assets/previous.png')} style={{ width: 25, height: 25, tintColor: '#91BAE3' }} />
                </TouchableOpacity>

                <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor }} onPress={async () => {
                  if (State.Playing == playbackState.state) {
                    await TrackPlayer.pause();
                  } else {
                    await TrackPlayer.play();
                  }
                }}>
                  <Image source={State.Playing == playbackState.state ? require('./assets/pause2.png') : require('./assets/play.png')} style={{ width: 30, height: 30, tintColor: '#91BAE3' }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleNext}>
                  <Image source={require('./assets/next.png')} style={{ width: 25, height: 25, tintColor: '#91BAE3' }} />
                </TouchableOpacity>
              </View>
      </View>
    </Modal>
  );
};

export default SongPlayer;