import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to Urbanfix! 🛠️</h1>
      <p>
        You have successfully logged in and redirected to the home dashboard.
      </p>

      <div style={{ marginTop: "2rem" }}>
        <Link
          href="/login"
          style={{ color: "red", textDecoration: "underline" }}
        >
          Log Out (Simulated)
        </Link>
      </div>
    </main>
  );
}
