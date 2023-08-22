import {
  component$, useSignal, useVisibleTask$, useContext,
} from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { supabase } from "~/utils/supabase";
import { UserSession, userSessionContext } from "~/root";
import NavBar from "~/components/nav-bar/nav-bar";

export default component$(() => {
	const isProtectedOk = useSignal(false);
	const navigate = useNavigate();
	const userSession: UserSession = useContext(userSessionContext);


	useVisibleTask$(() => {
		const timeout = setTimeout(async () => {
     const {data, error} = await supabase.auth.getUser();

			if(data?.user?.id && !error) {
				isProtectedOk.value = true;
				userSession.userId = data?.user?.id;
				userSession.isLoggedIn = true;
				// await navigate('/members/dashboard');
			} else {
				console.error(error);
				userSession.userId = '';
				userSession.isLoggedIn = false;
				await navigate('/login')
			}
		},500)

		return (() => {
			clearTimeout(timeout)
		})
	})

  return (
    <>
		<NavBar />
      <div>
				{isProtectedOk &&(
          <>
            <span>Redirecting to </span>
            <Link href="/members/dashboard">
              <button>Dashboard</button>
            </Link>
          </>
				)}
				{!isProtectedOk &&(
					<>
					Please log in
					</>
				)

				}
      </div>
    </>
  );
});
