import { component$ } from "@builder.io/qwik";
import NavBar from "~/components/nav-bar/nav-bar";



export default component$(() => {

  return(
    <>
    <NavBar />
    <h1>This is the dashboard</h1>
    </>
  )
})