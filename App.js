import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';
import * as Font from 'expo-font';

// Hide all warning notifications on front-end
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();


const buttonWidth = Dimensions.get('window').width / 5;

export default function App() {

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'digital-font': require('./assets/fonts/Digital7-rg1mL.ttf'),
      });
    };
    loadFonts();
  }, []);


  const [answerValue, setAnswerValue] = useState(0);
  const [readyToReplace, setReadyToReplace] = useState(true);
  const [memoryValue, setMemoryValue] = useState(0);
  const [operatorValue, setOperatorValue] = useState(false);

 
  function calculateEquals() {
    let result = parseFloat(memoryValue);
    var current = parseFloat(answerValue);
    
    switch (operatorValue) {
      case '+':
        result += current;
        break;
      case '-':
        result -= current;
        break;
      case 'x':
        result *= current;
        break;
      case '/':
        result /= current;
        break;
    }  
    
    const isDecimal = Number.isInteger(result) === false;
    const formattedResult = isDecimal ? result.toFixed(2) : result.toString();

    setAnswerValue([formattedResult]);
    return formattedResult;
  }

  function buttonPressed(value) {
    if (value === 'C') {
      if (answerValue === '0') {
        setMemoryValue(0);
        setOperatorValue(false);
      }
      setAnswerValue('0');
      setReadyToReplace(true);
    } 
    else if (typeof value === 'number' || value === '.' || value === 'π') {
      handleNumber(value);
    } 
    else if (value == 'BS') {
      if (readyToReplace) {
        setAnswerValue(0);
        setMemoryValue(0);
        setOperatorValue(false);
        setReadyToReplace(true);
      } else {
        setAnswerValue(answerValue.slice(0, -1));
      }
    }
    else if (value == '+/-') {
      setAnswerValue(answerValue * -1)
    }
    else if (value == '%') {
      setAnswerValue(answerValue * 0.01)
    }
    else if (value === '=') {
      const result = calculateEquals();
      setAnswerValue(result);
      setOperatorValue(false);
      setMemoryValue(result);
      setReadyToReplace(true);
    } 
    else if (value === '+' || value === '-' || value === 'x' || value === '/' ) {
      if (operatorValue !== false) {
        const result = calculateEquals();
        setMemoryValue(result);
      } else {
        setMemoryValue(answerValue);
      }
      setOperatorValue(value);
      setReadyToReplace(true);
    }
    else if (value === 'pwr2') {
      const squaredValue = Math.pow(parseFloat(answerValue), 2);
      setAnswerValue(squaredValue);
      setMemoryValue(squaredValue);
    }
    else if (value === '√') {
      const sqrtValue = Math.sqrt(parseFloat(answerValue));
      setAnswerValue(sqrtValue);
      setMemoryValue(sqrtValue);
    }
  } 


  function handleNumber(number) {
    if (number === 'π') {
      number = 3.14
    }
    if (readyToReplace == true) {
      setAnswerValue(number.toString());
      setReadyToReplace(false);
    }
    else {
      if (answerValue == '0'){
        setReadyToReplace(true)
      }
      else {
        setAnswerValue(prevValue => prevValue.toString() + number.toString());
      }
    }
  };

  return (
  <View style={styles.container}>
    <Text style={styles.result}> {answerValue} </Text>
    <View style={styles.row}> 
      <TouchableOpacity style={[styles.touch, styles.lightThree]} onPress={()=>buttonPressed('C')}> 
        <Text style={[styles.buttonText, styles.topThreeText]}  > C </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch, styles.lightThree]} onPress={()=>buttonPressed('+/-')}> 
        <Text style={[styles.buttonText, styles.topThreeText]}  > +/- </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch, styles.lightThree]} onPress={()=>buttonPressed('%')}> 
        <Text style={[styles.buttonText, styles.topThreeText]}> % </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch, styles.backspace]} onPress={()=>buttonPressed('BS')}> 
        <Text style={[styles.BSText]}> ⌫ </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.row}> 
      <TouchableOpacity style={[styles.touch, styles.darkThree]} onPress={()=>buttonPressed('√')}> 
        <Text style={[styles.buttonText, styles.topThreeText]}  > √ </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch, styles.darkThree]} onPress={()=>buttonPressed('pwr2')}> 
        <Text style={[styles.buttonText, styles.topThreeText]}>^2 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch, styles.darkThree]} onPress={()=>buttonPressed('π')}> 
        <Text style={[styles.buttonText, styles.topThreeText]}> pi </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch, styles.rightColumn]} onPress={()=>buttonPressed('/')}> 
        <Text style={[styles.buttonText]}> / </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.row}> 
      <TouchableOpacity style={[styles.touch]} onPress={()=>buttonPressed(7)} > 
        <Text style={styles.buttonText}> 7 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch]} onPress={()=>buttonPressed(8)}> 
        <Text style={styles.buttonText}> 8 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch]} onPress={()=>buttonPressed(9)}> 
        <Text style={styles.buttonText}> 9 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch, styles.rightColumn]} onPress={()=>buttonPressed('x')} > 
        <Text style={styles.buttonText}> x </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.row}> 
      <TouchableOpacity style={[styles.touch]} onPress={() =>buttonPressed(4)}> 
        <Text style={styles.buttonText}> 4 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch]} onPress={() =>buttonPressed(5)}> 
        <Text style={styles.buttonText}> 5 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch]} onPress={() =>buttonPressed(6)}> 
        <Text style={styles.buttonText}> 6 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch, styles.rightColumn]} onPress={()=>buttonPressed('-')} > 
        <Text style={styles.buttonText}> - </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.row}> 
      <TouchableOpacity style={[styles.touch]}  onPress={()=>buttonPressed(1)}> 
        <Text style={styles.buttonText}> 1 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch]}  onPress={()=>buttonPressed(2)}> 
        <Text style={styles.buttonText}> 2 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch]}  onPress={()=>buttonPressed(3)}> 
        <Text style={styles.buttonText}> 3 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch,styles.rightColumn]} onPress={()=>buttonPressed('+')}> 
        <Text style={styles.buttonText}> + </Text>
      </TouchableOpacity>
    </View>

    <View style={[styles.row, styles.row5]} > 
      <TouchableOpacity style={[styles.touch, styles.longZero]}  onPress={() => buttonPressed(0)}> 
        <Text style={styles.buttonText}> 0 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch]} onPress={() => buttonPressed('.')}> 
        <Text style={styles.buttonText}> . </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touch, styles.rightColumn]} onPress={() => buttonPressed('=')}> 
        <Text style={styles.buttonText}> = </Text>
      </TouchableOpacity>
    </View>

    <StatusBar style="auto" />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    statusbar: 'light content',
    justifyContent: 'flex-end',
  },
  result: {
    color: 'white',
    fontSize: 80,
    marginBottom: '2%',
    textAlign: 'right',
    width: '100%',
    paddingRight: buttonWidth/3,
    fontFamily: 'digital-font'
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  }, 
  touch: {
    width: buttonWidth,
    height: buttonWidth,
    backgroundColor: "#333333",
    borderRadius: 100,
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 46,
    fontFamily: 'digital-font',
    lineHeight: buttonWidth, 
    textAlign: 'center', 
  },
  row5:{
    flexDirection: 'row',
    marginBottom: '5%'
  },
  lightThree: {
    backgroundColor:'#d2cfcf'
  },
  darkThree: {
    backgroundColor: '#A6A6A6'
  },
  topThreeText: {
    color: 'black'
  },
  rightColumn: {
    backgroundColor: '#0984E3'
  },
  longZero: {
    width: buttonWidth*2.1,
    alignItems: 'flex-start',
    paddingLeft: '5.5%', 
    borderRadius: 70
  }, 
  backspace : {
    backgroundColor: '#0984E3',
  },
  BSText: {
    fontSize: 24,
    color: 'white'
  }
});
