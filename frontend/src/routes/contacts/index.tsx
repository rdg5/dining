import { component$, useTask$ } from "@builder.io/qwik";
import axios from "axios";

export default component$(() => {

    // Since we want to re-run the task whenever the `page` changes,
    // we need to track it.
 
    // Tasks can run async code, such as fetching data.
		useTask$( async() => {
			try {
				const response = await axios.get("http://localhost:3000/api/users", {
					withCredentials: true,
				// const response = await fetch("http://localhost:3000/api/users", {method: "get", })
			})
				console.log(response)
				// });
				// console.log(response.data)
			}
			catch (error) {
				console.log(error);
			}
		})
    // Assigning to a signal will trigger a re-render.
	return(
		<div>
			<h1>These would be the contacts</h1>
			<p>these are the contacts</p>
		</div>
	);
});