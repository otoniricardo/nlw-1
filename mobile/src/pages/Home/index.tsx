import React, { useState, useEffect } from 'react'
import { Feather as Icon} from '@expo/vector-icons'
import axios from 'axios'
import RNPickerSelect from 'react-native-picker-select';
import { 
  View, 
  Image, 
  StyleSheet, 
  Text, 
  ImageBackground, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const [selectedUf, setSelectedUf] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla)
        setUfs(ufInitials)
      })
  }, [])

  useEffect(() => {
    // if(selectedUf === '0') return
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome)
        setCities(cityNames)
      })
    setSelectedCity('')
  }, [selectedUf]);

  function handleNavigationTopoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    })
  }

  return (
    <KeyboardAvoidingView 
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground 
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{width: 274, height: 368}}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')}/>
          <View>
            <Text style={styles.title}> Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>        
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            onValueChange={value => setSelectedUf(value)}
            useNativeAndroidPickerStyle={false}
            items={ufs.map(uf => ({
              label: uf,
              value: uf
            }))}
          >
            <TextInput
               placeholder="Selecione a UF"
               style={styles.input}
               value={selectedUf}
            ></TextInput>
          </RNPickerSelect>

          <RNPickerSelect
            onValueChange={value => setSelectedCity(value)}
            useNativeAndroidPickerStyle={false}
            items={cities.map(city => ({
              label: city,
              value: city
            }))}
          >
            <TextInput
               placeholder="Digite a Cidade"
               style={styles.input}
               value={selectedCity}
            ></TextInput>
          </RNPickerSelect>
          {/* <TextInput
            style={styles.input}
            placeholder="Digite a UF"
            value={uf}
            onChangeText={setUf}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
          >
          </TextInput>

          <TextInput
            style={styles.input}
            placeholder="Digite a Cidade"
            value={city}
            onChangeText={setCity}
            autoCorrect={false}
          >
          </TextInput> */}

          <RectButton style={styles.button} onPress={handleNavigationTopoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home