import { component$, useStyles$ } from "@builder.io/qwik";

import styles from "./index.css?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <div class="container">
      <header>
        <h1>User Dashboard</h1>
        <p>
          Access and manage your tickets, view routes, and scan QR for rides.
        </p>
      </header>
      <section class="features">
        <button class="feature-button">My Tickets</button>
        <button class="feature-button">Schedule</button>
        <button class="feature-button">Generate QR Code</button>
      </section>
      <button class="logout-button">Logout</button>
    </div>
  );
});

