import { component$, $, useSignal, useStylesScoped$} from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues, SubmitHandler} from "@modular-forms/qwik";
import { useForm, zodForm$ } from "@modular-forms/qwik";
import NavBar from "~/components/nav-bar/nav-bar";
import apiFetch from "~/helper-functions/fetch";
import CSS from './index.css?inline'


const LoginSchema = z.object({
   email: z
    .string()
    .min(1, 'Please enter your email.')
    .email('The email address is badly formatted.'),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .min(8, 'You password must have 8 characters or more.'),
});

type LoginForm = z.infer<typeof LoginSchema>
export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
	email: '',
	password: '',
}));


export default component$(() => {
	useStylesScoped$(CSS)
	const errorMessage = useSignal('');
	

	const [LoginForm, {Form, Field}] = useForm({
		loader: useFormLoader(),
		validate: zodForm$(LoginSchema)
	})

	const handleSubmit = $<SubmitHandler<LoginForm>>(async (values, event) => {
		try {
		await apiFetch('/auth/login', {method: 'Post', credentials:'include', body: JSON.stringify(values)})
		}
		catch(error: any) {
			if(error && typeof error.message === 'string'){
				errorMessage.value = error.message
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
		<label for="password">password</label>
  <Field name="password">
	{(field, props) => (
    <div>
      <input {...props} type="password" id="password" class="loginInput" placeholder="********" value={field.value} />
      {field.error && <div class="error">{field.error}</div>}
    </div>
  )}
  </Field>
  <button type="submit" class="loginButton">Login</button>
	<p class="message">{errorMessage.value}</p>
	</Form>
	</div>
	</>
	)
}) 
