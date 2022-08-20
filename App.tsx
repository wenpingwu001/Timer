import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { PlayIcon, PauseIcon } from "react-native-heroicons/solid";
import { FlagIcon, RefreshIcon } from "react-native-heroicons/outline";
import { useEffect, useState } from "react";
interface Item {
  no: string;
  time: number;
  gap: number;
}
export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [min, setMin] = useState("");
  const [sec, setSec] = useState("");
  const [mili, setMili] = useState("");
  const [flags, setFlags] = useState<Array<Item>>([]);
  const [id, setId] = useState<NodeJS.Timer>();
  const timer = () => setTime(time + 1);
  const start = () => {
    const vid = setInterval(timer, 10);
    setId(vid);
  };
  const stop = () => {
    clearInterval(id);
  };
  const addToQueue = () => {
    let g = undefined;
    if (flags.length === 0) {
      g = time;
    } else {
      g = time - flags[flags.length - 1].time;
    }
    const item: Item = {
      no: `0${flags.length}`,
      time: time,
      gap: g,
    };
    const arr = [...flags];
    arr.unshift(item);
    setFlags([...flags, item]);
  };
  useEffect(() => {
    if (isRunning) {
      start();
    } else {
      stop();
    }
    const minutes = parseInt(String(((time / 100) % 3600) / 60));
    const seconds = parseInt(String((time / 100) % 60));
    const milis = parseInt(String(time % 100));
    const minutesText = minutes <= 9 ? `0${minutes}` : minutes;
    const secondsText = seconds <= 9 ? `0${seconds}` : seconds;
    const miliText = milis <= 9 ? `0${milis}` : milis;
    setMin(String(minutesText));
    setSec(String(secondsText));
    setMili(String(miliText));
    return () => stop();
  }, [time, isRunning]);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: 200,
          height: 200,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: "gray",
          borderRadius: 100,
          marginTop: 100,
        }}
      >
        <Text style={{ fontSize: 36 }}>
          {min}:{sec}:{mili}
        </Text>
      </View>
      <View style={{}}>
        {flags.map((flag) => (
          <Text key={flag.no}>{flag.time}</Text>
        ))}
      </View>
      <View style={styles.row}>
        {isRunning && (
          <RefreshIcon
            size={30}
            color={!isRunning ? "black" : "#aaa"}
            onPress={() => setTime(0)}
            disabled={isRunning}
          />
        )}
        {!isRunning ? (
          <PlayIcon
            onPress={() => setIsRunning(true)}
            size={80}
            style={{ marginHorizontal: 40, elevation: 3 }}
          />
        ) : (
          <PauseIcon
            onPress={() => setIsRunning(false)}
            size={80}
            style={{ marginHorizontal: 40, elevation: 3 }}
          />
        )}
        {isRunning && (
          <FlagIcon
            size={30}
            color={isRunning ? "black" : "#aaa"}
            disabled={!isRunning}
            onPress={() => addToQueue()}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 50,
  },
});
