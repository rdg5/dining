import {
  component$, useSignal, useVisibleTask$,
} from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { supabase } from "~/utils/supabase";

export default component$(() => {
	const isProtectedOk = useSignal(false);
	const navigate = useNavigate();

	useVisibleTask$(() => {
		const timeout = setTimeout(async () => {
     const {data, error} = await supabase.auth.getUser();

			if(data?.user?.id && !error) {
				isProtectedOk.value = true;
				await navigate('/members/dashboard');
			} else {
				console.error(error);
				await navigate('/login')
			}
		},500)

		return (() => {
			clearTimeout(timeout)
		})
	})

  return (
    <>
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
