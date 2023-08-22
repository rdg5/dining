import { component$, $, useSignal, useStylesScoped$} from "@builder.io/qwik";
import { routeLoader$, useLocation, z } from "@builder.io/qwik-city";
import type { InitialValues, SubmitHandler} from "@modular-forms/qwik";
import { useForm, zodForm$ } from "@modular-forms/qwik";
import NavBar from "~/components/nav-bar/nav-bar";
import { supabase } from "~/utils/supabase";
// import apiFetch from "~/helper-functions/fetch";
import CSS from './index.css?inline'
import { error } from "console";


const LoginSchema = z.object({
   email: z
    .string()
    .min(1, 'Please enter your email.')
    .email('The email address is badly formatted.'),
});

type LoginForm = z.infer<typeof LoginSchema>
export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
	email: '',
}));


export default component$(() => {
	useStylesScoped$(CSS)
	const message = useSignal('');
	const loc = useLocation();
	

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [LoginForm, {Form, Field}] = useForm({
		loader: useFormLoader(),
		validate: zodForm$(LoginSchema)
	})

	const handleSubmit = $<SubmitHandler<LoginForm>>(async (values) => {
		try {
			const {data, error} = await supabase.auth.signInWithOtp({
				email: values.email,
				options: {
					emailRedirectTo: loc.url + 'staging'
				}
			})
			if(error) {
				throw new Error(error.message)
			} else {
				message.value = `Success`
		}
	}
		
		catch(error: any) {
			if(error && typeof error.message === 'string'){
				console.log
				message.value = error.message
			}}
	})

	return (
		<>
		<NavBar />
		<div class="page">
			<h3 class="loginTitle">Login</h3>
		<Form onSubmit$={handleSubmit} class="form">
			<label for="email">email</label>
		<Field name="email">
    {(field, props) => (
    <div>
      <input {...props} type="email"  id="email" class="loginInput" placeholder="gandalf@gmail.com" value={field.value} />
      {field.error && <div class="error">{field.error}</div>}
    </div>
  )}
  </Field>
  <button type="submit" class="loginButton">Login</button>
	<p class="message">{message.value}</p>
	</Form>
	</div>
	</>
	)
}) 
