import { component$, useSignal } from "@builder.io/qwik";



export default component$(() => {
	const isLoggedIn = useSignal(false);

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
			<a href="/logout">
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