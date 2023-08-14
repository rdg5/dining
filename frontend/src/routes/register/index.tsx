import { $, component$, useStylesScoped$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues, SubmitHandler} from "@modular-forms/qwik";
import { useForm, zodForm$ } from "@modular-forms/qwik";
import  CSS  from './index.css?inline'

const RegisterSchema = z.object({
	username: z
    .string()
    .min(1, 'Please enter your username.')
    .min(4, 'Your username must have 4 characters or more'),
   email: z
    .string()
    .min(1, 'Please enter your email.')
    .email('The email address is badly formatted.'),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .min(8, 'You password must have 8 characters or more.'),
});
 
type RegisterForm = z.infer<typeof RegisterSchema>;
export const useFormLoader = routeLoader$<InitialValues<RegisterForm>>(() => ({
	username: '',
  email: '',
  password: '',
}));



export default component$ (() => {
		useStylesScoped$(CSS);
		const [RegisterForm, { Form, Field, FieldArray }] = useForm<RegisterForm>({
			loader: useFormLoader(),
      validate: zodForm$(RegisterSchema),
	})
	const handleSubmit = $<SubmitHandler<RegisterForm>>( async (values, event) => {
		const response = await fetch("http://localhost:3000/auth/register", {
			method: 'post',
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(values)
		})
		console.log(response)
  });


	return(
		<div class="page">
			<h3 id="registerTitle">Register</h3>
		<Form onSubmit$={handleSubmit} class="form">
		<label for="username">username</label>
		<Field name="username">
		{(field, props) => (
    <div>
      <input {...props} type="username" id="username" class="registerInput" placeholder="Gandalf" value={field.value} />
      {field.error && <div class="error">{field.error}</div>}
    </div>
  )}
  </Field>
			<label for="email">email</label>
		<Field name="email">
    {(field, props) => (
    <div>
      <input {...props} type="email"  id="email" class="registerInput" placeholder="gandalf@gmail.com" value={field.value} />
      {field.error && <div class="error">{field.error}</div>}
    </div>
  )}
  </Field>
		<label for="password">password</label>
  <Field name="password">
	{(field, props) => (
    <div>
      <input {...props} type="password" id="password" class="registerInput" placeholder="********" value={field.value} />
      {field.error && <div class="error">{field.error}</div>}
    </div>
  )}
  </Field>
  <button type="submit" class="register-button">Register</button>
		</Form>
	</div>
	)
})