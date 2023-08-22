import { $, component$, useStylesScoped$, useSignal } from "@builder.io/qwik";
import { routeLoader$, useNavigate, z } from "@builder.io/qwik-city";
import type { InitialValues, SubmitHandler} from "@modular-forms/qwik";
import { email, useForm, zodForm$ } from "@modular-forms/qwik";
import { supabase } from "~/utils/supabase";
import  CSS  from './index.css?inline'
// import apiFetch from "~/helper-functions/fetch";
import NavBar from "~/components/nav-bar/nav-bar";



const RegisterSchema = z.object({
   email: z
    .string()
    .min(1, 'Please enter your email.')
    .email('The email address is badly formatted.'),
});
 
type RegisterForm = z.infer<typeof RegisterSchema>;
export const useFormLoader = routeLoader$<InitialValues<RegisterForm>>(() => ({
	username: '',
  email: '',
  password: '',
}));

export default component$ (() => {
		useStylesScoped$(CSS);
		const login = useNavigate();
		const errorMessage = useSignal('');
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [RegisterForm, { Form, Field }] = useForm<RegisterForm>({
			loader: useFormLoader(),
      validate: zodForm$(RegisterSchema),
	})

	const handleSubmit = $<SubmitHandler<RegisterForm>>( async (values) => {
		const email = values.email
		const timestamp = Date.now();
		const password = Math.floor(Math.random() * 1000000) + email + timestamp;

		try {
			await supabase.auth.signUp({
			email: email,
			password: password,
		})
      await login('/login')
	} catch (error: any) {
		if(error && typeof error.message === 'string') {
			errorMessage.value = error.message;	
	}
	}

  });


	return(
		<>
		<NavBar />
		<div class="page">
			<h3 class="registerTitle">Register</h3>
		<Form onSubmit$={handleSubmit} class="form">
			<label for="email">email</label>
		<Field name="email">
    {(field, props) => (
    <div>
      <input {...props} type="email"  id="email" class="registerInput" placeholder="gandalf@gmail.com" value={field.value} />
      {field.error && <div class="error">{field.error}</div>}
    </div>
  )}
  </Field>
  <button type="submit" class="registerButton">Register</button>
	<p class="message">{errorMessage.value}</p>
		</Form>
	</div>
	</>
	)
})
