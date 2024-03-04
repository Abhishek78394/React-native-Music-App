import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { songsList } from './src/song';
import SongPlayer from './src/SongPlayer';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';


const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState('light');
  const playbackState = usePlaybackState();
  const bgColor =  mode === 'light' ? '#fff' : '#000'
  const textColor =  mode === 'light' ? '#000' : '#FFF'
  const progress = useProgress();
  const [isVisible,setIsVisible]=useState(false)
  
  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
      });
      await TrackPlayer.add(songsList);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    setupPlayer();
  }, []);

  return (
    <View
    style={{flex: 1 , backgroundColor: bgColor,}}>
    <StatusBar translucent backgroundColor={'transparent'} />

 <View style={{ flexDirection: 'row',
        width: '99%',
        marginRight: 20,
        justifyContent: 'space-between',
        alignSelf: 'center',}}>
 <Image
      source={require('./src/assets/left.png')}
      style={{
        width: 24,
        height: 24,
        tintColor: textColor,
        marginTop: 60,
        marginLeft: 20,
      }}
    />
      <TouchableOpacity activeOpacity={.5} onPress={()=> {mode=='light'? setMode('dark'): setMode('light')}}>
        {
          mode === 'light' ? ( 
            <Image
            source={require('./src/assets/light.png')}
            style={{
              width: 34,
              height: 34,
              tintColor: '#91BAE3',
              marginTop: 60,
              marginLeft: 20,
              tintColor: '#'
            }}
          />
          ) :  <Image
          source={require('./src/assets/dark.png')}
          style={{
            width: 25,
            height: 25,
            tintColor: '#91BAE3',
            marginTop: 60,
            marginLeft: 20,
            tintColor: '#'
          }}
        />
        }
     
      </TouchableOpacity>
   
 </View>
    <View
      style={{
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        flexDirection: 'row',
      }}>
      <View
        style={{
          width: '85%',
          height: 37,
          backgroundColor: '#91BAE3',
          borderRadius: 5,
          flexDirection: 'row',
          paddingLeft: 15,
          alignItems: 'center',
        }}>
        <Image
          source={require('./src/assets/search2.png')}
          style={{width: 18, height: 18, tintColor: '#000'}}
        />
        <Text style={{color: '#000', marginLeft: 10}}>Find in Playlist</Text>
      </View>
      <View
        style={{
          width: '15%',
          height: 37,
          backgroundColor: '#91BAE3',
          borderRadius: 7,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 5,
        }}>
        <Text style={{color: '#000', fontWeight: '600'}}>Sort</Text>
      </View>
    </View>
    <Image
      source={{uri: songsList[currentIndex].artwork}}
      style={{
        width: '80%',
        height: '35%',
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 5,
      }}
    />
    <Text
      style={{
        fontSize: 30,
        color: '#000',
        fontWeight: '600',
        marginLeft: 20,
        marginTop: 20,
      }}>
      {songsList[currentIndex].title}
    </Text>
    <View style={{flexDirection: 'row', paddingLeft: 20, marginTop: 20}}>
      <Image
        source={require('./src/assets/spotify.png')}
        style={{width: 18, height: 18}}
      />
      <Text style={{color: textColor, fontSize: 14, marginLeft: 10}}>
        English Songs
      </Text>
    </View>
    <View style={{flexDirection: 'row', paddingLeft: 20, marginTop: 10}}>
      <Text style={{color: textColor, fontSize: 12}}>20,169 saves</Text>
      <Text style={{color: textColor, fontSize: 12, marginLeft: 10}}>
        4h 26m
      </Text>
    </View>
    <View
      style={{
        flexDirection: 'row',
        width: '90%',
        marginTop: 10,
        justifyContent: 'space-between',
        alignSelf: 'center',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={require('./src/assets/plus.png')}
          style={{width: 18, height: 18, tintColor: textColor}}
        />
        <Image
          source={require('./src/assets/arrow-down.png')}
          style={{
            width: 18,
            height: 18,
            tintColor: textColor,
            marginLeft: 15,
          }}
        />
        <Image
          source={require('./src/assets/option.png')}
          style={{
            width: 18,
            height: 18,
            tintColor: textColor,
            marginLeft: 15,
          }}
        />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={require('./src/assets/suffle.png')}
          style={{width: 30, height: 30, tintColor: textColor}}
        />
        <TouchableOpacity
          onPress={async () => {
            if (State.Playing == playbackState.state) {
              await TrackPlayer.pause();
            } else {
              await TrackPlayer.play();
            }
          }}>
          {State.Playing == playbackState.state ? (
            <Image
              source={require('./src/assets/pause.png')}
              style={{
                width: 40,
                height: 40,
                marginLeft: 20,
                marginRight: 10,
                tintColor: '#91BAE3',
              }}
            />
          ) : (
            <Image
              source={require('./src/assets/play-button.png')}
              style={{
                width: 40,
                height: 40,
                marginLeft: 20,
                marginRight: 10,
                tintColor: '#91BAE3'
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>

    <FlatList
      data={songsList}
      renderItem={({item, index}) => {
        return (
          <TouchableOpacity
            style={{
              width: '100%',
              height: 50,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 10,
            }}
            onPress={async () => {
              await TrackPlayer.pause();
              await TrackPlayer.skip(index);
              await TrackPlayer.play();
              setCurrentIndex(index);
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: item.artwork}}
                style={{width: 50, height: 50, borderRadius: 5}}
              />
              <View style={{marginLeft: 10}}>
                <Text style={{color: textColor}}>{item.title}</Text>
                <Text style={{color: textColor, fontSize: 10}}>
                  {item.artist}
                </Text>
              </View>
              {index == currentIndex && State.Playing == playbackState && (
                <Image
                  source={require('./src/assets/playing.png')}
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: textColor,
                    marginLeft: 20,
                  }}
                />
              )}
            </View>
            <Image
              source={require('./src/assets/option.png')}
              style={{width: 18, height: 18, tintColor: textColor}}
            />
          </TouchableOpacity>
        );
      }}
    />

    <TouchableOpacity
     activeOpacity={1}
      style={{
        width: '100%',
        height: 70,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#91BAE3',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between',
      }} onPress={()=>{
        setIsVisible(true)
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={{uri: songsList[currentIndex].artwork}}
          style={{width: 50, height: 50, borderRadius: 5}}
        />
        <View style={{marginLeft: 10}}>
          <Text style={{color: '#000'}}>
            {songsList[currentIndex].title}
          </Text>
          <Text style={{color: '#000', fontSize: 10}}>
            {songsList[currentIndex].artist}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={async () => {
          if (State.Playing == playbackState.state) {
            await TrackPlayer.pause();
          } else {
            await TrackPlayer.play();
          }
        }}>
        <Image
          source={
            State.Playing == playbackState.state
              ? require('./src/assets/pause2.png')
              : require('./src/assets/play.png')
          }
          style={{width: 30, height: 30, tintColor: bgColor}}
        />
      </TouchableOpacity>
    </TouchableOpacity>
    <SongPlayer
    isVisible={isVisible}
    mode={mode}
    songsList={songsList}
      currentIndex={currentIndex}
      playbackState={playbackState}
      progress={progress}
      setCurrentIndex={setCurrentIndex}
      onChange={(x)=>{
        setCurrentIndex(x)
      }}
      onClose={()=>{
        setIsVisible(false)
      }}
    />
  </View>
  )
}

export default App