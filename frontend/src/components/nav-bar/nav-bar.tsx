import { component$, useSignal, useVisibleTask$, useContext, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { UserSession} from "~/root";
import { userSessionContext } from "~/root";
import { supabase } from "~/utils/supabase";


export default component$(() => {
	const isLoggedIn = useSignal(false);
	const userSession: UserSession = useContext(userSessionContext);
	const nav = useNavigate();

	useVisibleTask$(({ track }) => {
    track(userSession);
		if(userSession.isLoggedIn) {
			isLoggedIn.value = true;
		} else {
			isLoggedIn.value = false;
		}
	})

  const handleLogout = $(async () => {
    await supabase.auth.signOut();
		await nav('/')
	})

	return(
		<>
	{	isLoggedIn.value ?
		<nav>
			<a href="/">
				<strong>Shop</strong>
			</a>
			<a>
				<strong>Cart</strong>
			</a>
			<a>
				<strong>Purchase</strong>
			</a>
			<a href="/profile">
				<strong>Profile</strong>
			</a>
			<a onClick$={handleLogout}>
				<strong>Logout</strong>
			</a>
		</nav>
		:
		<nav>
		<a href="/register">
			<strong>Register</strong>
		</a>
		<a href="/login">
			<strong>Login</strong>
		</a>
	</nav>
	}
	</>
	)
})