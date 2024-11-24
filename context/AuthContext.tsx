import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from "expo-auth-session";
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

  export interface AuthContextInterface {
    isSignedIn: boolean;
    accessToken: string;
    idToken: string;
    userInfo: any;
    signIn: any;
    hasRole: any,
  }

  const initialState = {
    isSignedIn: false,
    accessToken: null,
    idToken: null,
    userInfo: null,
    signIn: () => {},
    hasRole: (role) => false,
  };
  
  export const AuthContext = createContext({
    ...initialState
  });
  
  interface AuthReducerState {
    isSignedIn: boolean;
    accessToken: any;
    idToken: any;
    userInfo: any;
  }
  
const authReducer = (
    state: AuthReducerState,
    action: any,
  ): AuthReducerState => {
    switch (action.type) {
        case 'SIGN_IN':
          return {
            ...state,
            isSignedIn: true,
            accessToken: action.payload.access_token,
            idToken: action.payload.id_token,
          }
        case 'USER_INFO':
          return {
            ...state,
            userInfo: {
              username: action.payload.preferred_username,
              givenName: action.payload.given_name,
              familyName: action.payload.family_name,
              email: action.payload.email,
              roles: action.payload.roles,
            },
          }
        case 'SIGN_OUT':
          return initialState
        default : 
          return initialState
      }
  };
  
  
  export const AuthContextProvider = ({ children }: { children: any }) => {
    const discovery = useAutoDiscovery(process.env.EXPO_PUBLIC_KEYCLOAK_URL!)
    const redirectUri = makeRedirectUri()

    const [request, response, promptAsync] = useAuthRequest(
      {
        clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID!,
        redirectUri: redirectUri,
        scopes: ['openid', 'profile'],
      },
      discovery
    )

    const [authState, dispatch] = useReducer(authReducer, initialState);

    const signIn = () => {
      console.log('call promptAsync')
      promptAsync()
    }

    const signOut = async () => { 
      try {
        const idToken = authState.idToken
        await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/logout?id_token_hint=${idToken}`
        )
        dispatch({ type: 'SIGN_OUT' })
      } catch (e) {
        console.warn(e)
      }
     }

     const hasRole = (role) => {
      return authState.userInfo?.roles.indexOf(role) != -1
    }

    useEffect(() => {
      const getToken = async ({ code, codeVerifier, redirectUri }) => {
        try {
          const formData = {
            grant_type: 'authorization_code',
            client_id: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
            code: code,
            code_verifier: codeVerifier,
            redirect_uri: redirectUri,
          }
          const formBody = []
          for (const property in formData) {
            const encodedKey = encodeURIComponent(property)
            const encodedValue = encodeURIComponent(formData[property])
            formBody.push(encodedKey + '=' + encodedValue)
          }
  
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/token`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: formBody.join('&'),
            }
          )
          console.log('response.ok getToken', response.ok)
          if (response.ok) {
            const payload = await response.json()
            console.log('payload getToken', payload)
            dispatch({ type: 'SIGN_IN', payload })


          }
        } catch (e) {
          console.warn(e)
        }
      }
      if (response?.type === 'success') {
        const { code } = response.params
        getToken({
          code,
          codeVerifier: request?.codeVerifier,
          redirectUri,
        })
      } else if (response?.type === 'error') {
        console.warn('Authentication error: ', response.error)
      }
    }, [dispatch, redirectUri, request?.codeVerifier, response])

    useEffect(() => {
      const getUserInfo = async () => {
        try {
          const accessToken = authState.accessToken
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/userinfo`,
            {
              method: 'GET',
              headers: {
                Authorization: 'Bearer ' + accessToken,
                Accept: 'application/json',
              },
            }
          )

          if (response.ok) {
            const payload = await response.json()
            console.log('response getUserInfo', payload)
            dispatch({ type: 'USER_INFO', payload })
          }
        } catch (e) {
          console.warn(e)
        }
      }
      if (authState.isSignedIn) {
        getUserInfo()
      }
    }, [authState.accessToken, authState.isSignedIn, dispatch])
  
    return (
      <AuthContext.Provider
        value={
          {
            ...authState,
            signIn,
            hasRole
          }

        }
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuthContext = () => useContext(AuthContext);
  