import { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'

class MainMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            lastPillTakenTime: null
        }
    }

    componentDidMount() {
      console.log("componentDidMount called");
      this.checkLastLaunchTime();
    }
    
    async checkLastLaunchTime() {
      //await setLastLaunchTime(); // Here to test 7 day check.
      const lastLaunchTime = await AsyncStorage.getItem("lastLaunchTime");
      console.log("lastLaunchTime", lastLaunchTime); 
      const currentTime = new Date().getTime();
      console.log("currentTime", currentTime); 
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

      if (!lastLaunchTime || currentTime - lastLaunchTime > sevenDaysInMs) {
        Alert.alert(
          "Reminder",
          "It's been 7 days since you last logged a note. Please take a moment to write down how you've been feeling.",
          [
            {
              text: "OK",
              onPress: () => {
                // navigate to the LogScreen
                this.props.navigation.navigate("LogScreen");
              },
            },
          ]
        );
      }

      await AsyncStorage.setItem("lastLaunchTime", currentTime.toString());
    }

    onLoginSuccess = () => {
        this.setState({ isLoggedIn: true });
    }

    onTakePill = () => {
        const { lastPillTakenTime } = this.state;
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastPillTakenTime;
        const timeThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
  
        if (lastPillTakenTime && timeDifference < timeThreshold) {
          Alert.alert(
            "Warning",
            "Are you sure you want to take the pill? You took the last pill less than 5 minutes ago.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Take Pill",
                onPress: () => {
                  this.props.navigation.navigate('Take Pill');
                  this.setState({ lastPillTakenTime: currentTime });
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          this.props.navigation.navigate('Take Pill');
          this.setState({ lastPillTakenTime: currentTime });
        }
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Main Menu</Text>
        
                {!this.state.isLoggedIn &&
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => this.props.navigation.navigate('Login', { onLoginSuccess: this.onLoginSuccess })}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                }

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('Manage Medications')}
                >
                    <Text style={styles.buttonText}>Manage Medication</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('My Data')}>
                    <Text style={styles.buttonText}>My Data</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.circleButton}
                    onPress={this.onTakePill}
                >
                    <Text style={styles.circleButtonText}>Take Pill</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Log Screen')} style={{ position: 'absolute', bottom: 40, right: 30 }}>
                  <Text style={{ fontSize: 30, color: 'white', backgroundColor: 'blue', padding: 10, borderRadius: 50 }}>+</Text>
                </TouchableOpacity>

            </View>
        );
    }
}
async function setLastLaunchTime() { // Test function to check if time feature works.
  const eightDaysInMs = 8 * 24 * 60 * 60 * 1000;
  const lastLaunchTime = new Date().getTime() - eightDaysInMs;
  await AsyncStorage.setItem("lastLaunchTime", lastLaunchTime.toString());
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30
    },
    button: {
        backgroundColor: '#0080ff',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
        marginBottom: 20
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    },
    circleButton: {
        backgroundColor: '#0080ff',
        width: 250,
        height: 250,
        borderRadius: 150,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 260,
    },
    circleButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 24
    },
    loginButton: {
        backgroundColor: '#0080ff',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
        marginBottom: 20,
        position: 'absolute',
        bottom: 20,
        left: 20
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    }
});
export default MainMenu;
