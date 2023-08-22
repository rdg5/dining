import { component$, useVisibleTask$, useStore, createContextId, useContextProvider } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
import { supabase } from "./utils/supabase";

export const userSessionContext = createContextId<any>('user-session')


export type UserSession = {
  userId: string,
  isLoggedIn: boolean,
}

export default component$(() => {
  const userSession: UserSession = useStore({
    userId: '',
    isLoggedIn: false,
  })

  useVisibleTask$(async () => {
    const { data: authListener} = supabase.auth.onAuthStateChange( async (event: string, session: any) => {
      if(event === `SIGNED_IN`) {
        //TODO send cookies to server

        //auth
        userSession.userId = session?.user?.id;
        userSession.isLoggedIn = true;
      }
      if(event === `SIGNED_OUT`) {
        //TODO sign out logic for server

        userSession.userId = '';
        userSession.isLoggedIn = false;
      }

      return(() => {
        authListener?.subscription?.unsubscribe();
      })
    })
  })

  useContextProvider(userSessionContext, userSession)
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
