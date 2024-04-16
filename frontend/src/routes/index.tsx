import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from "./index.css?inline";
export default component$(() => {
  useStyles$(styles);
  return (
    <div class="landing-container">
      <nav class="navbar">
        <span class="logo">CityTransit</span>
        <div class="nav-links">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
          <button q:onclick="signIn" class="sign-in-button">
            Sign In
          </button>
        </div>
      </nav>
      <header class="hero">
        <h1>Travel Smart, Travel Fast</h1>
        <p>
          Experience the best in city transportation. Reliable, timely, and
          comfortable.
        </p>
        <button q:onclick="getStarted" class="cta-button">
          Get Started
        </button>
      </header>
      <section class="features">
        <div class="feature-item">
          <h2>Efficient Routing</h2>
          <p>
            Optimized routes to get you to your destination faster than ever.
          </p>
        </div>
        <div class="feature-item">
          <h2>Eco-Friendly Options</h2>
          <p>Commitment to reducing carbon footprint with green solutions.</p>
        </div>
        <div class="feature-item">
          <h2>Easy Ticket Access</h2>
          <p>
            Quick ticket purchases and easy QR code generation right from your
            phone.
          </p>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
