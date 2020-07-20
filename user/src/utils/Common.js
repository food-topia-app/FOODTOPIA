import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'

// export const Server = "http://192.168.1.37:5000";
export const Server = "https://fudtopia.el.r.appspot.com";
export const AppVersion = "1.0.0";

const readToken = async () => {
    try {
        const result = await AsyncStorage.getItem('token');
        return result;
    } catch (err) {
        console.log('Token read error');
        return "";
    }
}

export const fetchJSON = async (apiName, body = {}, method = 'POST') => {
    let token = await readToken();
    if (token == null)
        token = '';
    try {
        let response = await fetch(Server + '/api/user/' + AppVersion + '/' + apiName,
            {
                method,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                    'x-app-version': AppVersion
                },
                body: method === 'GET' ? undefined : JSON.stringify(body)
            });

        if (response.status == 200) {
            // console.log(response)
            let responseJSON = await response.json();
            return responseJSON;
        }
        else {
            // console.log(response.status)
            let result = await response.json();
            switch (result.msg) {
                case 'INVALID_USER':
                    return 'INVALID_USER';
                case 'STOCK_ERROR':
                    return result
                default: return null;
            }
        }
    } catch (err) {
        console.log(err)
        return null;
    }
}

export const logout = async (navigation) => {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    await auth().signOut()
    navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: 'loginScreen' }]
    }));
}