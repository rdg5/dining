import { $, component$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues, SubmitHandler} from "@modular-forms/qwik";
import { useForm, zodForm$ } from "@modular-forms/qwik";


const RegisterSchema = z.object({
	username: z
    .string()
    .min(1, 'Please enter your username.'),
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
		<>
		<Form onSubmit$={handleSubmit}>
		<Field name="username">
		{(field, props) => (
    <div>
      <input {...props} type="username" value={field.value} />
      {field.error && <div>{field.error}</div>}
    </div>
  )}
  </Field>
		<Field name="email">
    {(field, props) => (
    <div>
      <input {...props} type="email" value={field.value} />
      {field.error && <div>{field.error}</div>}
    </div>
  )}
  </Field>
  <Field name="password">
	{(field, props) => (
    <div>
      <input {...props} type="password" value={field.value} />
      {field.error && <div>{field.error}</div>}
    </div>
  )}
  </Field>
  <button type="submit">Register</button>
		</Form>
	</>
	)
})
